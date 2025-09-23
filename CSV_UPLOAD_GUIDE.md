# 📊 Upload Your Own CSV Files

## ✅ **CSV Upload Feature Added!**

You can now upload your own CSV files and test them with real-time WebSocket sync!

---

## 🎯 **How to Use Your Own CSV Files**

### **Method 1: Web Upload Interface (Easiest)**

1. **Open the upload interface:**
   ```
   http://localhost:3001/upload-test.html
   ```

2. **Upload your CSV file:**
   - Drag and drop your CSV file onto the upload area
   - Or click "Choose CSV File" to select from your computer
   - Click "Upload CSV" to process it

3. **Test with WebSocket:**
   - Click on your uploaded spreadsheet in the list
   - Click "Test WebSocket" to start real-time sync
   - Watch for real-time updates every 10 seconds!

### **Method 2: Console Upload (Advanced)**

```javascript
// Upload your CSV file via console
async function uploadMyCSV() {
    // Replace with your CSV content
    const csvContent = `Name,Age,Score,Team
Alice,28,95.5,Blue
Bob,32,87.2,Red
Charlie,25,92.8,Green`;

    const response = await fetch('http://localhost:3001/api/upload-csv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            fileName: 'my-data.csv',
            csvContent: csvContent
        })
    });

    const result = await response.json();
    console.log('Upload result:', result);
    
    // Test with WebSocket
    if (result.success) {
        const wsClient = new WebSocketClient();
        await wsClient.connect();
        wsClient.send('start-sync', {
            spreadsheetId: result.spreadsheetId,
            collectionId: 'my-collection',
            syncInterval: 5000
        });
        
        wsClient.on('sheet-update', (data) => {
            console.log('📊 Real-time update from my CSV:', data);
        });
    }
}

uploadMyCSV();
```

---

## 📋 **CSV Format Requirements**

### **Supported Format:**
```csv
Header1,Header2,Header3,Header4
Value1,Value2,Value3,Value4
Value1,Value2,Value3,Value4
```

### **Example CSV Files:**

**Sales Data:**
```csv
Product,Price,Quantity,Category
Laptop,999.99,5,Electronics
Mouse,29.99,20,Accessories
Keyboard,79.99,15,Accessories
Monitor,299.99,8,Electronics
```

**Employee Data:**
```csv
Name,Department,Salary,StartDate
John Smith,Engineering,75000,2023-01-15
Jane Doe,Marketing,65000,2023-02-01
Bob Johnson,Sales,60000,2023-03-10
```

---

## 🔄 **Real-Time Features with Your CSV**

### **✅ What Happens:**
1. **CSV Upload** - Your file is parsed and stored
2. **Unique ID Generated** - Each upload gets a unique spreadsheet ID
3. **Real-Time Updates** - Server simulates changes every 10 seconds
4. **WebSocket Sync** - Changes sent to your Figma plugin in real-time

### **✅ Data Changes Simulated:**
- **Random value updates** - 1-3 cells changed per update cycle
- **Realistic data types** - Names, numbers, dates, categories
- **Maintains structure** - Headers and row structure preserved

---

## 🎯 **Testing Your Uploaded CSV**

### **Step 1: Upload Your File**
1. Go to `http://localhost:3001/upload-test.html`
2. Upload your CSV file
3. Note the generated spreadsheet ID

### **Step 2: Test in Figma Plugin**
```javascript
// Use the spreadsheet ID from upload
const wsClient = new WebSocketClient();
await wsClient.connect();

wsClient.send('start-sync', {
    spreadsheetId: 'local-yourfilename_1234567890', // Your generated ID
    collectionId: 'my-custom-collection',
    syncInterval: 5000
});

wsClient.on('sheet-update', (data) => {
    console.log('📊 Update from your CSV:', data);
});
```

---

## 🚀 **Advanced Features**

### **Multiple CSV Files:**
- Upload multiple CSV files
- Each gets a unique ID
- Test them individually or simultaneously

### **Data Transformation:**
```javascript
wsClient.on('sheet-update', (data) => {
    // Transform to Figma variables
    const figmaVariables = {};
    Object.keys(data.changes).forEach(rowIndex => {
        const rowChanges = data.changes[rowIndex];
        Object.keys(rowChanges).forEach(colIndex => {
            const value = rowChanges[colIndex];
            const variableName = `my_csv_row_${rowIndex}_col_${colIndex}`;
            figmaVariables[variableName] = value;
        });
    });
    console.log('Figma Variables:', figmaVariables);
});
```

---

## 📊 **Server Endpoints**

### **Upload CSV:**
```
POST http://localhost:3001/api/upload-csv
Content-Type: application/json

{
  "fileName": "my-data.csv",
  "csvContent": "Header1,Header2\nValue1,Value2"
}
```

### **List Uploaded Spreadsheets:**
```
GET http://localhost:3001/api/uploaded-spreadsheets
```

### **Get Spreadsheet Data:**
```
GET http://localhost:3001/api/spreadsheets/{spreadsheetId}/sheets/Sheet1
```

---

## 🎉 **Success Indicators**

✅ **Upload successful** - Server responds with spreadsheet ID
✅ **WebSocket connected** - Real-time connection established
✅ **Sync started** - Server acknowledges sync start
✅ **Real-time updates** - Data changes every 10 seconds
✅ **Data transformation** - Values ready for Figma variables

---

## 💡 **Pro Tips**

1. **Keep CSV files small** - For faster processing and updates
2. **Use clear headers** - Makes data transformation easier
3. **Test with different data types** - Numbers, text, dates, colors
4. **Monitor server logs** - Watch terminal for connection and sync messages
5. **Use unique filenames** - Avoid conflicts with existing uploads

**Now you can test real-time sync with your own data! Upload a CSV file and watch it update in real-time!** 🚀
