# Phase 2 Testing Guide

## 🧪 **Phase 2 Tests You Can Run Right Now**

### **Test 1: Verify Real-Time Sync Tab is Hidden**
1. **Open your Figma plugin**
2. **Check the tabs** - you should see:
   - ✅ Import Sports Data
   - ✅ CSV Import  
   - ✅ CSV Filter
   - ❌ Real-Time Sync (should be hidden)
   - ✅ Duplicate Collections
   - ✅ Import/Export JSON

**Expected Result**: ✅ Real-Time Sync tab is hidden (feature disabled by default)

---

### **Test 2: Enable Real-Time Sync Feature (Testing)**
1. **Open browser developer tools** (F12)
2. **Go to Console tab**
3. **Type this command to enable the feature**:

```javascript
if (window.CONFIG && window.CONFIG.features) {
  window.CONFIG.features.realTimeSync = true;
  console.log('Real-time sync enabled for testing');
  // Reload the UI to see the new tab
  location.reload();
}
```

**Expected Result**: ✅ After reload, you should see the "Real-Time Sync" tab

---

### **Test 3: Test Real-Time Sync UI (Placeholder)**
1. **Click on the "Real-Time Sync" tab**
2. **You should see**:
   - ✅ Feature status showing "Enabled"
   - ✅ Connection status showing "Not connected"
   - ✅ "Connect Google Account" button (disabled)
   - ✅ Placeholder UI for spreadsheet selection

**Expected Result**: ✅ UI loads correctly with placeholder functionality

---

### **Test 4: Test Google Authentication Placeholder**
1. **Click "Connect Google Account" button**
2. **Check console for response**

**Expected Result**: ✅ Should show error message "Google authentication not yet implemented"

---

### **Test 5: Test Start Sync Placeholder**
1. **Try to start sync** (if buttons are enabled)

**Expected Result**: ✅ Should show error message "Real-time sync not yet implemented"

---

### **Test 6: Verify Existing Functionality Still Works**
1. **Go back to other tabs**
2. **Try importing sports data**
3. **Try CSV import**

**Expected Result**: ✅ All existing functionality works exactly as before

---

## 🎯 **What This Proves**

### **Phase 2 Success Criteria**
- ✅ **UI Integration**: New tab added safely
- ✅ **Feature Flags**: Feature disabled by default
- ✅ **Backward Compatibility**: Existing functionality unchanged
- ✅ **Placeholder Implementation**: UI ready for real functionality
- ✅ **Safe Testing**: Can enable/disable feature for testing

---

## 🔧 **Enable/Disable Feature for Testing**

### **Enable Real-Time Sync**
```javascript
// In browser console
if (window.CONFIG) {
  window.CONFIG.features.realTimeSync = true;
  console.log('Real-time sync enabled');
  location.reload();
}
```

### **Disable Real-Time Sync**
```javascript
// In browser console
if (window.CONFIG) {
  window.CONFIG.features.realTimeSync = false;
  console.log('Real-time sync disabled');
  location.reload();
}
```

### **Check Feature Status**
```javascript
// In browser console
console.log('Real-time sync enabled:', window.CONFIG?.features?.realTimeSync);
console.log('All features:', window.CONFIG?.features);
```

---

## 📊 **Expected Test Results**

| Test | Expected Result | Status |
|------|----------------|---------|
| Tab hidden by default | Real-Time Sync tab not visible | ✅ Should pass |
| Feature enable | Can enable feature via console | ✅ Should pass |
| UI loads correctly | Tab content displays properly | ✅ Should pass |
| Placeholder messages | Shows "not implemented" messages | ✅ Should pass |
| Existing functionality | All other features work normally | ✅ Should pass |

---

## 🚀 **What This Means**

If all tests pass, it means:
1. ✅ **Phase 2 UI Integration Complete**: New tab safely integrated
2. ✅ **Feature Flag System Working**: Can enable/disable safely
3. ✅ **Backward Compatibility Maintained**: No breaking changes
4. ✅ **Ready for Next Steps**: Can implement real Google auth and sync

---

## 📝 **Next Steps**

After confirming Phase 2 UI works:
1. **Implement Google OAuth2** authentication
2. **Create WebSocket client** for real-time communication  
3. **Build sync manager** for Google Sheets integration
4. **Add gradual rollout** for 5% of users

---

**Try these tests and let me know what you see!** This will confirm that Phase 2 UI integration is successful and ready for the next implementation steps.
