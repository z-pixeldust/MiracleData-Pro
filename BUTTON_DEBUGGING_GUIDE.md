# 🔧 Button Debugging Guide

## 🚨 **Issue: Buttons Not Working**

I've added debugging to help identify why the buttons aren't responding. Here's how to troubleshoot:

---

## 🔍 **Step 1: Check Browser Console**

1. **Open your Figma plugin**
2. **Press F12** (or right-click → Inspect → Console)
3. **Look for these debug messages:**

### ✅ **Expected Console Messages:**
```
🚀 DOM Content Loaded - Initializing WebSocket testing interface
🚀 Force-enabling Real-Time Sync for WebSocket testing
✅ Real-Time Sync tab enabled
🔧 Setting up testing button event listeners...
Testing buttons found: {testComponents: true, testDataMapper: true, testSimpleFunction: true, testWebSocket: true}
✅ Test All Components button listener added
✅ Test Data Mapper button listener added
✅ Test Simple Function button listener added
✅ Test WebSocket button listener added
🎯 Testing interface ready! Try clicking the buttons.
```

### ❌ **If You See Errors:**
- **"Cannot read property 'addEventListener' of null"** → Button elements not found
- **No debug messages** → JavaScript not loading properly
- **"CONFIG is not defined"** → Feature flag system not loading

---

## 🎯 **Step 2: Test Button Clicks**

1. **Click "Test All Components" button**
2. **Check console for:** `🧪 testAllComponents() called`
3. **Click "Test WebSocket" button** 
4. **Check console for:** `🔌 testWebSocket() called`

### ✅ **If Buttons Work:**
- You'll see the function calls in console
- Test results will appear in the results panel

### ❌ **If Buttons Still Don't Work:**
- No console messages when clicking
- Buttons might not have event listeners attached

---

## 🔧 **Step 3: Manual Testing**

If buttons still don't work, try these **manual console commands**:

```javascript
// Test if functions exist
console.log('testAllComponents:', typeof testAllComponents);
console.log('testWebSocket:', typeof testWebSocket);

// Test if buttons exist
console.log('testComponents button:', document.getElementById('testComponents'));
console.log('testWebSocket button:', document.getElementById('testWebSocket'));

// Manually call functions
testAllComponents();
testWebSocket();
```

---

## 🚀 **Step 4: Force Refresh**

If nothing works:

1. **Hard refresh** the plugin page (Ctrl+F5 or Cmd+Shift+R)
2. **Close and reopen** the Figma plugin
3. **Check if WebSocket server is still running:**
   ```bash
   curl http://localhost:3001/health
   ```

---

## 📋 **Common Issues & Solutions**

### **Issue 1: Buttons Exist But No Click Response**
- **Cause**: Event listeners not attached
- **Solution**: Check console for "button listener added" messages

### **Issue 2: Functions Not Defined**
- **Cause**: Phase 3 components not loaded
- **Solution**: Check console for "Phase 3 script loaded successfully"

### **Issue 3: WebSocket Connection Fails**
- **Cause**: Server not running or wrong URL
- **Solution**: Verify server is running on port 3001

### **Issue 4: No Console Messages At All**
- **Cause**: JavaScript not executing
- **Solution**: Check for JavaScript errors in console

---

## 🎉 **Expected Working Behavior**

When everything works correctly:

1. **Page loads** → Console shows initialization messages
2. **Click "Test All Components"** → Shows component availability
3. **Click "Test WebSocket"** → Shows connection attempt to ws://localhost:3001
4. **WebSocket connects** → Shows "✅ WebSocket connected successfully!"
5. **Test messages sent** → Shows sync functionality testing

---

## 🆘 **Still Not Working?**

If buttons still don't respond after checking all the above:

1. **Share the console output** with me
2. **Try the manual console commands** above
3. **Check if the WebSocket server is running** in the terminal

The debugging I added should help us identify exactly where the issue is! 🔍
