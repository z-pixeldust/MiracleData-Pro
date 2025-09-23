#!/usr/bin/env node

/**
 * WebSocket Server for Real-Time Google Sheets to Figma Variables Sync
 * 
 * This server simulates Google Sheets data and provides real-time updates
 * to the Figma plugin via WebSocket connections.
 */

const WebSocket = require('ws');
const express = require('express');
const cors = require('cors');
const http = require('http');
const fs = require('fs');
const path = require('path');
const CSVHandler = require('./csv-handler');

class FigmaSyncServer {
  constructor(port = 3001) {
    this.port = port;
    this.clients = new Map(); // Store connected clients
    this.mockSheetsData = this.initializeMockData();
    this.syncIntervals = new Map(); // Track sync intervals per client
    this.csvHandler = new CSVHandler(); // Handle CSV uploads
    this.uploadedSpreadsheets = new Map(); // Store uploaded CSV data
    this.fileWatchers = new Map(); // Track file watchers
    this.fileChangeTimeouts = new Map(); // Debounce file changes
    
    this.setupExpress();
    this.setupWebSocket();
    this.startMockDataUpdates();
  }

  setupExpress() {
    this.app = express();
    this.app.use(cors());
    this.app.use(express.json());

    // Health check endpoint
    this.app.get('/health', (req, res) => {
      res.json({ 
        status: 'healthy', 
        clients: this.clients.size,
        timestamp: new Date().toISOString()
      });
    });

    // Mock Google Sheets API endpoint
    this.app.get('/api/spreadsheets/:id', (req, res) => {
      const spreadsheetId = req.params.id;
      const mockData = this.mockSheetsData[spreadsheetId];
      
      if (!mockData) {
        return res.status(404).json({ error: 'Spreadsheet not found' });
      }
      
      res.json({
        spreadsheetId,
        title: mockData.title,
        sheets: mockData.sheets,
        lastModified: new Date().toISOString()
      });
    });

    // Get sheet data endpoint
    this.app.get('/api/spreadsheets/:id/sheets/:sheetName', (req, res) => {
      const { id: spreadsheetId, sheetName } = req.params;
      
      // Check if it's an uploaded spreadsheet
      if (this.uploadedSpreadsheets.has(spreadsheetId)) {
        const uploadedData = this.uploadedSpreadsheets.get(spreadsheetId);
        console.log('🔍 API Debug - uploadedData:', {
          spreadsheetId,
          dataType: typeof uploadedData.data,
          isArray: Array.isArray(uploadedData.data),
          dataLength: uploadedData.data?.length,
          headers: uploadedData.headers
        });
        
        // Ensure data is not a Promise
        if (uploadedData.data && typeof uploadedData.data.then === 'function') {
          console.log('⚠️ Data is still a Promise, awaiting...');
          uploadedData.data.then(resolvedData => {
            uploadedData.data = resolvedData;
            this.uploadedSpreadsheets.set(spreadsheetId, uploadedData);
            res.json({
              spreadsheetId,
              sheetName: 'Sheet1',
              data: resolvedData,
              headers: uploadedData.headers
            });
          }).catch(error => {
            console.error('❌ Error resolving data Promise:', error);
            res.status(500).json({ error: 'Failed to resolve data' });
          });
          return;
        }
        
        return res.json({
          spreadsheetId,
          sheetName: 'Sheet1',
          data: uploadedData.data,
          headers: uploadedData.headers
        });
      }
      
      // Check mock data
      const mockData = this.mockSheetsData[spreadsheetId];
      if (!mockData || !mockData.sheets[sheetName]) {
        return res.status(404).json({ error: 'Sheet not found' });
      }
      
      res.json({
        spreadsheetId,
        sheetName,
        data: mockData.sheets[sheetName].data,
        headers: mockData.sheets[sheetName].headers
      });
    });

    // Upload CSV endpoint
    this.app.post('/api/upload-csv', (req, res) => {
      try {
        const { fileName, csvContent } = req.body;
        
        if (!fileName || !csvContent) {
          return res.status(400).json({ error: 'fileName and csvContent are required' });
        }

        this.csvHandler.processUploadedCSV(fileName, csvContent)
          .then(spreadsheetData => {
            // Store in memory for real-time updates
            this.uploadedSpreadsheets.set(spreadsheetData.spreadsheetId, {
              title: spreadsheetData.title,
              fileName: fileName,
              headers: spreadsheetData.headers,
              data: spreadsheetData.data,
              lastModified: spreadsheetData.lastModified
            });

            // Start file watching for real-time updates
            const filePath = path.join(this.csvHandler.uploadDir || './uploads', fileName);
            this.startFileWatcher(filePath, spreadsheetData.spreadsheetId);

            console.log('📊 CSV uploaded and processed:', spreadsheetData.spreadsheetId);
            
            res.json({
              success: true,
              spreadsheetId: spreadsheetData.spreadsheetId,
              title: spreadsheetData.title,
              headers: spreadsheetData.headers,
              rowCount: spreadsheetData.rowCount,
              message: 'CSV uploaded and processed successfully'
            });
          })
          .catch(error => {
            console.error('❌ Error processing CSV:', error);
            res.status(500).json({ error: error.message });
          });

      } catch (error) {
        console.error('❌ Error handling CSV upload:', error);
        res.status(500).json({ error: error.message });
      }
    });

    // Get uploaded spreadsheets list
    this.app.get('/api/uploaded-spreadsheets', (req, res) => {
      try {
        const uploaded = Array.from(this.uploadedSpreadsheets.entries()).map(([id, data]) => ({
          spreadsheetId: id,
          title: data.title,
          headers: data.headers,
          rowCount: data.data.length,
          lastModified: data.lastModified
        }));

        res.json({ uploadedSpreadsheets: uploaded });
      } catch (error) {
        console.error('❌ Error getting uploaded spreadsheets:', error);
        res.status(500).json({ error: error.message });
      }
    });

    // API endpoint to manually trigger data refresh
    // Accepts either a clientId or a spreadsheetId (the UI sends spreadsheetId)
    this.app.post('/api/refresh/:id', async (req, res) => {
      const { id } = req.params;
      try {
        // If id matches a connected client, use it directly
        let targetClientId = this.clients.has(id) ? id : null;

        // Otherwise, treat id as a spreadsheetId and find the client
        if (!targetClientId) {
          for (const [clientId, client] of this.clients.entries()) {
            if (client.spreadsheetId === id) {
              targetClientId = clientId;
              break;
            }
          }
        }

        if (!targetClientId) {
          return res.status(404).json({ error: 'No active client found for this id' });
        }

        await this.sendSheetUpdate(targetClientId);
        res.json({ success: true, message: 'Data refreshed successfully', clientId: targetClientId });
      } catch (error) {
        console.error('❌ Error refreshing data:', error);
        res.status(500).json({ error: 'Failed to refresh data' });
      }
    });

    // API endpoint to test WebSocket updates
    this.app.post('/api/test-update/:spreadsheetId', async (req, res) => {
      const { spreadsheetId } = req.params;
      try {
        // Find client with this spreadsheet ID
        let targetClientId = null;
        for (const [clientId, client] of this.clients.entries()) {
          if (client.spreadsheetId === spreadsheetId) {
            targetClientId = clientId;
            break;
          }
        }
        
        if (targetClientId) {
          await this.sendSheetUpdate(targetClientId);
          res.json({ success: true, message: 'Test update sent', clientId: targetClientId });
        } else {
          res.status(404).json({ error: 'No active client found for this spreadsheet' });
        }
      } catch (error) {
        console.error('❌ Error sending test update:', error);
        res.status(500).json({ error: 'Failed to send test update' });
      }
    });
  }

  setupWebSocket() {
    this.server = http.createServer(this.app);
    this.wss = new WebSocket.Server({ server: this.server });

    this.wss.on('connection', (ws, req) => {
      const clientId = this.generateClientId();
      const clientInfo = {
        id: clientId,
        ws,
        connectedAt: new Date(),
        lastPing: new Date(),
        spreadsheetId: null,
        collectionId: null,
        config: {}
      };

      this.clients.set(clientId, clientInfo);
      console.log(`🔌 Client connected: ${clientId} (Total: ${this.clients.size})`);

      // Send welcome message
      ws.send(JSON.stringify({
        type: 'connection',
        clientId,
        message: 'Connected to Figma Sync Server',
        timestamp: new Date().toISOString()
      }));

      // Handle incoming messages
      ws.on('message', async (data) => {
        try {
          const message = JSON.parse(data);
          await this.handleClientMessage(clientId, message);
        } catch (error) {
          console.error(`❌ Error parsing message from ${clientId}:`, error);
          this.sendError(ws, 'Invalid message format');
        }
      });

      // Handle client disconnect
      ws.on('close', () => {
        this.handleClientDisconnect(clientId);
      });

      // Handle ping/pong for connection health
      ws.on('pong', () => {
        clientInfo.lastPing = new Date();
      });

      // Send periodic ping
      const pingInterval = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.ping();
        } else {
          clearInterval(pingInterval);
        }
      }, 30000);
    });

    // Start the server
    this.server.listen(this.port, () => {
      console.log(`🚀 Figma Sync Server running on port ${this.port}`);
      console.log(`📡 WebSocket endpoint: ws://localhost:${this.port}`);
      console.log(`🌐 HTTP API endpoint: http://localhost:${this.port}`);
    });
  }

  async handleClientMessage(clientId, message) {
    const client = this.clients.get(clientId);
    if (!client) return;

    console.log(`📨 Message from ${clientId}:`, message.type);

    switch (message.type) {
      case 'start-sync':
        await this.handleStartSync(clientId, message.data);
        break;
      
      case 'stop-sync':
        this.handleStopSync(clientId);
        break;
      
      case 'request-data':
        this.handleDataRequest(clientId, message.data);
        break;
      
      case 'ping':
        this.sendMessage(clientId, { type: 'pong', timestamp: new Date().toISOString() });
        break;
      
      default:
        console.warn(`⚠️ Unknown message type: ${message.type}`);
        this.sendError(client.ws, `Unknown message type: ${message.type}`);
    }
  }

  async handleStartSync(clientId, syncConfig) {
    const client = this.clients.get(clientId);
    if (!client) return;

    const { spreadsheetId, collectionId, syncInterval = 5000 } = syncConfig;
    
    client.spreadsheetId = spreadsheetId;
    client.collectionId = collectionId;
    client.config = syncConfig;

    console.log(`🔄 Starting sync for ${clientId}:`, { spreadsheetId, collectionId });

    // Stop existing sync if any
    this.handleStopSync(clientId);

    // Disable automatic updates - only send updates on manual trigger
    // const interval = setInterval(async () => {
    //   await this.sendSheetUpdate(clientId);
    // }, syncInterval);

    // this.syncIntervals.set(clientId, interval);

    // Send initial data
    await this.sendSheetUpdate(clientId);

    this.sendMessage(clientId, {
      type: 'sync-started',
      data: {
        spreadsheetId,
        collectionId,
        syncInterval,
        timestamp: new Date().toISOString()
      }
    });
  }

  handleStopSync(clientId) {
    const interval = this.syncIntervals.get(clientId);
    if (interval) {
      clearInterval(interval);
      this.syncIntervals.delete(clientId);
      console.log(`⏹️ Stopped sync for ${clientId}`);
      
      this.sendMessage(clientId, {
        type: 'sync-stopped',
        timestamp: new Date().toISOString()
      });
    }
  }

  handleDataRequest(clientId, requestData) {
    const { spreadsheetId, sheetName } = requestData;
    const mockData = this.mockSheetsData[spreadsheetId];
    
    if (!mockData) {
      this.sendError(clientId, `Spreadsheet ${spreadsheetId} not found`);
      return;
    }

    const sheetData = sheetName ? mockData.sheets[sheetName] : mockData.sheets['Sheet1'];
    if (!sheetData) {
      this.sendError(clientId, `Sheet ${sheetName} not found`);
      return;
    }

    this.sendMessage(clientId, {
      type: 'sheet-data',
      data: {
        spreadsheetId,
        sheetName: sheetName || 'Sheet1',
        headers: sheetData.headers,
        data: sheetData.data,
        timestamp: new Date().toISOString()
      }
    });
  }

  async sendSheetUpdate(clientId) {
    const client = this.clients.get(clientId);
    if (!client || !client.spreadsheetId) return;

    let sheetData = null;

    // Check if it's an uploaded spreadsheet
    if (this.uploadedSpreadsheets.has(client.spreadsheetId)) {
      // Re-read the CSV file to get latest changes
      try {
        const uploadedData = this.uploadedSpreadsheets.get(client.spreadsheetId);
        console.log('🔍 Debug uploadedData:', uploadedData);
        
        let filePath = path.join(this.csvHandler.uploadDir || path.join(__dirname, 'uploads'), uploadedData.fileName || 'Fox Plan Card Simple.csv');
        
        // Check for Desktop file as fallback for "Fox Plan Card Simple.csv"
        if (!fs.existsSync(filePath) && (uploadedData.fileName === 'Fox Plan Card Simple.csv' || filePath.includes('Fox Plan Card Simple.csv'))) {
          const desktopPath = '/Users/joseph.a.lasko/Desktop/Fox Plan Card Simple.csv';
          if (fs.existsSync(desktopPath)) {
            filePath = desktopPath;
            console.log(`📁 Using Desktop file: ${desktopPath}`);
          }
        }
        
        if (fs.existsSync(filePath)) {
          const csvContent = fs.readFileSync(filePath, 'utf8');
          const parsedData = await this.csvHandler.parseCSV(csvContent);

          // Compute changes from previous cached data to new file data
          const previousData = uploadedData.data || [];
          const changes = this.computeDataDiff(previousData, parsedData.data);

          // Update the stored data with fresh data from file
          this.uploadedSpreadsheets.set(client.spreadsheetId, {
            ...uploadedData,
            headers: parsedData.headers,
            data: parsedData.data,
            lastModified: new Date().toISOString()
          });

          sheetData = {
            headers: parsedData.headers,
            data: parsedData.data,
            changes
          };

          console.log(`📖 Re-read CSV file: ${uploadedData.fileName} (${parsedData.rowCount} rows)`);
        } else {
          // Fallback to stored data if file doesn't exist
          sheetData = {
            headers: uploadedData.headers,
            data: uploadedData.data,
            changes: {}
          };
        }
      } catch (error) {
        console.error('❌ Error re-reading CSV file:', error);
        // Fallback to stored data
        const uploadedData = this.uploadedSpreadsheets.get(client.spreadsheetId);
        sheetData = {
          headers: uploadedData.headers,
          data: uploadedData.data,
          changes: {}
        };
      }
    } else {
      // Check mock data
      const mockData = this.mockSheetsData[client.spreadsheetId];
      if (!mockData) return;
      sheetData = mockData.sheets['Sheet1'];
    }

    // Determine changes: for uploaded CSVs, use actual file diff; for mock data, simulate
    const changes =
      this.uploadedSpreadsheets.has(client.spreadsheetId)
        ? sheetData.changes || {}
        : this.simulateDataChanges(sheetData.data);

    this.sendMessage(clientId, {
      type: 'sheet-update',
      data: {
        spreadsheetId: client.spreadsheetId,
        collectionId: client.collectionId,
        changes,
        timestamp: new Date().toISOString()
      }
    });
  }

  simulateDataChanges(data) {
    // Randomly update 1-3 values to simulate real-time changes
    const changes = {};
    const numChanges = Math.floor(Math.random() * 3) + 1;
    
    for (let i = 0; i < numChanges; i++) {
      const randomRow = Math.floor(Math.random() * data.length);
      const randomCol = Math.floor(Math.random() * data[0].length);
      const newValue = this.generateRandomValue(randomCol);
      
      if (!changes[randomRow]) changes[randomRow] = {};
      changes[randomRow][randomCol] = newValue;
      
      // Update the actual data
      data[randomRow][randomCol] = newValue;
    }

    return changes;
  }

  // Build a sparse map of changes between two 2D arrays
  computeDataDiff(previousData, nextData) {
    const changes = {};
    const maxRows = Math.max(previousData.length, nextData.length);
    for (let r = 0; r < maxRows; r++) {
      const prevRow = previousData[r] || [];
      const nextRow = nextData[r] || [];
      const maxCols = Math.max(prevRow.length, nextRow.length);
      for (let c = 0; c < maxCols; c++) {
        const prevVal = prevRow[c] ?? '';
        const nextVal = nextRow[c] ?? '';
        if (prevVal !== nextVal) {
          if (!changes[r]) changes[r] = {};
          changes[r][c] = nextVal;
        }
      }
    }
    return changes;
  }

  generateRandomValue(columnIndex) {
    // Generate different types of values based on column
    switch (columnIndex) {
      case 0: // Name column
        const names = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve'];
        return names[Math.floor(Math.random() * names.length)];
      
      case 1: // Age column
        return Math.floor(Math.random() * 50) + 20;
      
      case 2: // Score column
        return (Math.random() * 100).toFixed(1);
      
      case 3: // Color column
        const colors = ['#FF5733', '#33FF57', '#3357FF', '#FF33F5', '#F5FF33'];
        return colors[Math.floor(Math.random() * colors.length)];
      
      default:
        return Math.random().toFixed(2);
    }
  }

  sendMessage(clientId, message) {
    const client = this.clients.get(clientId);
    if (client && client.ws.readyState === WebSocket.OPEN) {
      client.ws.send(JSON.stringify(message));
    }
  }

  sendError(client, error) {
    const errorMessage = {
      type: 'error',
      error: typeof error === 'string' ? error : error.message,
      timestamp: new Date().toISOString()
    };

    if (typeof client === 'string') {
      this.sendMessage(client, errorMessage);
    } else {
      client.send(JSON.stringify(errorMessage));
    }
  }

  handleClientDisconnect(clientId) {
    const client = this.clients.get(clientId);
    const spreadsheetId = client ? client.spreadsheetId : null;
    
    this.handleStopSync(clientId);
    this.clients.delete(clientId);
    console.log(`🔌 Client disconnected: ${clientId} (Total: ${this.clients.size})`);
    
    // If no more clients are connected to this spreadsheet, stop file watching
    if (spreadsheetId) {
      const hasActiveClients = Array.from(this.clients.values()).some(c => c.spreadsheetId === spreadsheetId);
      if (!hasActiveClients) {
        this.stopFileWatcher(spreadsheetId);
      }
    }
  }

  startMockDataUpdates() {
    // Simulate periodic data updates every 10 seconds
    setInterval(() => {
      Object.keys(this.mockSheetsData).forEach(spreadsheetId => {
        const mockData = this.mockSheetsData[spreadsheetId];
        const sheetData = mockData.sheets['Sheet1'];
        
        // Update last modified timestamp
        mockData.lastModified = new Date().toISOString();
        
        // Simulate some data changes
        this.simulateDataChanges(sheetData.data);
      });
    }, 10000);
  }

  initializeMockData() {
    return {
      'test-spreadsheet-1': {
        title: 'Sample Sports Data',
        lastModified: new Date().toISOString(),
        sheets: {
          'Sheet1': {
            headers: ['Player Name', 'Age', 'Score', 'Team Color'],
            data: [
              ['Alice Johnson', 28, '95.5', '#FF5733'],
              ['Bob Smith', 32, '87.2', '#33FF57'],
              ['Charlie Brown', 25, '92.8', '#3357FF'],
              ['Diana Prince', 30, '89.1', '#FF33F5'],
              ['Eve Wilson', 27, '94.3', '#F5FF33']
            ]
          }
        }
      },
      'test-spreadsheet-2': {
        title: 'Company Metrics',
        lastModified: new Date().toISOString(),
        sheets: {
          'Sheet1': {
            headers: ['Department', 'Revenue', 'Growth %', 'Status Color'],
            data: [
              ['Sales', 125000, '15.2', '#4CAF50'],
              ['Marketing', 89000, '8.7', '#2196F3'],
              ['Engineering', 156000, '22.1', '#FF9800'],
              ['Support', 67000, '5.3', '#9C27B0']
            ]
          }
        }
      }
    };
  }

  /**
   * Start watching a CSV file for changes
   */
  startFileWatcher(filePath, spreadsheetId) {
    console.log(`👀 Starting file watcher for: ${filePath}`);
    
    const watcher = fs.watch(filePath, (eventType, filename) => {
      if (eventType === 'change') {
        console.log(`📝 File changed: ${filename}`);
        
        // Debounce file changes (wait 500ms after last change)
        const existingTimeout = this.fileChangeTimeouts.get(spreadsheetId);
        if (existingTimeout) {
          clearTimeout(existingTimeout);
        }
        
        const timeout = setTimeout(() => {
          this.handleFileChange(filePath, spreadsheetId);
          this.fileChangeTimeouts.delete(spreadsheetId);
        }, 500);
        
        this.fileChangeTimeouts.set(spreadsheetId, timeout);
      }
    });

    watcher.on('error', (error) => {
      console.error(`❌ File watcher error for ${filePath}:`, error);
    });

    this.fileWatchers.set(spreadsheetId, watcher);
  }

  /**
   * Stop watching a CSV file
   */
  stopFileWatcher(spreadsheetId) {
    const watcher = this.fileWatchers.get(spreadsheetId);
    if (watcher) {
      watcher.close();
      this.fileWatchers.delete(spreadsheetId);
      console.log(`🛑 Stopped file watcher for spreadsheet: ${spreadsheetId}`);
    }
    
    // Clear any pending timeout
    const timeout = this.fileChangeTimeouts.get(spreadsheetId);
    if (timeout) {
      clearTimeout(timeout);
      this.fileChangeTimeouts.delete(spreadsheetId);
    }
  }

  /**
   * Handle file change events
   */
  async handleFileChange(filePath, spreadsheetId) {
    try {
      console.log(`🔄 File change detected, processing: ${filePath}`);
      
      // Read the updated file
      const csvContent = fs.readFileSync(filePath, 'utf8');
      
      // Check if file is empty
      if (!csvContent.trim()) {
        console.log('⚠️ File is empty, skipping update');
        return;
      }
      
      const parsedResult = await this.csvHandler.parseCSV(csvContent);
      
      if (parsedResult.data.length === 0) {
        console.log('⚠️ No data found in updated file');
        return;
      }

      // Update the stored data
      const uploadedData = this.uploadedSpreadsheets.get(spreadsheetId);
      if (uploadedData) {
        uploadedData.data = parsedResult.data; // Store just the data array, not the whole object
        uploadedData.lastModified = new Date().toISOString();
        this.uploadedSpreadsheets.set(spreadsheetId, uploadedData);
        
        console.log(`✅ Updated data for spreadsheet: ${spreadsheetId}`);
        
        // Send updates to all connected clients for this spreadsheet
        this.broadcastUpdatesToClients(spreadsheetId);
      }
    } catch (error) {
      console.error(`❌ Error handling file change:`, error);
    }
  }

  /**
   * Broadcast updates to all clients connected to a specific spreadsheet
   */
  broadcastUpdatesToClients(spreadsheetId) {
    const uploadedData = this.uploadedSpreadsheets.get(spreadsheetId);
    if (!uploadedData) return;

    let updateCount = 0;
    
    for (const [clientId, client] of this.clients.entries()) {
      if (client.spreadsheetId === spreadsheetId) {
        this.sendSheetUpdate(clientId);
        updateCount++;
      }
    }
    
    console.log(`📡 Broadcasted updates to ${updateCount} clients for spreadsheet: ${spreadsheetId}`);
  }

  generateClientId() {
    return 'client_' + Math.random().toString(36).substr(2, 9);
  }
}

// Start the server
const server = new FigmaSyncServer(3001);

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down server...');
  
  // Close all file watchers
  for (const [spreadsheetId, watcher] of server.fileWatchers.entries()) {
    watcher.close();
    console.log(`🛑 Stopped file watcher for: ${spreadsheetId}`);
  }
  
  server.server.close(() => {
    console.log('✅ Server stopped');
    process.exit(0);
  });
});

module.exports = FigmaSyncServer;
