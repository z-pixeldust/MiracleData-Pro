# Phase 1 Testing Guide

## 🧪 **Quick Tests You Can Run Right Now**

### **Test 1: Verify Existing Functionality Still Works**
1. **Open your Figma plugin** (the existing one should work exactly as before)
2. **Try importing sports data** - click on any sport (NBA, NFL, etc.)
3. **Try CSV import** - upload a CSV file
4. **Verify variables are created** - check your Variables panel in Figma

**Expected Result**: ✅ Everything works exactly as it did before

---

### **Test 2: Check Browser Console for Phase 1 Messages**
1. **Open Figma plugin**
2. **Open browser developer tools** (F12)
3. **Go to Console tab**
4. **Look for these messages**:

```
[INFO] Phase 1 infrastructure loaded successfully
[INFO] Existing services registered successfully
[INFO] Registered service: variableManager
[INFO] Registered service: csvImporter  
[INFO] Registered service: sportsApi
```

**Expected Result**: ✅ You should see these INFO messages (or the fallback message if infrastructure isn't loaded)

---

### **Test 3: Test Health Check (New Feature)**
1. **Open Figma plugin**
2. **Open browser developer tools** (F12)
3. **Go to Console tab**
4. **Type this command and press Enter**:

```javascript
parent.postMessage({ pluginMessage: { type: 'health-check' } }, '*');
```

**Expected Result**: ✅ You should see a health check response in the console

---

### **Test 4: Check Service Registry (New Feature)**
1. **Open Figma plugin**
2. **Open browser developer tools** (F12)
3. **Go to Console tab**
4. **Type this command and press Enter**:

```javascript
console.log('Services available:', window.services?.listServices?.() || 'Service registry not available');
```

**Expected Result**: ✅ You should see an array of service names like `['variableManager', 'csvImporter', 'sportsApi']`

---

### **Test 5: Test Configuration System (New Feature)**
1. **Open Figma plugin**
2. **Open browser developer tools** (F12)
3. **Go to Console tab**
4. **Type this command and press Enter**:

```javascript
console.log('Feature flags:', window.CONFIG?.features || 'Config not available');
```

**Expected Result**: ✅ You should see feature flags with most set to `false` (safety)

---

## 🚨 **What to Watch For**

### **If Everything Works Correctly:**
- ✅ Existing functionality works exactly as before
- ✅ You see INFO messages in console about Phase 1
- ✅ Health check responds successfully
- ✅ Service registry shows registered services
- ✅ Feature flags show new features as disabled

### **If Something Goes Wrong:**
- ❌ Existing functionality broken → **STOP** and report the issue
- ❌ No console messages → Infrastructure didn't load (but plugin should still work)
- ❌ Errors in console → Check what the error says

---

## 🔧 **Debug Commands**

If you want to explore the new infrastructure:

```javascript
// Check if infrastructure loaded
console.log('Logger available:', typeof window.Logger);
console.log('CONFIG available:', typeof window.CONFIG);
console.log('Services available:', typeof window.services);

// Run a quick validation
if (window.Phase1Validator) {
  window.Phase1Validator.runQuickValidation().then(result => 
    console.log('Quick validation result:', result)
  );
}

// Check feature flags
if (window.CONFIG) {
  console.log('All features:', window.CONFIG.features);
  console.log('Debug mode:', window.CONFIG.debug);
}
```

---

## 📊 **Expected Test Results**

| Test | Expected Result | Status |
|------|----------------|---------|
| Existing functionality | Works exactly as before | ✅ Should pass |
| Console messages | Phase 1 INFO messages | ✅ Should pass |
| Health check | Returns health status | ✅ Should pass |
| Service registry | Shows 3+ services | ✅ Should pass |
| Feature flags | Shows new features disabled | ✅ Should pass |

---

## 🚀 **What This Proves**

If all tests pass, it means:
1. ✅ **Zero Breaking Changes**: Your existing plugin works perfectly
2. ✅ **Infrastructure Ready**: New systems are in place and working
3. ✅ **Safety First**: New features are disabled and safe
4. ✅ **Ready for Phase 2**: Foundation is solid for real-time sync

---

## 📝 **Report Results**

After running the tests, let me know:
1. **Which tests passed/failed**
2. **Any error messages you see**
3. **Whether existing functionality still works**
4. **Any unexpected behavior**

This will help me know if Phase 1 is successful and ready for Phase 2!
