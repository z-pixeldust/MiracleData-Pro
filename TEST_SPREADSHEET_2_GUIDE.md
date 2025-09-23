# 🧪 Testing with test-spreadsheet-2

## 📊 **Available Data in test-spreadsheet-2**

**Title:** "Company Metrics"
**Headers:** Department, Revenue, Growth %, Status Color
**Sample Data:**
```
Bob   | 34  | 91.6 | #3357FF
Alice | 40  | 63.5 | #FF33F5
Diana | 63  | 38.0 | #3357FF
Diana | 34  | 23.9 | #FF33F5
```

---

## 🎯 **How to Test with test-spreadsheet-2**

### **Method 1: Console Command**
```javascript
// Test with spreadsheet 2
async function testSpreadsheet2() {
    console.log('🧪 Testing with test-spreadsheet-2...');
    
    const wsClient = new WebSocketClient();
    
    try {
        // Connect to WebSocket
        await wsClient.connect();
        console.log('✅ Connected to WebSocket');
        
        // Start sync with spreadsheet 2
        wsClient.send('start-sync', {
            spreadsheetId: 'test-spreadsheet-2',
            collectionId: 'company-metrics',
            syncInterval: 5000
        });
        
        console.log('🔄 Started sync with test-spreadsheet-2');
        
        // Listen for real-time updates
        wsClient.on('sheet-update', (data) => {
            console.log('📊 Real-time update received:', data);
        });
        
        // Listen for sync status
        wsClient.on('sync-started', (data) => {
            console.log('✅ Sync started:', data);
        });
        
        console.log('🎯 Listening for updates... Watch for data changes every 10 seconds!');
        
    } catch (error) {
        console.error('❌ Test failed:', error);
    }
}

// Run the test
testSpreadsheet2();
```

### **Method 2: Compare Both Spreadsheets**
```javascript
// Test both spreadsheets side by side
async function testBothSpreadsheets() {
    console.log('🧪 Testing both spreadsheets...');
    
    const wsClient1 = new WebSocketClient();
    const wsClient2 = new WebSocketClient();
    
    try {
        // Connect both clients
        await wsClient1.connect();
        await wsClient2.connect();
        
        // Start sync with spreadsheet 1
        wsClient1.send('start-sync', {
            spreadsheetId: 'test-spreadsheet-1',
            collectionId: 'sports-data',
            syncInterval: 5000
        });
        
        // Start sync with spreadsheet 2
        wsClient2.send('start-sync', {
            spreadsheetId: 'test-spreadsheet-2',
            collectionId: 'company-metrics',
            syncInterval: 5000
        });
        
        // Listen for updates from both
        wsClient1.on('sheet-update', (data) => {
            console.log('📊 Sports Data Update:', data);
        });
        
        wsClient2.on('sheet-update', (data) => {
            console.log('📊 Company Metrics Update:', data);
        });
        
        console.log('🎯 Both spreadsheets syncing! Watch for updates...');
        
    } catch (error) {
        console.error('❌ Test failed:', error);
    }
}

// Run the comparison test
testBothSpreadsheets();
```

---

## 🔄 **What to Expect**

### **Real-Time Updates:**
- **Every 10 seconds**, the server will send data changes
- **1-3 random values** will be updated per cycle
- **Different data types**: Names, numbers, percentages, colors

### **Console Output:**
```
🧪 Testing with test-spreadsheet-2...
✅ Connected to WebSocket
🔄 Started sync with test-spreadsheet-2
✅ Sync started: {spreadsheetId: "test-spreadsheet-2", ...}
🎯 Listening for updates... Watch for data changes every 10 seconds!
📊 Real-time update received: {changes: {...}, timestamp: "..."}
```

---

## 🎯 **Server Logs to Watch**

In your terminal, you'll see:
```
🔌 Client connected: client_xxxxx (Total: 1)
📨 Message from client_xxxxx: start-sync
🔄 Starting sync for client_xxxxx: {spreadsheetId: "test-spreadsheet-2", ...}
📨 Message from client_xxxxx: start-sync
🔄 Starting sync for client_xxxxx: {spreadsheetId: "test-spreadsheet-2", ...}
```

---

## 🚀 **Advanced Testing**

### **Test Data Transformation:**
```javascript
// Test how data gets transformed
wsClient.on('sheet-update', (data) => {
    console.log('Raw changes:', data.changes);
    
    // Simulate Figma variable transformation
    const figmaVariables = {};
    Object.keys(data.changes).forEach(rowIndex => {
        const rowChanges = data.changes[rowIndex];
        Object.keys(rowChanges).forEach(colIndex => {
            const value = rowChanges[colIndex];
            const variableName = `company_metrics_row_${rowIndex}_col_${colIndex}`;
            figmaVariables[variableName] = value;
        });
    });
    
    console.log('Figma Variables:', figmaVariables);
});
```

---

## 🎉 **Success Indicators**

✅ **Connection successful** - Client connected message
✅ **Sync started** - Server acknowledges sync start
✅ **Real-time updates** - Data changes every 10 seconds
✅ **Data transformation** - Values converted to Figma variable format

**Copy and paste any of these console commands to test with test-spreadsheet-2!** 🚀
