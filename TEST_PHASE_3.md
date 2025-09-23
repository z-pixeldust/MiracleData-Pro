# Phase 3 Testing Guide

## 🧪 **Phase 3 Tests You Can Run Right Now**

### **Test 1: Verify Phase 3 Components Load**
1. **Open your Figma plugin**
2. **Open browser developer tools** (F12)
3. **Go to Console tab**
4. **Type these commands**:

```javascript
// Check if Phase 3 components are loaded
console.log('GoogleOAuth:', typeof GoogleOAuth);
console.log('GoogleSheetsAPI:', typeof GoogleSheetsAPI);
console.log('WebSocketClient:', typeof WebSocketClient);
console.log('DataMapper:', typeof DataMapper);
console.log('SyncManager:', typeof SyncManager);
```

**Expected Result**: ✅ All should show `"function"` (components loaded)

---

### **Test 2: Enable Real-Time Sync Feature**
1. **In browser console, type**:

```javascript
// Enable real-time sync feature
if (window.CONFIG && window.CONFIG.features) {
  window.CONFIG.features.realTimeSync = true;
  console.log('Real-time sync enabled');
  location.reload();
}
```

2. **After reload, check if Real-Time Sync tab is visible**

**Expected Result**: ✅ Real-Time Sync tab should be visible

---

### **Test 3: Test Google OAuth Initialization**
1. **Click on "Real-Time Sync" tab**
2. **Click "Connect Google Account" button**
3. **Check console for response**

**Expected Result**: ✅ Should show error about OAuth configuration (expected - needs setup)

---

### **Test 4: Test Component Initialization**
1. **In browser console, type**:

```javascript
// Test component initialization
try {
  const oauth = new GoogleOAuth();
  console.log('✅ GoogleOAuth initialized');
  
  const sheetsAPI = new GoogleSheetsAPI(oauth);
  console.log('✅ GoogleSheetsAPI initialized');
  
  const websocketClient = new WebSocketClient();
  console.log('✅ WebSocketClient initialized');
  
  const dataMapper = new DataMapper();
  console.log('✅ DataMapper initialized');
  
  const syncManager = new SyncManager();
  console.log('✅ SyncManager initialized');
  
  console.log('🎉 All Phase 3 components initialized successfully!');
} catch (error) {
  console.error('❌ Component initialization failed:', error);
}
```

**Expected Result**: ✅ All components should initialize without errors

---

### **Test 5: Test Data Mapper**
1. **In browser console, type**:

```javascript
// Test data transformation
try {
  const dataMapper = new DataMapper();
  
  // Test color transformation
  const colorValue = dataMapper.transformColorValue('#FF0000');
  console.log('✅ Color transformation:', colorValue);
  
  // Test number transformation
  const numberValue = dataMapper.transformNumberValue('123.45');
  console.log('✅ Number transformation:', numberValue);
  
  // Test string transformation
  const stringValue = dataMapper.transformStringValue('Hello World');
  console.log('✅ String transformation:', stringValue);
  
  console.log('🎉 Data transformation working!');
} catch (error) {
  console.error('❌ Data transformation failed:', error);
}
```

**Expected Result**: ✅ All transformations should work correctly

---

### **Test 6: Test WebSocket Client**
1. **In browser console, type**:

```javascript
// Test WebSocket client (will fail to connect - expected)
try {
  const websocketClient = new WebSocketClient();
  console.log('✅ WebSocketClient created');
  
  // Test connection (will fail - expected)
  websocketClient.connect().then(() => {
    console.log('✅ WebSocket connected');
  }).catch(error => {
    console.log('⚠️ WebSocket connection failed (expected):', error.message);
  });
  
  // Test message sending (will fail - expected)
  const sent = websocketClient.send('test', { message: 'Hello' });
  console.log('✅ Message send attempt:', sent);
  
} catch (error) {
  console.error('❌ WebSocket test failed:', error);
}
```

**Expected Result**: ✅ WebSocket client should initialize, connection should fail (expected)

---

### **Test 7: Test Sync Manager**
1. **In browser console, type**:

```javascript
// Test sync manager initialization
try {
  const oauth = new GoogleOAuth();
  const sheetsAPI = new GoogleSheetsAPI(oauth);
  const websocketClient = new WebSocketClient();
  const dataMapper = new DataMapper();
  const syncManager = new SyncManager();
  
  // Test initialization
  syncManager.initialize(oauth, sheetsAPI, websocketClient, dataMapper).then(() => {
    console.log('✅ SyncManager initialized successfully');
    
    // Test getting sync status
    const status = syncManager.getSyncStatus();
    console.log('✅ Sync status:', status);
    
  }).catch(error => {
    console.error('❌ SyncManager initialization failed:', error);
  });
  
} catch (error) {
  console.error('❌ SyncManager test failed:', error);
}
```

**Expected Result**: ✅ SyncManager should initialize successfully

---

### **Test 8: Verify Existing Functionality Still Works**
1. **Go back to other tabs**
2. **Try importing sports data**
3. **Try CSV import**
4. **Try CSV filter**

**Expected Result**: ✅ All existing functionality should work exactly as before

---

## 🎯 **What This Proves**

### **Phase 3 Success Criteria**
- ✅ **Component Loading**: All Phase 3 components load correctly
- ✅ **Initialization**: Components initialize without errors
- ✅ **Data Transformation**: Data mapper works correctly
- ✅ **WebSocket Client**: WebSocket client initializes (connection fails as expected)
- ✅ **Sync Manager**: Sync manager coordinates components
- ✅ **Backward Compatibility**: Existing functionality unchanged

---

## 🔧 **Configuration Notes**

### **Expected "Errors" (Normal)**
- **Google OAuth**: Will fail because client ID not configured (expected)
- **WebSocket Connection**: Will fail because server not running (expected)
- **Google Sheets API**: Will fail because not authenticated (expected)

### **Real Implementation Requires**
1. **Google OAuth Setup**: Client ID and redirect URI configuration
2. **WebSocket Server**: Real-time sync server running
3. **Google Sheets API**: Proper authentication and permissions

---

## 📊 **Expected Test Results**

| Test | Expected Result | Status |
|------|----------------|---------|
| Components load | All components available | ✅ Should pass |
| Feature enable | Real-Time Sync tab visible | ✅ Should pass |
| OAuth test | Configuration error (expected) | ✅ Should pass |
| Component init | All initialize successfully | ✅ Should pass |
| Data transformation | All transformations work | ✅ Should pass |
| WebSocket test | Client works, connection fails | ✅ Should pass |
| Sync manager | Initializes successfully | ✅ Should pass |
| Existing functionality | All other features work | ✅ Should pass |

---

## 🚀 **What This Means**

If all tests pass, it means:
1. ✅ **Phase 3 Core Complete**: All components built and integrated
2. ✅ **Architecture Working**: Components can communicate
3. ✅ **Data Processing Ready**: Can transform spreadsheet data
4. ✅ **Real-Time Infrastructure**: WebSocket client ready
5. ✅ **Backward Compatibility**: No breaking changes
6. ✅ **Ready for Configuration**: Just needs OAuth and server setup

---

## 📝 **Next Steps**

After confirming Phase 3 core works:
1. **Set up Google OAuth** configuration
2. **Deploy WebSocket server** for real-time sync
3. **Test with real Google Sheets**
4. **Implement gradual rollout**

---

**Try these tests and let me know what you see!** This will confirm that Phase 3 core implementation is successful and ready for configuration and deployment.
