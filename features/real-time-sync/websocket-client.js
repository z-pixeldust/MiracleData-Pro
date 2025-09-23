// WebSocket Client for Real-Time Sync
// Phase 3: Real-time communication infrastructure

class WebSocketClient {
    constructor() {
        this.ws = null;
        this.url = 'wss://your-sync-server.com/ws'; // Replace with actual WebSocket server URL
        this.isConnected = false;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
        this.reconnectInterval = 1000; // Start with 1 second
        this.maxReconnectInterval = 30000; // Max 30 seconds
        this.heartbeatInterval = null;
        this.heartbeatTimeout = null;
        this.messageHandlers = new Map();
        this.connectionPromise = null;
        
        // Bind methods
        this.handleOpen = this.handleOpen.bind(this);
        this.handleMessage = this.handleMessage.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleError = this.handleError.bind(this);
    }
    
    // Connect to WebSocket server
    async connect(options = {}) {
        if (this.isConnected) {
            console.log('WebSocket: Already connected');
            return Promise.resolve();
        }
        
        if (this.connectionPromise) {
            console.log('WebSocket: Connection in progress');
            return this.connectionPromise;
        }
        
        this.connectionPromise = new Promise((resolve, reject) => {
            try {
                console.log('WebSocket: Connecting to', this.url);
                
                this.ws = new WebSocket(this.url);
                this.ws.onopen = (event) => {
                    this.handleOpen(event);
                    resolve();
                };
                this.ws.onmessage = this.handleMessage;
                this.ws.onclose = this.handleClose;
                this.ws.onerror = (event) => {
                    this.handleError(event);
                    reject(new Error('WebSocket connection failed'));
                };
                
                // Set timeout for connection
                setTimeout(() => {
                    if (!this.isConnected) {
                        this.ws.close();
                        reject(new Error('WebSocket connection timeout'));
                    }
                }, 10000);
                
            } catch (error) {
                console.error('WebSocket: Connection failed', error);
                reject(error);
            }
        });
        
        return this.connectionPromise;
    }
    
    // Handle connection open
    handleOpen(event) {
        console.log('WebSocket: Connected successfully');
        this.isConnected = true;
        this.reconnectAttempts = 0;
        this.reconnectInterval = 1000;
        
        // Start heartbeat
        this.startHeartbeat();
        
        // Notify handlers
        this.notifyHandlers('connected', { event });
    }
    
    // Handle incoming messages
    handleMessage(event) {
        try {
            const data = JSON.parse(event.data);
            console.log('WebSocket: Received message', data);
            
            // Handle different message types
            switch (data.type) {
                case 'pong':
                    this.handlePong();
                    break;
                case 'sync_update':
                    this.notifyHandlers('sync_update', data);
                    break;
                case 'error':
                    this.notifyHandlers('error', data);
                    break;
                case 'notification':
                    this.notifyHandlers('notification', data);
                    break;
                default:
                    this.notifyHandlers('message', data);
            }
            
        } catch (error) {
            console.error('WebSocket: Failed to parse message', error);
            this.notifyHandlers('error', { error: 'Failed to parse message' });
        }
    }
    
    // Handle connection close
    handleClose(event) {
        console.log('WebSocket: Connection closed', event.code, event.reason);
        this.isConnected = false;
        this.stopHeartbeat();
        
        // Notify handlers
        this.notifyHandlers('disconnected', { event });
        
        // Attempt reconnection if not intentional
        if (event.code !== 1000 && this.reconnectAttempts < this.maxReconnectAttempts) {
            this.attemptReconnect();
        }
    }
    
    // Handle connection error
    handleError(event) {
        console.error('WebSocket: Connection error', event);
        this.notifyHandlers('error', { error: 'WebSocket connection error' });
    }
    
    // Attempt to reconnect
    attemptReconnect() {
        this.reconnectAttempts++;
        const delay = Math.min(this.reconnectInterval * Math.pow(2, this.reconnectAttempts - 1), this.maxReconnectInterval);
        
        console.log(`WebSocket: Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts}) in ${delay}ms`);
        
        setTimeout(() => {
            if (this.reconnectAttempts <= this.maxReconnectAttempts) {
                this.connect().catch(error => {
                    console.error('WebSocket: Reconnection failed', error);
                });
            } else {
                console.error('WebSocket: Max reconnection attempts reached');
                this.notifyHandlers('error', { error: 'Max reconnection attempts reached' });
            }
        }, delay);
    }
    
    // Send message to server
    send(type, data = {}) {
        if (!this.isConnected || !this.ws) {
            console.error('WebSocket: Cannot send message - not connected');
            return false;
        }
        
        try {
            const message = {
                type,
                timestamp: Date.now(),
                ...data
            };
            
            this.ws.send(JSON.stringify(message));
            console.log('WebSocket: Sent message', message);
            return true;
            
        } catch (error) {
            console.error('WebSocket: Failed to send message', error);
            return false;
        }
    }
    
    // Start heartbeat to keep connection alive
    startHeartbeat() {
        this.heartbeatInterval = setInterval(() => {
            if (this.isConnected) {
                this.send('ping');
                
                // Set timeout for pong response
                this.heartbeatTimeout = setTimeout(() => {
                    console.warn('WebSocket: Heartbeat timeout - reconnecting');
                    this.ws.close();
                }, 5000);
            }
        }, 30000); // Send ping every 30 seconds
    }
    
    // Stop heartbeat
    stopHeartbeat() {
        if (this.heartbeatInterval) {
            clearInterval(this.heartbeatInterval);
            this.heartbeatInterval = null;
        }
        
        if (this.heartbeatTimeout) {
            clearTimeout(this.heartbeatTimeout);
            this.heartbeatTimeout = null;
        }
    }
    
    // Handle pong response
    handlePong() {
        if (this.heartbeatTimeout) {
            clearTimeout(this.heartbeatTimeout);
            this.heartbeatTimeout = null;
        }
    }
    
    // Register message handler
    on(event, handler) {
        if (!this.messageHandlers.has(event)) {
            this.messageHandlers.set(event, []);
        }
        this.messageHandlers.get(event).push(handler);
    }
    
    // Remove message handler
    off(event, handler) {
        if (this.messageHandlers.has(event)) {
            const handlers = this.messageHandlers.get(event);
            const index = handlers.indexOf(handler);
            if (index > -1) {
                handlers.splice(index, 1);
            }
        }
    }
    
    // Notify all handlers for an event
    notifyHandlers(event, data) {
        if (this.messageHandlers.has(event)) {
            this.messageHandlers.get(event).forEach(handler => {
                try {
                    handler(data);
                } catch (error) {
                    console.error(`WebSocket: Handler error for event '${event}'`, error);
                }
            });
        }
    }
    
    // Subscribe to sync updates for a specific spreadsheet
    subscribeToSync(spreadsheetId, collectionId) {
        return this.send('subscribe_sync', {
            spreadsheetId,
            collectionId
        });
    }
    
    // Unsubscribe from sync updates
    unsubscribeFromSync(spreadsheetId) {
        return this.send('unsubscribe_sync', {
            spreadsheetId
        });
    }
    
    // Request sync status
    requestSyncStatus(spreadsheetId) {
        return this.send('sync_status', {
            spreadsheetId
        });
    }
    
    // Disconnect from server
    disconnect() {
        if (this.ws) {
            this.ws.close(1000, 'Client disconnect');
            this.ws = null;
        }
        
        this.isConnected = false;
        this.stopHeartbeat();
        this.connectionPromise = null;
        
        console.log('WebSocket: Disconnected');
    }
    
    // Get connection status
    getConnectionStatus() {
        return {
            connected: this.isConnected,
            reconnectAttempts: this.reconnectAttempts,
            maxReconnectAttempts: this.maxReconnectAttempts
        };
    }
}

// Export for use in Figma plugin
if (typeof module !== 'undefined' && module.exports) {
    module.exports = WebSocketClient;
} else {
    window.WebSocketClient = WebSocketClient;
}
