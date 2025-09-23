// MiracleData - CSV Import Plugin
// Clean, production-ready CSV import functionality

console.log('MiracleData CSV Import Plugin loaded');

// CSV Import Functionality
function importCSVData(csvText, collectionName) {
    console.log('Starting CSV import for collection:', collectionName);
    
    try {
        // Parse CSV with proper handling of quoted content
        function parseCSVLine(line) {
            const result = [];
            let current = '';
            let inQuotes = false;
            
            for (let i = 0; i < line.length; i++) {
                const char = line[i];
                
                if (char === '"') {
                    inQuotes = !inQuotes;
                } else if (char === ',' && !inQuotes) {
                    result.push(current.trim());
                    current = '';
                } else {
                    current += char;
                }
            }
            
            result.push(current.trim());
            return result.map(cell => cell.replace(/^"|"$/g, ''));
        }
        
        const lines = csvText.split('\n').filter(line => line.trim() !== '');
        const rawData = lines.map(line => parseCSVLine(line));
        
        // Find the row with the most columns to determine structure
        const maxColumns = Math.max(...rawData.map(row => row.length));
        console.log(`📊 Maximum columns found: ${maxColumns}`);
        
        // Use the first row as headers, but if it has fewer columns than data rows, 
        // create generic headers for the missing columns
        let headers = rawData[0] || [];
        if (headers.length < maxColumns) {
            // Pad headers with generic names for missing columns
            for (let i = headers.length; i < maxColumns; i++) {
                headers.push(`Column ${i + 1}`);
            }
        }
        
        // Remove the header row from data
        let data = rawData.slice(1);
        
        // Remove empty rows and metadata rows
        data = data.filter(row => {
            // Skip empty rows
            if (!row.some(cell => cell.trim() !== '')) {
                return false;
            }
            
            // Skip rows that look like metadata (contain "figma", "design", "notes", etc.)
            const firstCell = (row[0] && row[0].toLowerCase) ? row[0].toLowerCase() : '';
            if (firstCell.includes('figma') || 
                firstCell.includes('design') || 
                firstCell.includes('note') ||
                firstCell.includes('file here') ||
                firstCell.includes('instructions') ||
                firstCell.includes('comment') ||
                firstCell.startsWith('(') ||
                firstCell === '') {
                console.log(`Skipping metadata row: ${row[0]}`);
                return false;
            }
            
            return true;
        });
        
        console.log(`📊 Removed ${rawData.length - data.length} empty rows`);
        
        console.log('CSV parsed:', { headers, rowCount: data.length });
        console.log('📊 First few rows:', data.slice(0, 3));
        console.log('📋 Headers:', headers);
        console.log('📊 Number of columns detected:', headers.length);
        console.log('📊 Sample row lengths:', data.slice(0, 3).map(row => row.length));
        
        // Detect CSV structure
        const hasMultipleModes = headers.length > 2;
        console.log(`📊 CSV Structure: ${hasMultipleModes ? 'Multiple Modes' : 'Single Mode'}`);
        console.log(`📋 Columns: ${headers.length} (${headers.join(', ')})`);
        
        // Create collection
        const collection = figma.variables.createVariableCollection(collectionName);
        
        if (hasMultipleModes) {
            // MULTIPLE MODES: A=Variable Name, B=Mode1, C=Mode2, etc.
            console.log('🔄 Creating multiple modes...');
            
            // Create modes from column headers (skip first column which is variable names)
            const modeMap = {};
            headers.slice(1).forEach((modeName, index) => {
                // Use the actual header name as mode name, or fallback
                let finalModeName = modeName || `Mode ${index + 1}`;
                
                // Truncate mode name to 40 characters (Figma limit)
                if (finalModeName.length > 40) {
                    finalModeName = finalModeName.substring(0, 37) + '...';
                }
                
                const modeId = collection.addMode(finalModeName);
                modeMap[index] = modeId;
                console.log(`Created mode: ${finalModeName} with ID: ${modeId}`);
            });
            
            // Create variables for each row
            data.forEach((row, rowIndex) => {
                const variableName = row[0] || `Variable ${rowIndex + 1}`;
                
                // Skip empty rows
                if (!variableName.trim()) {
                    console.log(`Skipping empty row ${rowIndex + 1}`);
                    return;
                }
                
                // Determine variable type (check first non-empty value)
                let variableType = 'STRING';
                for (let i = 1; i < row.length; i++) {
                    if (row[i] && row[i].startsWith('#')) {
                        variableType = 'COLOR';
                        break;
                    }
                }
                
                try {
                    const variable = figma.variables.createVariable(variableName, collection, variableType);
                    
                    // Set values for each mode
                    headers.slice(1).forEach((_, modeIndex) => {
                        const modeId = modeMap[modeIndex];
                        let value = row[modeIndex + 1]; // +1 because first column is variable name
                        
                        if (variableType === 'COLOR' && value && value.startsWith('#')) {
                            value = hexToRgb(value);
                        }
                        
                        if (modeId && value) {
                            variable.setValueForMode(modeId, value);
                            console.log(`Set ${variableName} for ${headers[modeIndex + 1]} to:`, value);
                        }
                    });
                } catch (error) {
                    console.log(`Error creating variable ${variableName}:`, error);
                }
            });
            
        } else {
            // SINGLE MODE: A=Variable Name, B=Value
            console.log('🔄 Creating single mode...');
            
            const modeName = collectionName || 'Default Mode';
            const modeId = collection.addMode(modeName);
            console.log(`Created single mode: ${modeName} with ID: ${modeId}`);
            
            // Create variables for each row
            data.forEach((row, index) => {
                const variableName = row[0] || `Variable ${index + 1}`;
                const variableValue = row[1] || '';
                
                // Skip empty rows
                if (!variableName.trim()) {
                    console.log(`Skipping empty row ${index + 1}`);
                    return;
                }
                
                // Determine variable type
                let variableType = 'STRING';
                if (variableValue && variableValue.startsWith('#')) {
                    variableType = 'COLOR';
                }
                
                try {
                    const variable = figma.variables.createVariable(variableName, collection, variableType);
                    
                    let value = variableValue;
                    if (variableType === 'COLOR' && value && value.startsWith('#')) {
                        value = hexToRgb(value);
                    }
                    
                    if (value) {
                        variable.setValueForMode(modeId, value);
                        console.log(`Created variable: ${variableName} = ${variableValue}`);
                    }
                } catch (error) {
                    console.log(`Error creating variable ${variableName}:`, error);
                }
            });
        }
        
        // Remove default "Mode 1" after CSV import
        const defaultMode = collection.modes.find(mode => mode.name === 'Mode 1' || mode.name === 'Default');
        if (defaultMode) {
            try {
                collection.removeMode(defaultMode.modeId);
                console.log('✅ Removed default "Mode 1" from CSV import');
            } catch (removeError) {
                console.log('⚠️ Could not remove default mode:', removeError.message);
            }
        }
        
        console.log('✅ CSV import successful');
        figma.notify(`✅ Successfully imported ${data.length} rows from CSV`);
        
        return {
            success: true,
            rowCount: data.length,
            variableCount: headers.length - 1
        };
        
    } catch (error) {
        console.error('CSV import failed:', error);
        figma.notify('❌ CSV import failed: ' + error.message);
        return {
            success: false,
            error: error.message
        };
    }
}

// Helper function to convert hex to RGB (from main plugin)
function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16) / 255,
        g: parseInt(result[2], 16) / 255,
        b: parseInt(result[3], 16) / 255
    } : { r: 0.5, g: 0.5, b: 0.5 };
}

// Handle UI messages
figma.ui.onmessage = msg => {
    if (msg.type === 'import-csv') {
        console.log('🚀 Received CSV import request');
        console.log('📊 CSV data length:', msg.csvText ? msg.csvText.length : 'undefined');
        console.log('📝 Collection name:', msg.collectionName);
        
        const result = importCSVData(msg.csvText, msg.collectionName || 'CSV Import');
        
        console.log('📋 Import result:', result);
        
        // Send result back to UI
        figma.ui.postMessage({
            type: 'csv-import-result',
            success: result.success,
            rowCount: result.rowCount,
            variableCount: result.variableCount,
            error: result.error
        });
    }
};

// Initialize plugin
try {
    console.log('Initializing CSV Import plugin...');
    
    // Show UI
    figma.showUI(__html__, { width: 400, height: 300 });
    
} catch (error) {
    console.error('Failed to initialize plugin:', error);
    figma.notify('❌ Plugin initialization failed: ' + error.message);
}
