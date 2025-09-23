// This plugin creates local variable collections from sports data fetched from ESPN API

// All data will be fetched live from APIs.

// Phase 1: Safe infrastructure (non-breaking)
// Figma-compatible infrastructure loaded via script tag in HTML

// Define fallback data (minimal structure to prevent errors)
let SPORTS_DATA = {
  NBA: [
    {
      full_team_name: "Los Angeles Lakers",
      logo: "Los Angeles Lakers",
      city: "Los Angeles",
      short_name: "Lakers",
      tricode: "LAL",
      primary_color: { r: 0.09, g: 0.11, b: 0.49 },
      secondary_color: { r: 0.98, g: 0.85, b: 0.37 }
    },
    {
      full_team_name: "Boston Celtics",
      logo: "Boston Celtics",
      city: "Boston",
      short_name: "Celtics",
      tricode: "BOS",
      primary_color: { r: 0.00, g: 0.51, b: 0.28 },
      secondary_color: { r: 0.95, g: 0.83, b: 0.18 }
    }
  ],
  NFL: [
    {
      full_team_name: "Arizona Cardinals",
      logo: "Arizona Cardinals",
      city: "Arizona",
      short_name: "Cardinals",
      tricode: "ARI",
      primary_color: { r: 0.64, g: 0.01, b: 0.15 }, // #A40227
      secondary_color: { r: 1.0, g: 1.0, b: 1.0 }   // #FFFFFF
    },
    {
      full_team_name: "Atlanta Falcons",
      logo: "Atlanta Falcons",
      city: "Atlanta",
      short_name: "Falcons",
      tricode: "ATL",
      primary_color: { r: 0.65, g: 0.10, b: 0.19 }, // #A71930
      secondary_color: { r: 0.0, g: 0.0, b: 0.0 }   // #000000
    },
    {
      full_team_name: "Baltimore Ravens",
      logo: "Baltimore Ravens",
      city: "Baltimore",
      short_name: "Ravens",
      tricode: "BAL",
      primary_color: { r: 0.16, g: 0.07, b: 0.44 }, // #29126F
      secondary_color: { r: 0.0, g: 0.0, b: 0.0 }   // #000000
    }
  ],
  MLB: [
    {
      full_team_name: "New York Yankees",
      logo: "New York Yankees",
      city: "New York",
      short_name: "Yankees",
      tricode: "NYY",
      primary_color: { r: 0.0, g: 0.0, b: 0.0 },    // #000000
      secondary_color: { r: 1.0, g: 1.0, b: 1.0 }   // #FFFFFF
    },
    {
      full_team_name: "Boston Red Sox",
      logo: "Boston Red Sox",
      city: "Boston",
      short_name: "Red Sox",
      tricode: "BOS",
      primary_color: { r: 0.67, g: 0.0, b: 0.0 },   // #AB0003
      secondary_color: { r: 1.0, g: 0.8, b: 0.0 }   // #FFD700
    }
  ],
  NHL: [
    {
      full_team_name: "Boston Bruins",
      logo: "Boston Bruins",
      city: "Boston",
      short_name: "Bruins",
      tricode: "BOS",
      primary_color: { r: 0.0, g: 0.0, b: 0.0 },    // #000000
      secondary_color: { r: 1.0, g: 0.84, b: 0.0 }  // #FFB81C
    },
    {
      full_team_name: "Chicago Blackhawks",
      logo: "Chicago Blackhawks",
      city: "Chicago",
      short_name: "Blackhawks",
      tricode: "CHI",
      primary_color: { r: 0.78, g: 0.0, b: 0.0 },   // #C8102E
      secondary_color: { r: 0.0, g: 0.0, b: 0.0 }   // #000000
    }
  ],
  WNBA: [
    {
      full_team_name: "Las Vegas Aces",
      logo: "Las Vegas Aces",
      city: "Las Vegas",
      short_name: "Aces",
      tricode: "LV",
      primary_color: { r: 0.0, g: 0.0, b: 0.0 },    // #000000
      secondary_color: { r: 0.0, g: 0.5, b: 1.0 }   // #0080FF
    },
    {
      full_team_name: "New York Liberty",
      logo: "New York Liberty",
      city: "New York",
      short_name: "Liberty",
      tricode: "NY",
      primary_color: { r: 0.0, g: 0.0, b: 0.0 },    // #000000
      secondary_color: { r: 0.0, g: 0.5, b: 1.0 }   // #0080FF
    }
  ],
  "NCAA Football": [
    {
      full_team_name: "Alabama Crimson Tide",
      logo: "Alabama Crimson Tide",
      city: "Alabama",
      short_name: "Crimson Tide",
      tricode: "ALA",
      primary_color: { r: 0.65, g: 0.0, b: 0.0 },   // #A50000
      secondary_color: { r: 1.0, g: 1.0, b: 1.0 }   // #FFFFFF
    },
    {
      full_team_name: "Georgia Bulldogs",
      logo: "Georgia Bulldogs",
      city: "Georgia",
      short_name: "Bulldogs",
      tricode: "UGA",
      primary_color: { r: 0.0, g: 0.0, b: 0.0 },    // #000000
      secondary_color: { r: 0.0, g: 0.5, b: 0.0 }   // #008000
    }
  ]
};

// Core async function to fetch NBA data from ESPN API
async function fetchNBAData() {
    try {
        const response = await fetch('https://site.api.espn.com/apis/site/v2/sports/basketball/nba/teams');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        const teams = data.sports[0].leagues[0].teams.map(team => ({
            full_team_name: team.team.displayName,
            logo: team.team.displayName, // Using team name as logo text
            city: team.team.location,
            short_name: team.team.name,
            tricode: team.team.abbreviation,
            primary_color: team.team.color ? hexToRgb(team.team.color) : { r: 0.5, g: 0.5, b: 0.5 },
            secondary_color: team.team.alternateColor ? hexToRgb(team.team.alternateColor) : { r: 0.8, g: 0.8, b: 0.8 }
        }));
        
        return teams;
    } catch (error) {
        console.error('Error fetching NBA data:', error);
        return SPORTS_DATA.NBA; // Return fallback data
    }
}

// Core async function to fetch NFL data from ESPN API
async function fetchNFLData() {
    try {
        console.log('Starting NFL data fetch...');
        const response = await fetch('https://site.api.espn.com/apis/site/v2/sports/football/nfl/teams');
        console.log('NFL API response status:', response.status);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('NFL API response data:', data);
        
        if (!data.sports || !data.sports[0] || !data.sports[0].leagues || !data.sports[0].leagues[0] || !data.sports[0].leagues[0].teams) {
            console.error('NFL API response structure unexpected:', data);
            return [];
        }
        
        const teams = data.sports[0].leagues[0].teams.map(team => ({
            full_team_name: team.team.displayName,
            logo: team.team.displayName, // Using team name as logo text
            city: team.team.location,
            short_name: team.team.name,
            tricode: team.team.abbreviation,
            primary_color: team.team.color ? hexToRgb(team.team.color) : { r: 0.5, g: 0.5, b: 0.5 },
            secondary_color: team.team.alternateColor ? hexToRgb(team.team.alternateColor) : { r: 0.8, g: 0.8, b: 0.8 }
        }));
        
        console.log('Processed NFL teams:', teams.length, teams);
        return teams;
    } catch (error) {
        console.error('Error fetching NFL data:', error);
        console.log('Using fallback NFL data');
        return SPORTS_DATA.NFL; // Return fallback data
    }
}

// Core async function to fetch MLB data from ESPN API
async function fetchMLBData() {
    try {
        console.log('Starting MLB data fetch...');
        const response = await fetch('https://site.api.espn.com/apis/site/v2/sports/baseball/mlb/teams');
        console.log('MLB API response status:', response.status);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('MLB API response data:', data);
        
        if (!data.sports || !data.sports[0] || !data.sports[0].leagues || !data.sports[0].leagues[0] || !data.sports[0].leagues[0].teams) {
            console.error('MLB API response structure unexpected:', data);
            return SPORTS_DATA.MLB;
        }
        
        const teams = data.sports[0].leagues[0].teams.map(team => ({
            full_team_name: team.team.displayName,
            logo: team.team.displayName,
            city: team.team.location,
            short_name: team.team.name,
            tricode: team.team.abbreviation,
            primary_color: team.team.color ? hexToRgb(team.team.color) : { r: 0.5, g: 0.5, b: 0.5 },
            secondary_color: team.team.alternateColor ? hexToRgb(team.team.alternateColor) : { r: 0.8, g: 0.8, b: 0.8 }
        }));
        
        console.log('Processed MLB teams:', teams.length, teams);
        return teams;
    } catch (error) {
        console.error('Error fetching MLB data:', error);
        console.log('Using fallback MLB data');
        return SPORTS_DATA.MLB;
    }
}

// Core async function to fetch NHL data from ESPN API
async function fetchNHLData() {
    try {
        console.log('Starting NHL data fetch...');
        const response = await fetch('https://site.api.espn.com/apis/site/v2/sports/hockey/nhl/teams');
        console.log('NHL API response status:', response.status);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('NHL API response data:', data);
        
        if (!data.sports || !data.sports[0] || !data.sports[0].leagues || !data.sports[0].leagues[0] || !data.sports[0].leagues[0].teams) {
            console.error('NHL API response structure unexpected:', data);
            return SPORTS_DATA.NHL;
        }
        
        const teams = data.sports[0].leagues[0].teams.map(team => ({
            full_team_name: team.team.displayName,
            logo: team.team.displayName,
            city: team.team.location,
            short_name: team.team.name,
            tricode: team.team.abbreviation,
            primary_color: team.team.color ? hexToRgb(team.team.color) : { r: 0.5, g: 0.5, b: 0.5 },
            secondary_color: team.team.alternateColor ? hexToRgb(team.team.alternateColor) : { r: 0.8, g: 0.8, b: 0.8 }
        }));
        
        console.log('Processed NHL teams:', teams.length, teams);
        return teams;
    } catch (error) {
        console.error('Error fetching NHL data:', error);
        console.log('Using fallback NHL data');
        return SPORTS_DATA.NHL;
    }
}

// Core async function to fetch WNBA data from ESPN API
async function fetchWNBAData() {
    try {
        console.log('Starting WNBA data fetch...');
        const response = await fetch('https://site.api.espn.com/apis/site/v2/sports/basketball/wnba/teams');
        console.log('WNBA API response status:', response.status);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('WNBA API response data:', data);
        
        if (!data.sports || !data.sports[0] || !data.sports[0].leagues || !data.sports[0].leagues[0] || !data.sports[0].leagues[0].teams) {
            console.error('WNBA API response structure unexpected:', data);
            return SPORTS_DATA.WNBA;
        }
        
        const teams = data.sports[0].leagues[0].teams.map(team => ({
            full_team_name: team.team.displayName,
            logo: team.team.displayName,
            city: team.team.location,
            short_name: team.team.name,
            tricode: team.team.abbreviation,
            primary_color: team.team.color ? hexToRgb(team.team.color) : { r: 0.5, g: 0.5, b: 0.5 },
            secondary_color: team.team.alternateColor ? hexToRgb(team.team.alternateColor) : { r: 0.8, g: 0.8, b: 0.8 }
        }));
        
        console.log('Processed WNBA teams:', teams.length, teams);
        return teams;
    } catch (error) {
        console.error('Error fetching WNBA data:', error);
        console.log('Using fallback WNBA data');
        return SPORTS_DATA.WNBA;
    }
}

// Core async function to fetch NCAA Football data from ESPN API (Top 40 teams only)
async function fetchNCAAData() {
    try {
        console.log('Starting NCAA Football (Top 40) data fetch...');
        // Fetch rankings to get top 40 teams, then get their details
        const rankingsResponse = await fetch('https://site.api.espn.com/apis/site/v2/sports/football/college-football/rankings');
        console.log('NCAA Football rankings API response status:', rankingsResponse.status);
        
        if (!rankingsResponse.ok) {
            throw new Error(`Rankings HTTP error! status: ${rankingsResponse.status}`);
        }
        const rankingsData = await rankingsResponse.json();
        
        // Get top 40 teams from AP poll (most common ranking)
        let topTeams = [];
        if (rankingsData.rankings && rankingsData.rankings.length > 0) {
            const apPoll = rankingsData.rankings.find(ranking => 
                ranking.name && ranking.name.toLowerCase().includes('ap')
            );
            
            if (apPoll && apPoll.ranks) {
                topTeams = apPoll.ranks.slice(0, 25).map(rank => ({
                    teamId: rank.team.id,
                    rank: rank.current,
                    teamName: rank.team.displayName
                }));
            }
        }
        
        console.log('Found top teams:', topTeams.length);
        
        // If no rankings available, get top teams from regular API and limit to 25
        if (topTeams.length === 0) {
            console.log('No rankings found, fetching teams from regular API...');
            const response = await fetch('https://site.api.espn.com/apis/site/v2/sports/football/college-football/teams?limit=130');
            const data = await response.json();
            
            if (data.sports && data.sports[0] && data.sports[0].leagues && data.sports[0].leagues[0] && data.sports[0].leagues[0].teams) {
                const teams = data.sports[0].leagues[0].teams.slice(0, 25).map(team => ({
                    full_team_name: team.team.displayName,
                    logo: team.team.location, // Use city name same as City field
                    city: team.team.location,
                    short_name: team.team.name,
                    tricode: team.team.abbreviation,
                    primary_color: team.team.color ? hexToRgb(team.team.color) : { r: 0.5, g: 0.5, b: 0.5 },
                    secondary_color: team.team.alternateColor ? hexToRgb(team.team.alternateColor) : { r: 0.8, g: 0.8, b: 0.8 }
                }));
                
                console.log('Processed top 25 NCAA Football teams:', teams.length, teams);
                return teams;
            }
        }
        
        // If we have rankings, fetch detailed team info for top 40
        const teams = [];
        for (const topTeam of topTeams) {
            try {
                const teamResponse = await fetch(`https://site.api.espn.com/apis/site/v2/sports/football/college-football/teams/${topTeam.teamId}`);
                const teamData = await teamResponse.json();
                
                if (teamData.team) {
                    teams.push({
                        full_team_name: teamData.team.displayName,
                        logo: teamData.team.location, // Use city name same as City field
                        city: teamData.team.location,
                        short_name: teamData.team.name,
                        tricode: teamData.team.abbreviation,
                        primary_color: teamData.team.color ? hexToRgb(teamData.team.color) : { r: 0.5, g: 0.5, b: 0.5 },
                        secondary_color: teamData.team.alternateColor ? hexToRgb(teamData.team.alternateColor) : { r: 0.8, g: 0.8, b: 0.8 },
                        rank: topTeam.rank
                    });
                }
            } catch (teamError) {
                console.log(`Error fetching team ${topTeam.teamName}:`, teamError);
            }
        }
        
        console.log('Processed top 25 ranked NCAA Football teams:', teams.length, teams);
        return teams;
        
    } catch (error) {
        console.error('Error fetching NCAA Football data:', error);
        console.log('Using fallback NCAA Football data');
        return SPORTS_DATA["NCAA Football"];
    }
}

// Helper function to convert hex colors to RGB
function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16) / 255,
        g: parseInt(result[2], 16) / 255,
        b: parseInt(result[3], 16) / 255
    } : { r: 0.5, g: 0.5, b: 0.5 };
}

// Helper function to create collection with team modes
async function createTeamModesCollection(teams, leagueName) {
    let createdCount = 0;
    
    // Create or get collection
    let collection;
    const existingCollections = figma.variables.getLocalVariableCollections();
    const existingCollection = existingCollections.find(c => c.name === leagueName);
    
    if (existingCollection) {
        collection = existingCollection;
        console.log(`Using existing ${leagueName} collection`);
    } else {
        collection = figma.variables.createVariableCollection(leagueName);
        console.log(`Created new ${leagueName} collection`);
    }
    
    // First, create all team modes
    const teamModeIds = {};
    teams.forEach(team => {
        try {
            // Check if mode already exists
            const existingMode = collection.modes.find(mode => mode.name === team.full_team_name);
            let modeId = existingMode ? existingMode.modeId : null;
            
            if (!modeId) {
                // Create new mode for this team
                modeId = collection.addMode(team.full_team_name);
                console.log(`Created mode for ${team.full_team_name}`);
            }
            
            teamModeIds[team.full_team_name] = modeId;
        } catch (modeError) {
            console.log(`Error creating mode for ${team.full_team_name}:`, modeError);
        }
    });
    
    // Remove the default empty mode if it exists and we have team modes
    if (collection.modes.length > teams.length) {
        try {
            const defaultMode = collection.modes.find(mode => mode.name === 'Mode 1' || mode.name === 'Default');
            if (defaultMode) {
                collection.removeMode(defaultMode.modeId);
                console.log('Removed default empty mode');
            }
        } catch (removeError) {
            console.log('Could not remove default mode:', removeError);
        }
    }
    
    // Create variables for each data type
    const variableNames = [
        'Full Team Name',
        'Logo', 
        'City',
        'Short Name',
        'TriCode',
        'Primary',
        'Secondary'
    ];
    
    const variableTypes = ['STRING', 'STRING', 'STRING', 'STRING', 'STRING', 'COLOR', 'COLOR'];
    
    // Add rank variable for NCAA Football
    if (leagueName === 'NCAA Football') {
        variableNames.push('Rank');
        variableTypes.push('STRING');
    }
    
    // Check if variables already exist in this specific collection
    const existingVariables = figma.variables.getLocalVariables().filter(v => v.variableCollectionId === collection.id);
    const existingVariableNames = existingVariables.map(v => v.name);
    
    for (let i = 0; i < variableNames.length; i++) {
        if (!existingVariableNames.includes(variableNames[i])) {
            try {
                const var_ = figma.variables.createVariable(variableNames[i], collection.id, variableTypes[i]);
                
                // Set values for each team mode
                teams.forEach(team => {
                    try {
                        const modeId = teamModeIds[team.full_team_name];
                        if (modeId) {
                        // Set the appropriate value for this team
                        let value;
                        switch(i) {
                            case 0: value = team.full_team_name; break;
                            case 1: value = team.logo; break;
                            case 2: value = team.city; break;
                            case 3: value = team.short_name; break;
                            case 4: value = team.tricode; break;
                            case 5: value = team.primary_color; break;
                            case 6: value = team.secondary_color; break;
                            case 7: value = leagueName === 'NCAA Football' ? (team.rank ? team.rank.toString() : 'NR') : null; break;
                        }
                        
                        // Skip if value is null (for non-NCAA Football rank variable)
                        if (value === null) return;
                            
                            console.log(`Setting ${variableNames[i]} for ${team.full_team_name} to:`, value);
                            var_.setValueForMode(modeId, value);
                        }
                    } catch (valueError) {
                        console.log(`Error setting value for ${team.full_team_name}:`, valueError);
                    }
                });
                
                createdCount++;
            } catch (error) {
                console.log(`Variable ${variableNames[i]} already exists or error creating:`, error);
            }
        } else {
            console.log(`Variable ${variableNames[i]} already exists, skipping`);
        }
    }
    
    return createdCount;
}

// Show the UI
figma.showUI(__html__, { 
  width: 600, 
  height: 600,
  themeColors: true
});

// CSV Import Functionality
async function importCSVData(csvText, collectionName) {
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
            for (let rowIndex = 0; rowIndex < data.length; rowIndex++) {
                const row = data[rowIndex];
                const variableName = row[0] || `Variable ${rowIndex + 1}`;
                
                // Skip empty rows
                if (!variableName.trim()) {
                    console.log(`Skipping empty row ${rowIndex + 1}`);
                    continue;
                }
                
                // Determine variable type (only COLOR if ALL values are colors)
                let variableType = 'STRING';
                let allValuesAreColors = true;
                
                for (let i = 1; i < row.length; i++) {
                    const value = row[i];
                    if (value && value.trim() !== '') {
                        if (!value.startsWith('#')) {
                            allValuesAreColors = false;
                            break;
                        }
                    }
                }
                
                if (allValuesAreColors && row.length > 1) {
                    variableType = 'COLOR';
                }
                
                try {
                    console.log(`Creating variable: "${variableName}" with type: ${variableType}`);
                    console.log(`Collection:`, collection);
                    console.log(`Collection variables:`, collection.variables);
                    
                    // Check if variable already exists using Figma API
                    const existingVariables = await figma.variables.getLocalVariables();
                    const existingVariable = existingVariables.find(v => v.name === variableName && v.variableCollectionId === collection.id);
                    let variable;
                    
                    if (existingVariable) {
                        console.log(`Variable "${variableName}" already exists, skipping creation`);
                        variable = existingVariable;
                    } else {
                        console.log(`Creating new variable: "${variableName}"`);
                        variable = figma.variables.createVariable(variableName, collection, variableType);
                        console.log(`Created variable:`, variable);
                    }
                    
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
                    console.error(`Error creating variable ${variableName}:`, error);
                }
            }
            
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

// Phase 1: Register existing services (non-breaking)
// This allows new features to use existing functionality through the service registry
if (typeof services !== 'undefined' && services) {
  try {
    // Register existing functionality as services
    services.register('variableManager', {
      createVariable: figma.variables.createVariable,
      createCollection: figma.variables.createVariableCollection,
      getCollections: figma.variables.getLocalVariableCollectionsAsync
    });
    
    if (typeof importCSVData === 'function') {
      services.register('csvImporter', {
        importData: importCSVData
      });
    }
    
    if (typeof fetchNBAData === 'function') {
      services.register('sportsApi', {
        fetchNBA: fetchNBAData,
        fetchNFL: fetchNFLData,
        fetchMLB: fetchMLBData,
        fetchNHL: fetchNHLData,
        fetchWNBA: fetchWNBAData,
        fetchNCAA: fetchNCAAData
      });
    }
    
    if (typeof Logger !== 'undefined' && Logger) {
      Logger.info('Existing services registered successfully');
    }
  } catch (error) {
    console.log('Service registration not available:', error.message);
  }
}

// Phase 3: Helper functions for real-time sync
async function getUserSpreadsheets(oauth) {
  try {
    if (typeof GoogleSheetsAPI !== 'undefined') {
      const sheetsAPI = new GoogleSheetsAPI(oauth);
      return await sheetsAPI.getUserSpreadsheets();
    } else {
      throw new Error('Google Sheets API not available');
    }
  } catch (error) {
    console.error('Failed to get user spreadsheets:', error);
    return [];
  }
}

// Handle messages from the UI
figma.ui.onmessage = async (msg) => {
    if (msg.type === 'get-collections') {
        const collections = await figma.variables.getLocalVariableCollectionsAsync();
        figma.ui.postMessage({ 
            type: 'collections-loaded', 
            collections: collections.map(c => ({ id: c.id, name: c.name }))
        });
    } else if (msg.type === 'fetch-sports-data') {
        try {
            console.log("Received fetch-sports-data message:", msg);
            
            const selectedSports = msg.selectedSports;
            let allTeams = [];
            
            let totalCreatedCount = 0;
            
            // Process NBA data
            if (selectedSports.includes('NBA')) {
                try {
                    console.log('Fetching NBA data...');
                    const nbaTeams = await fetchNBAData();
                    console.log(`Fetched ${nbaTeams.length} NBA teams`);
                    
                    if (nbaTeams.length === 0) {
                        console.error('No NBA teams returned from API');
                        figma.notify('No NBA teams found', { error: true });
                    }
                    
                    // Create or get NBA collection with team modes
                    const createdCount = await createTeamModesCollection(nbaTeams, 'NBA');
                    totalCreatedCount += createdCount;
                    console.log(`Created ${createdCount} NBA variables with team modes`);
                } catch (nbaError) {
                    console.error('Error processing NBA data:', nbaError);
                    figma.notify('Error processing NBA data: ' + nbaError.message, { error: true });
                }
            }
            
            // Process NFL data
            if (selectedSports.includes('NFL')) {
                try {
                    console.log('Fetching NFL data...');
                    const nflTeams = await fetchNFLData();
                    console.log(`Fetched ${nflTeams.length} NFL teams`);
                    
                    if (nflTeams.length === 0) {
                        console.error('No NFL teams returned from API');
                        figma.notify('No NFL teams found', { error: true });
                    }
                    
                    // Create or get NFL collection with team modes
                    const createdCount = await createTeamModesCollection(nflTeams, 'NFL');
                    totalCreatedCount += createdCount;
                    console.log(`Created ${createdCount} NFL variables with team modes`);
                } catch (nflError) {
                    console.error('Error processing NFL data:', nflError);
                    figma.notify('Error processing NFL data: ' + nflError.message, { error: true });
                }
            }
            
            // Process MLB data
            if (selectedSports.includes('MLB')) {
                try {
                    console.log('Fetching MLB data...');
                    const mlbTeams = await fetchMLBData();
                    console.log(`Fetched ${mlbTeams.length} MLB teams`);
                    
                    if (mlbTeams.length === 0) {
                        console.error('No MLB teams returned from API');
                        figma.notify('No MLB teams found', { error: true });
                    }
                    
                    // Create or get MLB collection with team modes
                    const createdCount = await createTeamModesCollection(mlbTeams, 'MLB');
                    totalCreatedCount += createdCount;
                    console.log(`Created ${createdCount} MLB variables with team modes`);
                } catch (mlbError) {
                    console.error('Error processing MLB data:', mlbError);
                    figma.notify('Error processing MLB data: ' + mlbError.message, { error: true });
                }
            }
            
            // Process NHL data
            if (selectedSports.includes('NHL')) {
                try {
                    console.log('Fetching NHL data...');
                    const nhlTeams = await fetchNHLData();
                    console.log(`Fetched ${nhlTeams.length} NHL teams`);
                    
                    if (nhlTeams.length === 0) {
                        console.error('No NHL teams returned from API');
                        figma.notify('No NHL teams found', { error: true });
                    }
                    
                    // Create or get NHL collection with team modes
                    const createdCount = await createTeamModesCollection(nhlTeams, 'NHL');
                    totalCreatedCount += createdCount;
                    console.log(`Created ${createdCount} NHL variables with team modes`);
                } catch (nhlError) {
                    console.error('Error processing NHL data:', nhlError);
                    figma.notify('Error processing NHL data: ' + nhlError.message, { error: true });
                }
            }
            
            // Process WNBA data
            if (selectedSports.includes('WNBA')) {
                try {
                    console.log('Fetching WNBA data...');
                    const wnbaTeams = await fetchWNBAData();
                    console.log(`Fetched ${wnbaTeams.length} WNBA teams`);
                    
                    if (wnbaTeams.length === 0) {
                        console.error('No WNBA teams returned from API');
                        figma.notify('No WNBA teams found', { error: true });
                    }
                    
                    // Create or get WNBA collection with team modes
                    const createdCount = await createTeamModesCollection(wnbaTeams, 'WNBA');
                    totalCreatedCount += createdCount;
                    console.log(`Created ${createdCount} WNBA variables with team modes`);
                } catch (wnbaError) {
                    console.error('Error processing WNBA data:', wnbaError);
                    figma.notify('Error processing WNBA data: ' + wnbaError.message, { error: true });
                }
            }
            
            // Process NCAA Football data
            if (selectedSports.includes('NCAA Football')) {
                try {
                    console.log('Fetching NCAA Football data...');
                    const ncaaTeams = await fetchNCAAData();
                    console.log(`Fetched ${ncaaTeams.length} NCAA Football teams`);
                    
                    if (ncaaTeams.length === 0) {
                        console.error('No NCAA Football teams returned from API');
                        figma.notify('No NCAA Football teams found', { error: true });
                    }
                    
                    // Create or get NCAA Football collection with team modes
                    const createdCount = await createTeamModesCollection(ncaaTeams, 'NCAA Football');
                    totalCreatedCount += createdCount;
                    console.log(`Created ${createdCount} NCAA Football variables with team modes`);
                } catch (ncaaError) {
                    console.error('Error processing NCAA Football data:', ncaaError);
                    figma.notify('Error processing NCAA Football data: ' + ncaaError.message, { error: true });
                }
            }
            figma.notify(`Successfully created ${totalCreatedCount} new variables!`);
            
            figma.ui.postMessage({ 
                type: 'sports-data-fetched', 
                results: [{ sport: 'NBA', success: true, teamCount: allTeams.length }]
            });
        } catch (e) {
            console.error("Error in fetch-sports-data handler:", e);
            figma.notify('Error processing sports data: ' + e.message, { error: true });
            figma.ui.postMessage({ 
                type: 'sports-data-error', 
                message: 'Error processing sports data: ' + e.message
            });
        }
    } else if (msg.type === 'duplicate-collection') {
        try {
            const collectionId = msg.collectionId;
            const newName = msg.newName;
            
            // Get the collection to duplicate
            const collections = figma.variables.getLocalVariableCollections();
            const sourceCollection = collections.find(c => c.id === collectionId);
            
            if (!sourceCollection) {
                figma.notify('Collection not found', { error: true });
                return;
            }
            
            // Create new collection name
            const finalName = newName || `${sourceCollection.name} (Copy)`;
            
            // Create new collection
            const newCollection = figma.variables.createVariableCollection(finalName);
            
            // Copy all modes from source collection
            const modeMap = {};
            sourceCollection.modes.forEach(mode => {
                if (mode.name !== 'Default' && mode.name !== 'Mode 1') {
                    const newModeId = newCollection.addMode(mode.name);
                    modeMap[mode.modeId] = newModeId;
                }
            });
            
            // Remove the default empty mode if it exists and we have team modes
            if (newCollection.modes.length > 1) {
                try {
                    const defaultMode = newCollection.modes.find(mode => mode.name === 'Mode 1' || mode.name === 'Default');
                    if (defaultMode) {
                        newCollection.removeMode(defaultMode.modeId);
                        console.log('Removed default empty mode from duplicated collection');
                    }
                } catch (removeError) {
                    console.log('Could not remove default mode from duplicated collection:', removeError);
                }
            }
            
            // Copy all variables from source collection
            const sourceVariables = figma.variables.getLocalVariables().filter(v => v.variableCollectionId === sourceCollection.id);
            
            sourceVariables.forEach(sourceVar => {
                // Create new variable
                const newVar = figma.variables.createVariable(sourceVar.name, newCollection.id, sourceVar.resolvedType);
                
                // Copy values for each mode
                sourceCollection.modes.forEach(mode => {
                    if (modeMap[mode.modeId]) {
                        try {
                            const value = sourceVar.valuesByMode[mode.modeId];
                            if (value !== undefined) {
                                newVar.setValueForMode(modeMap[mode.modeId], value);
                            }
                        } catch (error) {
                            console.log(`Error copying value for ${sourceVar.name} in mode ${mode.name}:`, error);
                        }
                    }
                });
            });
            
            figma.notify(`Successfully duplicated collection "${sourceCollection.name}" as "${finalName}"`);
            
            // Refresh collections list
            figma.ui.postMessage({
                type: 'refresh-collections'
            });
            
        } catch (error) {
            console.error('Error duplicating collection:', error);
            figma.notify('Error duplicating collection: ' + error.message, { error: true });
        }
    } else if (msg.type === 'import-csv') {
        console.log('🚀 Received CSV import request');
        console.log('📊 CSV data length:', msg.csvText ? msg.csvText.length : 'undefined');
        console.log('📝 Collection name:', msg.collectionName);
        
        const result = await importCSVData(msg.csvText, msg.collectionName || 'CSV Import');
        
        console.log('📋 Import result:', result);
        
        // Send result back to UI
        figma.ui.postMessage({
            type: 'csv-import-result',
            success: result.success,
            rowCount: result.rowCount,
            variableCount: result.variableCount,
            error: result.error
        });
    } else if (msg.type === 'open-spreadsheet-ui') {
        // Switch to CSV filter mode
        figma.ui.postMessage({
            type: 'switch-to-filter-mode'
        });
    } else if (msg.type === 'health-check') {
        // Phase 1: Health check endpoint (non-breaking)
        try {
            if (typeof HealthMonitor !== 'undefined' && HealthMonitor) {
                const health = await HealthMonitor.checkExistingFeatures();
                figma.ui.postMessage({
                    type: 'health-check-result',
                    health
                });
            } else {
                // Fallback health check
                const health = {
                    healthy: true,
                    results: {
                        plugin: { healthy: true, message: 'Plugin is running' },
                        figma: { healthy: true, message: 'Figma API accessible' },
                        timestamp: new Date().toISOString()
                    }
                };
                
                figma.ui.postMessage({
                    type: 'health-check-result',
                    health
                });
            }
        } catch (error) {
            figma.ui.postMessage({
                type: 'health-check-result',
                health: { healthy: false, error: error.message }
            });
        }
    } else if (msg.type === 'google-auth-start') {
        // Phase 3: Google authentication
        try {
            // Check if real-time sync is enabled
            if (typeof CONFIG !== 'undefined' && CONFIG.features && CONFIG.features.realTimeSync) {
                // Initialize Google OAuth if not already done
                if (typeof GoogleOAuth !== 'undefined') {
                    const oauth = new GoogleOAuth();
                    
                    // Check if already authenticated
                    if (oauth.isUserAuthenticated()) {
                        figma.ui.postMessage({
                            type: 'google-auth-result',
                            success: true,
                            message: 'Already authenticated with Google',
                            sheets: await this.getUserSpreadsheets(oauth)
                        });
                    } else {
                        // Start OAuth flow
                        const result = await oauth.startAuthFlow();
                        
                        if (result.success) {
                            figma.ui.postMessage({
                                type: 'google-auth-result',
                                success: true,
                                message: 'Successfully authenticated with Google',
                                sheets: await this.getUserSpreadsheets(oauth)
                            });
                        } else {
                            figma.ui.postMessage({
                                type: 'google-auth-result',
                                success: false,
                                error: result.error || 'Authentication failed'
                            });
                        }
                    }
                } else {
                    figma.ui.postMessage({
                        type: 'google-auth-result',
                        success: false,
                        error: 'Google OAuth not available. Please check configuration.'
                    });
                }
            } else {
                figma.ui.postMessage({
                    type: 'google-auth-result',
                    success: false,
                    error: 'Real-time sync feature is not enabled in this version.'
                });
            }
        } catch (error) {
            figma.ui.postMessage({
                type: 'google-auth-result',
                success: false,
                error: error.message
            });
        }
    } else if (msg.type === 'start-realtime-sync') {
        // Phase 3: Start real-time sync
        try {
            // Check if real-time sync is enabled
            if (typeof CONFIG !== 'undefined' && CONFIG.features && CONFIG.features.realTimeSync) {
                // Initialize sync manager if not already done
                if (typeof SyncManager !== 'undefined' && typeof GoogleOAuth !== 'undefined') {
                    const oauth = new GoogleOAuth();
                    const sheetsAPI = new GoogleSheetsAPI(oauth);
                    const websocketClient = new WebSocketClient();
                    const dataMapper = new DataMapper();
                    const syncManager = new SyncManager();
                    
                    // Initialize sync manager
                    await syncManager.initialize(oauth, sheetsAPI, websocketClient, dataMapper);
                    
                    // Start sync
                    const result = await syncManager.startSync(msg.sheetId, msg.collectionId, msg.config);
                    
                    figma.ui.postMessage({
                        type: 'realtime-sync-result',
                        success: result.success,
                        message: result.message,
                        error: result.error,
                        connected: websocketClient.isConnected,
                        variablesUpdated: result.variablesUpdated,
                        lastSync: result.lastSync
                    });
                } else {
                    figma.ui.postMessage({
                        type: 'realtime-sync-result',
                        success: false,
                        error: 'Sync components not available. Please check configuration.',
                        connected: false
                    });
                }
            } else {
                figma.ui.postMessage({
                    type: 'realtime-sync-result',
                    success: false,
                    error: 'Real-time sync feature is not enabled in this version.',
                    connected: false
                });
            }
        } catch (error) {
            figma.ui.postMessage({
                type: 'realtime-sync-result',
                success: false,
                error: error.message,
                connected: false
            });
        }
    } else if (msg.type === 'stop-realtime-sync') {
        // Phase 2: Stop real-time sync (disabled by default)
        try {
            figma.ui.postMessage({
                type: 'realtime-sync-result',
                success: true,
                message: 'Sync stopped (placeholder - feature not yet implemented)',
                connected: false
            });
        } catch (error) {
            figma.ui.postMessage({
                type: 'realtime-sync-result',
                success: false,
                error: error.message,
                connected: false
            });
        }
    } else if (msg.type === 'websocket-sync-update') {
        // Handle WebSocket sync updates - update existing variables
        try {
            console.log('🔄 WebSocket sync update received:', msg);
            console.log('🔄 Updating variables from WebSocket sync:', msg.spreadsheetId);
            
            // Get updated CSV data from WebSocket server
            const response = await fetch(`http://localhost:3001/api/spreadsheets/${msg.spreadsheetId}/sheets/Sheet1`);
            const sheetData = await response.json();
            
            if (sheetData.data && sheetData.data.length > 0) {
                // Find the collection by name
                const collections = figma.variables.getLocalVariableCollections();
                const collection = collections.find(c => c.name === msg.collectionId);
                
                if (collection) {
                    // Get all variables in this collection
                    const variables = figma.variables.getLocalVariables().filter(v => v.variableCollectionId === collection.id);
                    
                    // Update existing variables with new values
                    let updatedCount = 0;
                    sheetData.data.forEach((row, rowIndex) => {
                        const variableName = row[0];
                        if (variableName) {
                            const variable = variables.find(v => v.name === variableName);
                            if (variable) {
                                // Update values for each mode
                                collection.modes.forEach((mode, modeIndex) => {
                                    if (modeIndex < sheetData.headers.length - 1) { // -1 because first column is variable name
                                        const value = row[modeIndex + 1];
                                        if (value) {
                                            try {
                                                // Convert value based on variable type
                                                let convertedValue = value;
                                                
                                                if (variable.resolvedType === 'COLOR' && value.startsWith('#')) {
                                                    // Convert hex to RGB for color variables
                                                    convertedValue = hexToRgb(value);
                                                } else if (variable.resolvedType === 'FLOAT' || variable.resolvedType === 'BOOLEAN') {
                                                    // Convert to appropriate type for numeric/boolean variables
                                                    if (variable.resolvedType === 'FLOAT') {
                                                        convertedValue = parseFloat(value) || 0;
                                                    } else if (variable.resolvedType === 'BOOLEAN') {
                                                        convertedValue = value.toLowerCase() === 'true' || value === '1';
                                                    }
                                                }
                                                // For STRING variables, use value as-is
                                                
                                                variable.setValueForMode(mode.modeId, convertedValue);
                                                updatedCount++;
                                                console.log(`✅ Updated ${variableName} (${variable.resolvedType}) = ${convertedValue}`);
                                            } catch (error) {
                                                console.log(`❌ Failed to update ${variableName}: ${error.message}`);
                                            }
                                        }
                                    }
                                });
                            }
                        }
                    });
                    
                    console.log(`✅ Updated ${updatedCount} variable values from WebSocket sync`);
                    
                    // Send success message back to UI
                    figma.ui.postMessage({
                        type: 'websocket-sync-update-result',
                        success: true,
                        updatedCount: updatedCount
                    });
                    
                    figma.notify(`✅ Updated ${updatedCount} variable values`);
                } else {
                    console.log('❌ Collection not found:', msg.collectionId);
                    figma.ui.postMessage({
                        type: 'websocket-sync-update-result',
                        success: false,
                        error: 'Collection not found'
                    });
                }
            } else {
                console.log('❌ No data found for spreadsheet:', msg.spreadsheetId);
                figma.ui.postMessage({
                    type: 'websocket-sync-update-result',
                    success: false,
                    error: 'No data found in spreadsheet'
                });
            }
        } catch (error) {
            console.error('❌ WebSocket sync update failed:', error);
            figma.ui.postMessage({
                type: 'websocket-sync-update-result',
                success: false,
                error: error.message
            });
            figma.notify('❌ WebSocket sync update failed: ' + error.message);
        }
    } else if (msg.type === 'websocket-sync-start') {
        // Handle WebSocket sync start - create variables from CSV data
        try {
            console.log('🚀 WebSocket sync start received:', msg);
            console.log('🚀 Starting WebSocket sync with CSV data:', msg.spreadsheetId);
            
            // Get CSV data from WebSocket server
            const response = await fetch(`http://localhost:3001/api/spreadsheets/${msg.spreadsheetId}/sheets/Sheet1`);
            const sheetData = await response.json();
            
            if (sheetData.data && sheetData.data.length > 0) {
                // Convert sheet data to CSV format for importCSVData function
                const csvLines = [sheetData.headers.join(',')];
                sheetData.data.forEach(row => {
                    csvLines.push(row.map(cell => `"${cell}"`).join(','));
                });
                const csvText = csvLines.join('\n');
                
                // Create variables using existing importCSVData function
                const collectionName = msg.collectionId || 'WebSocket Sync';
                const result = await importCSVData(csvText, collectionName);
                
                console.log('✅ WebSocket sync variables created:', result);
                
                // Send success message back to UI
                figma.ui.postMessage({
                    type: 'websocket-sync-result',
                    success: true,
                    rowCount: result.rowCount,
                    variableCount: result.variableCount
                });
                
                figma.notify(`✅ Created ${result.variableCount} variables from WebSocket sync`);
            } else {
                console.log('❌ No data found for spreadsheet:', msg.spreadsheetId);
                figma.ui.postMessage({
                    type: 'websocket-sync-result',
                    success: false,
                    error: 'No data found in spreadsheet'
                });
            }
        } catch (error) {
            console.error('❌ WebSocket sync failed:', error);
            figma.ui.postMessage({
                type: 'websocket-sync-result',
                success: false,
                error: error.message
            });
            figma.notify('❌ WebSocket sync failed: ' + error.message);
        }
    } else if (msg.type === 'cancel') {
        figma.closePlugin();
    }
};
