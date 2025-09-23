const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

class CSVHandler {
    constructor() {
        this.uploadDir = path.join(__dirname, 'uploads');
        this.ensureUploadDir();
    }

    ensureUploadDir() {
        if (!fs.existsSync(this.uploadDir)) {
            fs.mkdirSync(this.uploadDir, { recursive: true });
            console.log('📁 Created uploads directory:', this.uploadDir);
        }
    }

    async parseCSV(csvContent) {
        return new Promise((resolve, reject) => {
            try {
                const results = [];
                
                // Use a proper CSV parsing function that handles multi-line quoted fields
                function parseCSV(csvText) {
                    const result = [];
                    let current = '';
                    let inQuotes = false;
                    let currentRow = [];
                    
                    for (let i = 0; i < csvText.length; i++) {
                        const char = csvText[i];
                        const nextChar = csvText[i + 1];
                        
                        if (char === '"') {
                            if (inQuotes && nextChar === '"') {
                                // Escaped quote
                                current += '"';
                                i++; // Skip next quote
                            } else {
                                // Toggle quote state
                                inQuotes = !inQuotes;
                            }
                        } else if (char === ',' && !inQuotes) {
                            // Field separator
                            currentRow.push(current.trim());
                            current = '';
                        } else if ((char === '\n' || char === '\r') && !inQuotes) {
                            // Row separator (only if not in quotes)
                            if (char === '\r' && nextChar === '\n') {
                                i++; // Skip \n after \r
                            }
                            currentRow.push(current.trim());
                            if (currentRow.some(field => field !== '')) {
                                result.push(currentRow);
                            }
                            currentRow = [];
                            current = '';
                        } else {
                            current += char;
                        }
                    }
                    
                    // Add the last field and row
                    currentRow.push(current.trim());
                    if (currentRow.some(field => field !== '')) {
                        result.push(currentRow);
                    }
                    
                    return result;
                }
                
                const parsedData = parseCSV(csvContent);
                
                if (parsedData.length === 0) {
                    reject(new Error('CSV file is empty'));
                    return;
                }

                // First row is headers
                const headers = parsedData[0].map(header => header.replace(/^"|"$/g, ''));
                
                // Find the maximum number of columns
                const maxColumns = Math.max(...parsedData.map(row => row.length));
                
                // Ensure all rows have the same number of columns
                const normalizedData = parsedData.slice(1).map(row => {
                    const normalizedRow = [...row];
                    while (normalizedRow.length < maxColumns) {
                        normalizedRow.push('');
                    }
                    return normalizedRow.slice(0, maxColumns);
                });

                // Filter out metadata rows (rows that start with common metadata keywords)
                const filteredResults = normalizedData.filter(row => {
                    const firstCell = (row[0] && row[0].toLowerCase) ? row[0].toLowerCase() : '';
                    return !firstCell.includes('figma') && 
                           !firstCell.includes('design') && 
                           !firstCell.includes('note') &&
                           !firstCell.includes('file here') &&
                           !firstCell.includes('instructions') &&
                           !firstCell.includes('comment') &&
                           !firstCell.startsWith('(') &&
                           firstCell !== '';
                });

                console.log(`📊 CSV parsed: ${filteredResults.length} rows after filtering (${normalizedData.length} total)`);
                console.log(`📋 Headers: [${headers.join(', ')}]`);
                console.log(`📊 Max columns: ${maxColumns}`);

                resolve({
                    headers,
                    data: filteredResults,
                    rowCount: filteredResults.length
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    async saveCSV(fileName, csvContent) {
        try {
            const filePath = path.join(this.uploadDir, fileName);
            fs.writeFileSync(filePath, csvContent);
            console.log('💾 CSV saved:', filePath);
            return filePath;
        } catch (error) {
            console.error('❌ Error saving CSV:', error);
            throw error;
        }
    }

    generateSpreadsheetId(fileName) {
        // Generate a unique ID based on filename and timestamp
        const timestamp = Date.now();
        const cleanName = fileName.replace(/[^a-zA-Z0-9]/g, '_');
        return `local-${cleanName}-${timestamp}`;
    }

    async processUploadedCSV(fileName, csvContent) {
        try {
            console.log('📊 Processing uploaded CSV:', fileName);
            
            // Parse the CSV
            const parsedData = await this.parseCSV(csvContent);
            
            // Generate spreadsheet ID
            const spreadsheetId = this.generateSpreadsheetId(fileName);
            
            // Save the file
            await this.saveCSV(fileName, csvContent);
            
            console.log('✅ CSV processed successfully:', {
                fileName,
                spreadsheetId,
                headers: parsedData.headers,
                rowCount: parsedData.rowCount
            });

            return {
                spreadsheetId,
                title: fileName.replace('.csv', ''),
                fileName,
                headers: parsedData.headers,
                data: parsedData.data,
                rowCount: parsedData.rowCount,
                lastModified: new Date().toISOString()
            };

        } catch (error) {
            console.error('❌ Error processing CSV:', error);
            throw error;
        }
    }

    getUploadedSpreadsheets() {
        try {
            const files = fs.readdirSync(this.uploadDir);
            const spreadsheets = [];

            files.forEach(file => {
                if (file.endsWith('.csv')) {
                    const filePath = path.join(this.uploadDir, file);
                    const stats = fs.statSync(filePath);
                    
                    spreadsheets.push({
                        fileName: file,
                        spreadsheetId: this.generateSpreadsheetId(file),
                        title: file.replace('.csv', ''),
                        lastModified: stats.mtime.toISOString(),
                        size: stats.size
                    });
                }
            });

            return spreadsheets;
        } catch (error) {
            console.error('❌ Error reading uploaded spreadsheets:', error);
            return [];
        }
    }

    getSpreadsheetData(spreadsheetId) {
        try {
            // Find the file by spreadsheet ID
            const files = fs.readdirSync(this.uploadDir);
            const targetFile = files.find(file => {
                const id = this.generateSpreadsheetId(file);
                return id === spreadsheetId;
            });

            if (!targetFile) {
                throw new Error(`Spreadsheet ${spreadsheetId} not found`);
            }

            const filePath = path.join(this.uploadDir, targetFile);
            const csvContent = fs.readFileSync(filePath, 'utf8');
            
            return this.parseCSV(csvContent).then(parsedData => ({
                spreadsheetId,
                title: targetFile.replace('.csv', ''),
                fileName: targetFile,
                headers: parsedData.headers,
                data: parsedData.data,
                rowCount: parsedData.rowCount,
                lastModified: fs.statSync(filePath).mtime.toISOString()
            }));

        } catch (error) {
            console.error('❌ Error getting spreadsheet data:', error);
            throw error;
        }
    }
}

module.exports = CSVHandler;
