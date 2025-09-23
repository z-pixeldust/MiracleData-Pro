# Figma Plugin WebSocket Server

This WebSocket server provides real-time communication between Google Sheets and the Figma plugin, simulating the Google Sheets API for testing purposes.

## 🚀 Quick Start

1. **Install dependencies:**
   ```bash
   cd websocket-server
   npm install
   ```

2. **Start the server:**
   ```bash
   npm start
   ```

3. **Server will run on:**
   - WebSocket: `ws://localhost:3001`
   - HTTP API: `http://localhost:3001`

## 📡 API Endpoints

### Health Check
- `GET /health` - Server status and client count

### Mock Google Sheets API
- `GET /api/spreadsheets/:id` - Get spreadsheet metadata
- `GET /api/spreadsheets/:id/sheets/:sheetName` - Get sheet data

## 🔌 WebSocket Messages

### Client → Server
- `start-sync` - Start real-time sync for a spreadsheet
- `stop-sync` - Stop sync for a spreadsheet
- `request-data` - Request current sheet data
- `ping` - Health check

### Server → Client
- `connection` - Welcome message on connect
- `sync-started` - Sync has been started
- `sync-stopped` - Sync has been stopped
- `sheet-update` - Real-time data changes
- `sheet-data` - Response to data request
- `error` - Error messages
- `pong` - Response to ping

## 📊 Mock Data

The server includes two sample spreadsheets:

### test-spreadsheet-1: "Sample Sports Data"
- Player Name, Age, Score, Team Color
- 5 rows of sample data

### test-spreadsheet-2: "Company Metrics"
- Department, Revenue, Growth %, Status Color
- 4 rows of sample data

## 🔄 Real-Time Features

- **Automatic Updates**: Data changes every 10 seconds
- **Random Changes**: 1-3 values updated per cycle
- **Multiple Data Types**: Names, numbers, colors, percentages
- **Connection Management**: Auto-reconnect, ping/pong health checks
- **Multiple Clients**: Supports multiple concurrent connections

## 🧪 Testing

The server is designed to work with the Figma plugin's Phase 3 testing interface:

1. Open the Figma plugin
2. Go to "Real-Time Sync" tab
3. Click "Test WebSocket" button
4. Watch the test results in real-time

## 🛠️ Development

- **Dev Mode**: `npm run dev` (with nodemon for auto-restart)
- **Logs**: All connections and messages are logged to console
- **Graceful Shutdown**: Ctrl+C to stop server cleanly

## 🔧 Configuration

Edit `server.js` to customize:
- Port number (default: 3001)
- Mock data structure
- Update frequency
- Reconnection settings

## 📝 Example Usage

```javascript
// Connect to WebSocket
const ws = new WebSocket('ws://localhost:3001');

// Start sync
ws.send(JSON.stringify({
  type: 'start-sync',
  data: {
    spreadsheetId: 'test-spreadsheet-1',
    collectionId: 'my-collection',
    syncInterval: 5000
  }
}));

// Listen for updates
ws.onmessage = (event) => {
  const message = JSON.parse(event.data);
  console.log('Received:', message.type, message.data);
};
```

## 🎯 Next Steps

This server provides the foundation for:
1. ✅ Real-time WebSocket communication
2. ✅ Mock Google Sheets data simulation
3. ✅ Multi-client support
4. ✅ Error handling and reconnection
5. 🔄 Integration with real Google Sheets API
6. 🔄 Production deployment
7. 🔄 Authentication and security
