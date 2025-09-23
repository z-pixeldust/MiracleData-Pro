// Data Mapper for Google Sheets to Figma Variables
// Phase 3: Transform spreadsheet data to Figma variables

class DataMapper {
    constructor() {
        this.variableTypes = {
            COLOR: 'COLOR',
            FLOAT: 'FLOAT',
            STRING: 'STRING'
        };
        
        this.defaultMappings = {
            // Common column name mappings
            'name': 'name',
            'value': 'value',
            'type': 'type',
            'description': 'description',
            'color': 'color',
            'size': 'size',
            'weight': 'weight',
            'opacity': 'opacity'
        };
    }
    
    // Transform sheet data to Figma variables
    async transformSheetDataToVariables(sheetData, collectionId) {
        try {
            console.log('DataMapper: Transforming sheet data to variables');
            
            const { headers, rows } = sheetData;
            
            if (!headers || headers.length === 0) {
                throw new Error('No headers found in sheet data');
            }
            
            // Validate headers
            const validatedHeaders = this.validateHeaders(headers);
            
            // Transform rows to variables
            const variables = [];
            
            for (let i = 0; i < rows.length; i++) {
                const row = rows[i];
                
                try {
                    const variable = this.transformRowToVariable(row, validatedHeaders, i);
                    if (variable) {
                        variables.push(variable);
                    }
                } catch (error) {
                    console.warn(`DataMapper: Failed to transform row ${i}`, error);
                    // Continue with other rows
                }
            }
            
            console.log(`DataMapper: Transformed ${variables.length} variables`);
            return variables;
            
        } catch (error) {
            console.error('DataMapper: Failed to transform sheet data', error);
            throw error;
        }
    }
    
    // Validate and normalize headers
    validateHeaders(headers) {
        const validatedHeaders = {};
        
        for (let i = 0; i < headers.length; i++) {
            const header = headers[i];
            if (!header || typeof header !== 'string') {
                continue;
            }
            
            const normalizedHeader = this.normalizeHeader(header);
            validatedHeaders[normalizedHeader] = {
                original: header,
                index: i,
                type: this.inferHeaderType(header)
            };
        }
        
        return validatedHeaders;
    }
    
    // Normalize header name
    normalizeHeader(header) {
        return header.toLowerCase().trim().replace(/[^a-z0-9_]/g, '_');
    }
    
    // Infer header type based on name
    inferHeaderType(header) {
        const lowerHeader = header.toLowerCase();
        
        if (lowerHeader.includes('color') || lowerHeader.includes('colour')) {
            return 'color';
        } else if (lowerHeader.includes('size') || lowerHeader.includes('width') || lowerHeader.includes('height')) {
            return 'number';
        } else if (lowerHeader.includes('opacity') || lowerHeader.includes('alpha')) {
            return 'number';
        } else if (lowerHeader.includes('type') || lowerHeader.includes('kind')) {
            return 'type';
        } else {
            return 'string';
        }
    }
    
    // Transform a single row to a variable
    transformRowToVariable(row, headers, rowIndex) {
        try {
            // Get required fields
            const name = this.getValueByHeader(row, headers, 'name');
            const value = this.getValueByHeader(row, headers, 'value');
            const type = this.getValueByHeader(row, headers, 'type');
            const description = this.getValueByHeader(row, headers, 'description');
            
            if (!name || !value) {
                console.warn(`DataMapper: Row ${rowIndex} missing required fields (name, value)`);
                return null;
            }
            
            // Determine variable type
            const variableType = this.determineVariableType(type, value, headers);
            
            // Transform value based on type
            const transformedValue = this.transformValue(value, variableType);
            
            // Create variable object
            const variable = {
                name: this.sanitizeVariableName(name),
                value: transformedValue,
                type: variableType,
                description: description || '',
                rowIndex: rowIndex,
                originalData: row
            };
            
            return variable;
            
        } catch (error) {
            console.error(`DataMapper: Failed to transform row ${rowIndex}`, error);
            return null;
        }
    }
    
    // Get value by header name
    getValueByHeader(row, headers, headerName) {
        const headerInfo = headers[headerName];
        if (!headerInfo) {
            return null;
        }
        
        return row[headerInfo.original] || null;
    }
    
    // Determine variable type
    determineVariableType(type, value, headers) {
        // If type is explicitly specified
        if (type) {
            const upperType = type.toUpperCase();
            if (upperType === 'COLOR' || upperType === 'COLOUR') {
                return this.variableTypes.COLOR;
            } else if (upperType === 'FLOAT' || upperType === 'NUMBER') {
                return this.variableTypes.FLOAT;
            } else if (upperType === 'STRING' || upperType === 'TEXT') {
                return this.variableTypes.STRING;
            }
        }
        
        // Infer type from value
        if (this.isColorValue(value)) {
            return this.variableTypes.COLOR;
        } else if (this.isNumberValue(value)) {
            return this.variableTypes.FLOAT;
        } else {
            return this.variableTypes.STRING;
        }
    }
    
    // Check if value is a color
    isColorValue(value) {
        if (typeof value !== 'string') return false;
        
        // Hex color
        if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(value)) {
            return true;
        }
        
        // RGB/RGBA color
        if (/^rgba?\(/.test(value)) {
            return true;
        }
        
        // HSL color
        if (/^hsla?\(/.test(value)) {
            return true;
        }
        
        // Named colors (basic set)
        const namedColors = ['red', 'blue', 'green', 'yellow', 'orange', 'purple', 'pink', 'black', 'white', 'gray', 'grey'];
        return namedColors.includes(value.toLowerCase());
    }
    
    // Check if value is a number
    isNumberValue(value) {
        if (typeof value === 'number') return true;
        if (typeof value === 'string') {
            return !isNaN(parseFloat(value)) && isFinite(value);
        }
        return false;
    }
    
    // Transform value based on type
    transformValue(value, variableType) {
        try {
            switch (variableType) {
                case this.variableTypes.COLOR:
                    return this.transformColorValue(value);
                case this.variableTypes.FLOAT:
                    return this.transformNumberValue(value);
                case this.variableTypes.STRING:
                    return this.transformStringValue(value);
                default:
                    return value;
            }
        } catch (error) {
            console.error('DataMapper: Failed to transform value', error);
            return value;
        }
    }
    
    // Transform color value
    transformColorValue(value) {
        if (typeof value !== 'string') {
            throw new Error('Color value must be a string');
        }
        
        // Convert to RGB format for Figma
        if (value.startsWith('#')) {
            // Hex to RGB
            const hex = value.replace('#', '');
            const r = parseInt(hex.substr(0, 2), 16) / 255;
            const g = parseInt(hex.substr(2, 2), 16) / 255;
            const b = parseInt(hex.substr(4, 2), 16) / 255;
            return { r, g, b };
        } else if (value.startsWith('rgb')) {
            // RGB/RGBA to RGB
            const matches = value.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
            if (matches) {
                const r = parseInt(matches[1]) / 255;
                const g = parseInt(matches[2]) / 255;
                const b = parseInt(matches[3]) / 255;
                return { r, g, b };
            }
        }
        
        // Named colors (basic mapping)
        const namedColors = {
            'red': { r: 1, g: 0, b: 0 },
            'blue': { r: 0, g: 0, b: 1 },
            'green': { r: 0, g: 1, b: 0 },
            'yellow': { r: 1, g: 1, b: 0 },
            'orange': { r: 1, g: 0.5, b: 0 },
            'purple': { r: 0.5, g: 0, b: 1 },
            'pink': { r: 1, g: 0.5, b: 0.5 },
            'black': { r: 0, g: 0, b: 0 },
            'white': { r: 1, g: 1, b: 1 },
            'gray': { r: 0.5, g: 0.5, b: 0.5 },
            'grey': { r: 0.5, g: 0.5, b: 0.5 }
        };
        
        if (namedColors[value.toLowerCase()]) {
            return namedColors[value.toLowerCase()];
        }
        
        throw new Error(`Unsupported color format: ${value}`);
    }
    
    // Transform number value
    transformNumberValue(value) {
        if (typeof value === 'number') {
            return value;
        }
        
        const num = parseFloat(value);
        if (isNaN(num) || !isFinite(num)) {
            throw new Error(`Invalid number value: ${value}`);
        }
        
        return num;
    }
    
    // Transform string value
    transformStringValue(value) {
        return String(value || '');
    }
    
    // Sanitize variable name
    sanitizeVariableName(name) {
        // Remove invalid characters and replace with underscores
        return name.replace(/[^a-zA-Z0-9_]/g, '_').replace(/^[0-9]/, '_$&');
    }
    
    // Validate transformed variables
    validateVariables(variables) {
        const errors = [];
        const warnings = [];
        
        for (const variable of variables) {
            // Check required fields
            if (!variable.name) {
                errors.push(`Variable missing name at row ${variable.rowIndex}`);
            }
            
            if (variable.value === undefined || variable.value === null) {
                errors.push(`Variable ${variable.name} missing value`);
            }
            
            if (!variable.type) {
                errors.push(`Variable ${variable.name} missing type`);
            }
            
            // Check for duplicate names
            const duplicates = variables.filter(v => v.name === variable.name);
            if (duplicates.length > 1) {
                warnings.push(`Duplicate variable name: ${variable.name}`);
            }
            
            // Validate value based on type
            try {
                this.validateVariableValue(variable.value, variable.type);
            } catch (error) {
                errors.push(`Variable ${variable.name}: ${error.message}`);
            }
        }
        
        return { errors, warnings };
    }
    
    // Validate variable value
    validateVariableValue(value, type) {
        switch (type) {
            case this.variableTypes.COLOR:
                if (typeof value !== 'object' || !value.r || !value.g || !value.b) {
                    throw new Error('Color value must be an object with r, g, b properties');
                }
                break;
            case this.variableTypes.FLOAT:
                if (typeof value !== 'number' || isNaN(value)) {
                    throw new Error('Float value must be a valid number');
                }
                break;
            case this.variableTypes.STRING:
                if (typeof value !== 'string') {
                    throw new Error('String value must be a string');
                }
                break;
        }
    }
}

// Export for use in Figma plugin
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DataMapper;
} else {
    window.DataMapper = DataMapper;
}
