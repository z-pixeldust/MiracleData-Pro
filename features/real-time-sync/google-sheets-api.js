// Google Sheets API Client for Figma Plugin
// Phase 3: Real-time sync with Google Sheets

class GoogleSheetsAPI {
    constructor(oauthClient) {
        this.oauth = oauthClient;
        this.baseUrl = 'https://sheets.googleapis.com/v4/spreadsheets';
        this.driveUrl = 'https://www.googleapis.com/drive/v3';
    }
    
    // Get user's spreadsheets
    async getUserSpreadsheets() {
        try {
            const token = await this.oauth.getValidAccessToken();
            
            const response = await fetch(`${this.driveUrl}/files?q=mimeType='application/vnd.google-apps.spreadsheet'&fields=files(id,name,modifiedTime)`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (!response.ok) {
                throw new Error(`Failed to fetch spreadsheets: ${response.statusText}`);
            }
            
            const data = await response.json();
            return data.files.map(file => ({
                id: file.id,
                name: file.name,
                modifiedTime: file.modifiedTime
            }));
            
        } catch (error) {
            console.error('Google Sheets API: Failed to fetch spreadsheets', error);
            throw error;
        }
    }
    
    // Get spreadsheet metadata
    async getSpreadsheetInfo(spreadsheetId) {
        try {
            const token = await this.oauth.getValidAccessToken();
            
            const response = await fetch(`${this.baseUrl}/${spreadsheetId}?fields=properties,sheets.properties`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (!response.ok) {
                throw new Error(`Failed to fetch spreadsheet info: ${response.statusText}`);
            }
            
            const data = await response.json();
            return {
                title: data.properties.title,
                sheets: data.sheets.map(sheet => ({
                    sheetId: sheet.properties.sheetId,
                    title: sheet.properties.title,
                    rowCount: sheet.properties.gridProperties.rowCount,
                    columnCount: sheet.properties.gridProperties.columnCount
                }))
            };
            
        } catch (error) {
            console.error('Google Sheets API: Failed to fetch spreadsheet info', error);
            throw error;
        }
    }
    
    // Get sheet data
    async getSheetData(spreadsheetId, range, options = {}) {
        try {
            const token = await this.oauth.getValidAccessToken();
            
            const params = new URLSearchParams({
                range: range,
                valueRenderOption: options.valueRenderOption || 'FORMATTED_VALUE',
                dateTimeRenderOption: options.dateTimeRenderOption || 'FORMATTED_STRING'
            });
            
            const response = await fetch(`${this.baseUrl}/${spreadsheetId}/values/${range}?${params.toString()}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (!response.ok) {
                throw new Error(`Failed to fetch sheet data: ${response.statusText}`);
            }
            
            const data = await response.json();
            return data.values || [];
            
        } catch (error) {
            console.error('Google Sheets API: Failed to fetch sheet data', error);
            throw error;
        }
    }
    
    // Get sheet data with headers (first row as column names)
    async getSheetDataWithHeaders(spreadsheetId, range, options = {}) {
        try {
            const data = await this.getSheetData(spreadsheetId, range, options);
            
            if (data.length === 0) {
                return { headers: [], rows: [] };
            }
            
            const headers = data[0];
            const rows = data.slice(1).map(row => {
                const rowData = {};
                headers.forEach((header, index) => {
                    rowData[header] = row[index] || '';
                });
                return rowData;
            });
            
            return { headers, rows };
            
        } catch (error) {
            console.error('Google Sheets API: Failed to fetch sheet data with headers', error);
            throw error;
        }
    }
    
    // Watch for changes (set up webhook)
    async watchSpreadsheet(spreadsheetId, webhookUrl) {
        try {
            const token = await this.oauth.getValidAccessToken();
            
            const response = await fetch(`${this.driveUrl}/files/${spreadsheetId}/watch`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: `figma-sync-${spreadsheetId}-${Date.now()}`,
                    type: 'web_hook',
                    address: webhookUrl,
                    expiration: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
                })
            });
            
            if (!response.ok) {
                throw new Error(`Failed to set up webhook: ${response.statusText}`);
            }
            
            const data = await response.json();
            return data;
            
        } catch (error) {
            console.error('Google Sheets API: Failed to set up webhook', error);
            throw error;
        }
    }
    
    // Stop watching (remove webhook)
    async stopWatching(spreadsheetId, channelId) {
        try {
            const token = await this.oauth.getValidAccessToken();
            
            const response = await fetch(`${this.driveUrl}/channels/stop`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: channelId,
                    resourceId: spreadsheetId
                })
            });
            
            if (!response.ok) {
                throw new Error(`Failed to stop webhook: ${response.statusText}`);
            }
            
            return true;
            
        } catch (error) {
            console.error('Google Sheets API: Failed to stop webhook', error);
            throw error;
        }
    }
    
    // Get sheet data in batches (for large sheets)
    async getSheetDataBatched(spreadsheetId, range, batchSize = 1000) {
        try {
            const allData = [];
            let currentRow = 1;
            let hasMoreData = true;
            
            while (hasMoreData) {
                const endRow = currentRow + batchSize - 1;
                const batchRange = `${range}!${currentRow}:${endRow}`;
                
                const batchData = await this.getSheetData(spreadsheetId, batchRange);
                
                if (batchData.length === 0) {
                    hasMoreData = false;
                } else {
                    allData.push(...batchData);
                    currentRow = endRow + 1;
                    
                    // Check if we got less data than requested (end of sheet)
                    if (batchData.length < batchSize) {
                        hasMoreData = false;
                    }
                }
            }
            
            return allData;
            
        } catch (error) {
            console.error('Google Sheets API: Failed to fetch batched sheet data', error);
            throw error;
        }
    }
    
    // Validate spreadsheet access
    async validateAccess(spreadsheetId) {
        try {
            await this.getSpreadsheetInfo(spreadsheetId);
            return true;
        } catch (error) {
            console.error('Google Sheets API: Access validation failed', error);
            return false;
        }
    }
    
    // Get sheet data as CSV format
    async getSheetAsCSV(spreadsheetId, range) {
        try {
            const data = await this.getSheetData(spreadsheetId, range);
            
            // Convert to CSV format
            const csvRows = data.map(row => {
                return row.map(cell => {
                    // Escape quotes and wrap in quotes if contains comma, quote, or newline
                    const cellStr = String(cell || '');
                    if (cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n')) {
                        return `"${cellStr.replace(/"/g, '""')}"`;
                    }
                    return cellStr;
                }).join(',');
            });
            
            return csvRows.join('\n');
            
        } catch (error) {
            console.error('Google Sheets API: Failed to get sheet as CSV', error);
            throw error;
        }
    }
}

// Export for use in Figma plugin
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GoogleSheetsAPI;
} else {
    window.GoogleSheetsAPI = GoogleSheetsAPI;
}
