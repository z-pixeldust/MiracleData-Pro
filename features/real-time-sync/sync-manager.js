// Sync Manager for Real-Time Google Sheets to Figma Variables
// Phase 3: Main sync coordination

class SyncManager {
    constructor() {
        this.oauth = null;
        this.sheetsAPI = null;
        this.websocketClient = null;
        this.dataMapper = null;
        
        this.activeSyncs = new Map(); // spreadsheetId -> sync info
        this.syncConfig = {
            autoSync: true,
            interval: 'realtime',
            notifications: true,
            retryAttempts: 3,
            retryDelay: 1000
        };
        
        this.isInitialized = false;
    }
    
    // Initialize sync manager with dependencies
    async initialize(oauth, sheetsAPI, websocketClient, dataMapper) {
        try {
            console.log('SyncManager: Initializing...');
            
            this.oauth = oauth;
            this.sheetsAPI = sheetsAPI;
            this.websocketClient = websocketClient;
            this.dataMapper = dataMapper;
            
            // Set up WebSocket event handlers
            this.setupWebSocketHandlers();
            
            this.isInitialized = true;
            console.log('SyncManager: Initialized successfully');
            
        } catch (error) {
            console.error('SyncManager: Initialization failed', error);
            throw error;
        }
    }
    
    // Set up WebSocket event handlers
    setupWebSocketHandlers() {
        if (!this.websocketClient) return;
        
        this.websocketClient.on('connected', (data) => {
            console.log('SyncManager: WebSocket connected');
            this.notifySyncStatus('connected', 'WebSocket connected');
        });
        
        this.websocketClient.on('disconnected', (data) => {
            console.log('SyncManager: WebSocket disconnected');
            this.notifySyncStatus('disconnected', 'WebSocket disconnected');
        });
        
        this.websocketClient.on('sync_update', (data) => {
            this.handleSyncUpdate(data);
        });
        
        this.websocketClient.on('error', (data) => {
            console.error('SyncManager: WebSocket error', data);
            this.notifySyncStatus('error', data.error || 'WebSocket error');
        });
    }
    
    // Start real-time sync for a spreadsheet
    async startSync(spreadsheetId, collectionId, config = {}) {
        try {
            if (!this.isInitialized) {
                throw new Error('SyncManager not initialized');
            }
            
            console.log(`SyncManager: Starting sync for spreadsheet ${spreadsheetId}`);
            
            // Check if already syncing
            if (this.activeSyncs.has(spreadsheetId)) {
                console.log(`SyncManager: Already syncing spreadsheet ${spreadsheetId}`);
                return { success: true, message: 'Already syncing this spreadsheet' };
            }
            
            // Validate access to spreadsheet
            const hasAccess = await this.sheetsAPI.validateAccess(spreadsheetId);
            if (!hasAccess) {
                throw new Error('No access to spreadsheet or spreadsheet not found');
            }
            
            // Get spreadsheet info
            const spreadsheetInfo = await this.sheetsAPI.getSpreadsheetInfo(spreadsheetId);
            
            // Get initial data
            const sheetData = await this.getInitialSheetData(spreadsheetId);
            
            // Transform data to Figma variables
            const variables = await this.dataMapper.transformSheetDataToVariables(sheetData, collectionId);
            
            // Create/update variables in Figma
            const updateResult = await this.updateFigmaVariables(variables, collectionId);
            
            // Set up real-time sync
            const syncInfo = {
                spreadsheetId,
                collectionId,
                config: { ...this.syncConfig, ...config },
                lastSync: Date.now(),
                variablesUpdated: updateResult.variablesUpdated,
                status: 'active'
            };
            
            this.activeSyncs.set(spreadsheetId, syncInfo);
            
            // Subscribe to WebSocket updates
            if (this.websocketClient && this.websocketClient.isConnected) {
                this.websocketClient.subscribeToSync(spreadsheetId, collectionId);
            }
            
            // Set up polling fallback if not using real-time
            if (config.interval !== 'realtime') {
                this.setupPollingSync(spreadsheetId, config.interval);
            }
            
            this.notifySyncStatus('success', `Sync started for ${spreadsheetInfo.title}`);
            
            return {
                success: true,
                message: `Sync started for ${spreadsheetInfo.title}`,
                variablesUpdated: updateResult.variablesUpdated,
                lastSync: new Date().toISOString()
            };
            
        } catch (error) {
            console.error('SyncManager: Failed to start sync', error);
            this.notifySyncStatus('error', error.message);
            
            return {
                success: false,
                error: error.message
            };
        }
    }
    
    // Stop real-time sync
    async stopSync(spreadsheetId) {
        try {
            console.log(`SyncManager: Stopping sync for spreadsheet ${spreadsheetId}`);
            
            const syncInfo = this.activeSyncs.get(spreadsheetId);
            if (!syncInfo) {
                return { success: true, message: 'No active sync found' };
            }
            
            // Unsubscribe from WebSocket updates
            if (this.websocketClient && this.websocketClient.isConnected) {
                this.websocketClient.unsubscribeFromSync(spreadsheetId);
            }
            
            // Clear polling interval
            this.clearPollingSync(spreadsheetId);
            
            // Remove from active syncs
            this.activeSyncs.delete(spreadsheetId);
            
            this.notifySyncStatus('success', 'Sync stopped');
            
            return {
                success: true,
                message: 'Sync stopped successfully'
            };
            
        } catch (error) {
            console.error('SyncManager: Failed to stop sync', error);
            this.notifySyncStatus('error', error.message);
            
            return {
                success: false,
                error: error.message
            };
        }
    }
    
    // Get initial sheet data
    async getInitialSheetData(spreadsheetId) {
        try {
            // Get the first sheet (or allow user to specify)
            const spreadsheetInfo = await this.sheetsAPI.getSpreadsheetInfo(spreadsheetId);
            const firstSheet = spreadsheetInfo.sheets[0];
            
            if (!firstSheet) {
                throw new Error('No sheets found in spreadsheet');
            }
            
            // Get data from the first sheet
            const range = `${firstSheet.title}!A:Z`; // Get all data
            const data = await this.sheetsAPI.getSheetDataWithHeaders(spreadsheetId, range);
            
            return {
                spreadsheetId,
                sheetName: firstSheet.title,
                headers: data.headers,
                rows: data.rows
            };
            
        } catch (error) {
            console.error('SyncManager: Failed to get initial sheet data', error);
            throw error;
        }
    }
    
    // Handle sync update from WebSocket
    async handleSyncUpdate(data) {
        try {
            const { spreadsheetId, collectionId, changes } = data;
            
            console.log(`SyncManager: Received sync update for ${spreadsheetId}`);
            
            const syncInfo = this.activeSyncs.get(spreadsheetId);
            if (!syncInfo) {
                console.log(`SyncManager: No active sync for ${spreadsheetId}`);
                return;
            }
            
            // Get updated data
            const sheetData = await this.getInitialSheetData(spreadsheetId);
            
            // Transform data to variables
            const variables = await this.dataMapper.transformSheetDataToVariables(sheetData, collectionId);
            
            // Update Figma variables
            const updateResult = await this.updateFigmaVariables(variables, collectionId);
            
            // Update sync info
            syncInfo.lastSync = Date.now();
            syncInfo.variablesUpdated = updateResult.variablesUpdated;
            
            this.notifySyncStatus('success', `Variables updated: ${updateResult.variablesUpdated}`);
            
        } catch (error) {
            console.error('SyncManager: Failed to handle sync update', error);
            this.notifySyncStatus('error', error.message);
        }
    }
    
    // Update Figma variables
    async updateFigmaVariables(variables, collectionId) {
        try {
            let variablesUpdated = 0;
            
            for (const variable of variables) {
                try {
                    // Update variable value
                    await this.updateVariableValue(variable, collectionId);
                    variablesUpdated++;
                } catch (error) {
                    console.error(`SyncManager: Failed to update variable ${variable.name}`, error);
                }
            }
            
            return { variablesUpdated };
            
        } catch (error) {
            console.error('SyncManager: Failed to update Figma variables', error);
            throw error;
        }
    }
    
    // Update individual variable value
    async updateVariableValue(variable, collectionId) {
        // This would integrate with the existing variable management system
        // For now, we'll use a placeholder that would be implemented with the actual Figma API
        
        console.log(`SyncManager: Updating variable ${variable.name} = ${variable.value}`);
        
        // TODO: Implement actual Figma variable update
        // This would use the existing variable management system from the plugin
        
        return true;
    }
    
    // Set up polling sync fallback
    setupPollingSync(spreadsheetId, interval) {
        const intervalMs = parseInt(interval) * 1000;
        
        const pollInterval = setInterval(async () => {
            try {
                const syncInfo = this.activeSyncs.get(spreadsheetId);
                if (!syncInfo) {
                    clearInterval(pollInterval);
                    return;
                }
                
                // Trigger sync update
                await this.handleSyncUpdate({
                    spreadsheetId,
                    collectionId: syncInfo.collectionId,
                    changes: 'polling_update'
                });
                
            } catch (error) {
                console.error('SyncManager: Polling sync error', error);
            }
        }, intervalMs);
        
        // Store interval reference
        const syncInfo = this.activeSyncs.get(spreadsheetId);
        if (syncInfo) {
            syncInfo.pollInterval = pollInterval;
        }
    }
    
    // Clear polling sync
    clearPollingSync(spreadsheetId) {
        const syncInfo = this.activeSyncs.get(spreadsheetId);
        if (syncInfo && syncInfo.pollInterval) {
            clearInterval(syncInfo.pollInterval);
            delete syncInfo.pollInterval;
        }
    }
    
    // Notify sync status
    notifySyncStatus(type, message) {
        // Send message to Figma plugin UI
        if (typeof figma !== 'undefined' && figma.ui) {
            figma.ui.postMessage({
                type: 'realtime-sync-result',
                success: type === 'success',
                message: message,
                connected: this.websocketClient ? this.websocketClient.isConnected : false,
                lastSync: new Date().toISOString(),
                variablesUpdated: this.getTotalVariablesUpdated()
            });
        }
    }
    
    // Get total variables updated across all syncs
    getTotalVariablesUpdated() {
        let total = 0;
        for (const syncInfo of this.activeSyncs.values()) {
            total += syncInfo.variablesUpdated || 0;
        }
        return total;
    }
    
    // Get sync status
    getSyncStatus() {
        return {
            activeSyncs: Array.from(this.activeSyncs.keys()),
            totalVariablesUpdated: this.getTotalVariablesUpdated(),
            websocketConnected: this.websocketClient ? this.websocketClient.isConnected : false
        };
    }
    
    // Get active syncs
    getActiveSyncs() {
        return Array.from(this.activeSyncs.entries()).map(([spreadsheetId, syncInfo]) => ({
            spreadsheetId,
            collectionId: syncInfo.collectionId,
            lastSync: syncInfo.lastSync,
            variablesUpdated: syncInfo.variablesUpdated,
            status: syncInfo.status
        }));
    }
}

// Export for use in Figma plugin
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SyncManager;
} else {
    window.SyncManager = SyncManager;
}
