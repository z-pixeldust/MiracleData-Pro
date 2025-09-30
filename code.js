// This plugin creates local variable collections from sports data fetched from ESPN API

// All data will be fetched live from APIs.

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

// Process spreadsheet data into team objects
function processSpreadsheetData(data, columnMapping, ignoredColumns, ignoredRows) {
    const { headers, rows } = data;
    const processedData = [];
    
    // Filter out ignored columns
    const activeHeaders = headers.filter((_, index) => !ignoredColumns.has(index));
    const activeColumnMapping = {};
    
    // Update column mapping to only include active columns
    Object.keys(columnMapping).forEach(header => {
        const originalIndex = headers.indexOf(header);
        if (originalIndex !== -1 && !ignoredColumns.has(originalIndex)) {
            activeColumnMapping[header] = columnMapping[header];
        }
    });
    
    // Process each row
    rows.forEach((row, rowIndex) => {
        if (ignoredRows.has(rowIndex)) return;
        
        const team = {};
        let hasValidData = false;
        
        // Map each column to team properties
        Object.keys(activeColumnMapping).forEach(header => {
            const originalIndex = headers.indexOf(header);
            if (originalIndex !== -1 && row[originalIndex]) {
                const value = row[originalIndex].trim();
                if (value) {
                    const figmaField = activeColumnMapping[header];
                    team[figmaField] = value;
                    hasValidData = true;
                }
            }
        });
        
        // Only add if we have valid data
        if (hasValidData) {
            // Set default values for missing fields
            if (!team['Full Team Name']) team['Full Team Name'] = 'Unknown Team';
            if (!team['Logo']) team['Logo'] = team['Full Team Name'];
            if (!team['City']) team['City'] = 'Unknown';
            if (!team['Short Name']) team['Short Name'] = team['Full Team Name'];
            if (!team['TriCode']) team['TriCode'] = 'UNK';
            
            // Process colors
            if (team['Primary Color']) {
                team['Primary Color'] = parseColor(team['Primary Color']);
            } else {
                team['Primary Color'] = { r: 0.5, g: 0.5, b: 0.5 };
            }
            
            if (team['Secondary Color']) {
                team['Secondary Color'] = parseColor(team['Secondary Color']);
            } else {
                team['Secondary Color'] = { r: 0.8, g: 0.8, b: 0.8 };
            }
            
            processedData.push(team);
        }
    });
    
    return processedData;
}

// Parse color string to RGB object
function parseColor(colorStr) {
    if (!colorStr) return { r: 0.5, g: 0.5, b: 0.5 };
    
    // Handle hex colors
    if (colorStr.startsWith('#')) {
        return hexToRgb(colorStr);
    }
    
    // Handle rgb() format
    const rgbMatch = colorStr.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (rgbMatch) {
        return {
            r: parseInt(rgbMatch[1]) / 255,
            g: parseInt(rgbMatch[2]) / 255,
            b: parseInt(rgbMatch[3]) / 255
        };
    }
    
    // Handle named colors (basic set)
    const namedColors = {
        'red': { r: 1, g: 0, b: 0 },
        'green': { r: 0, g: 1, b: 0 },
        'blue': { r: 0, g: 0, b: 1 },
        'white': { r: 1, g: 1, b: 1 },
        'black': { r: 0, g: 0, b: 0 },
        'yellow': { r: 1, g: 1, b: 0 },
        'orange': { r: 1, g: 0.5, b: 0 },
        'purple': { r: 0.5, g: 0, b: 0.5 }
    };
    
    const lowerColor = colorStr.toLowerCase();
    if (namedColors[lowerColor]) {
        return namedColors[lowerColor];
    }
    
    // Default fallback
    return { r: 0.5, g: 0.5, b: 0.5 };
}

// Create collection from spreadsheet data
async function createSpreadsheetCollection(teams, collectionName, options = {}) {
    const { sourceUrl } = options;
    let createdCount = 0;
    
    // Create or get collection
    let collection;
    const existingCollections = figma.variables.getLocalVariableCollections();
    const existingCollection = existingCollections.find(c => c.name === collectionName);
    
    if (existingCollection) {
        collection = existingCollection;
        console.log(`Using existing ${collectionName} collection`);
    } else {
        collection = figma.variables.createVariableCollection(collectionName);
        console.log(`Created new ${collectionName} collection`);
    }
    
    // Create team modes
    const teamModeIds = {};
    teams.forEach(team => {
        try {
            const modeName = team['Full Team Name'] || `Team ${createdCount + 1}`;
            const existingMode = collection.modes.find(mode => mode.name === modeName);
            let modeId = existingMode ? existingMode.modeId : null;
            
            if (!modeId) {
                modeId = collection.addMode(modeName);
                console.log(`Created mode for ${modeName}`);
            }
            
            teamModeIds[modeName] = modeId;
        } catch (modeError) {
            console.log(`Error creating mode for team:`, modeError);
        }
    });
    
    // Remove default empty mode if it exists
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

    // Ensure a dedicated metadata mode exists
    let metadataModeId = null;
    try {
        const existingMetadataMode = collection.modes.find(mode => mode.name === 'Metadata');
        metadataModeId = existingMetadataMode ? existingMetadataMode.modeId : collection.addMode('Metadata');
        if (!existingMetadataMode) {
            console.log('Created Metadata mode');
        }
    } catch (metaModeErr) {
        console.log('Error ensuring Metadata mode:', metaModeErr);
    }
    
    // Create variables for each field
    const fieldNames = [
        'Full Team Name',
        'Logo',
        'City',
        'Short Name',
        'TriCode',
        'Primary Color',
        'Secondary Color',
        'Rank'
    ];
    
    const fieldTypes = ['STRING', 'STRING', 'STRING', 'STRING', 'STRING', 'COLOR', 'COLOR', 'STRING'];
    
    // Check existing variables
    const existingVariables = figma.variables.getLocalVariables().filter(v => v.variableCollectionId === collection.id);
    const existingVariableNames = existingVariables.map(v => v.name);
    
    for (let i = 0; i < fieldNames.length; i++) {
        if (!existingVariableNames.includes(fieldNames[i])) {
            try {
                const var_ = figma.variables.createVariable(fieldNames[i], collection.id, fieldTypes[i]);
                
                // Set values for each team mode
                teams.forEach(team => {
                    try {
                        const modeName = team['Full Team Name'] || `Team ${teams.indexOf(team) + 1}`;
                        const modeId = teamModeIds[modeName];
                        if (modeId) {
                            const value = team[fieldNames[i]];
                            if (value !== undefined) {
                                console.log(`Setting ${fieldNames[i]} for ${modeName} to:`, value);
                                var_.setValueForMode(modeId, value);
                            }
                        }
                    } catch (valueError) {
                        console.log(`Error setting value for team:`, valueError);
                    }
                });
                
                createdCount++;
            } catch (error) {
                console.log(`Variable ${fieldNames[i]} already exists or error creating:`, error);
            }
        } else {
            console.log(`Variable ${fieldNames[i]} already exists, skipping`);
        }
    }

    // Store source URL in collection-level metadata variable
    if (sourceUrl && metadataModeId) {
        try {
            const existingVars = figma.variables.getLocalVariables().filter(v => v.variableCollectionId === collection.id);
            let sourceVar = existingVars.find(v => v.name === 'Source Spreadsheet URL');
            if (!sourceVar) {
                sourceVar = figma.variables.createVariable('Source Spreadsheet URL', collection.id, 'STRING');
                console.log('Created Source Spreadsheet URL variable');
            }
            sourceVar.setValueForMode(metadataModeId, sourceUrl);

            // Optional last sync timestamp
            let lastSyncVar = existingVars.find(v => v.name === 'Last Synced');
            if (!lastSyncVar) {
                lastSyncVar = figma.variables.createVariable('Last Synced', collection.id, 'STRING');
                console.log('Created Last Synced variable');
            }
            lastSyncVar.setValueForMode(metadataModeId, new Date().toISOString());
        } catch (metaErr) {
            console.log('Error setting collection metadata variables:', metaErr);
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
    } else if (msg.type === 'import-spreadsheet') {
        try {
            const { collectionName, data, columnMapping, ignoredColumns, ignoredRows, sourceUrl } = msg;
            
            console.log('Importing spreadsheet:', { collectionName, data, columnMapping });
            
            // Process the spreadsheet data
            const processedData = processSpreadsheetData(data, columnMapping, ignoredColumns, ignoredRows);
            
            if (processedData.length === 0) {
                figma.notify('No valid data found to import', { error: true });
                return;
            }
            
            // Create collection with team modes
            const createdCount = await createSpreadsheetCollection(processedData, collectionName, { sourceUrl });
            
            figma.notify(`Successfully imported ${createdCount} variables from spreadsheet!`);
            
            figma.ui.postMessage({
                type: 'spreadsheet-import-success',
                created: createdCount
            });
            
        } catch (error) {
            console.error('Error importing spreadsheet:', error);
            figma.notify('Error importing spreadsheet: ' + error.message, { error: true });
            figma.ui.postMessage({
                type: 'spreadsheet-import-error',
                message: error.message
            });
        }
    } else if (msg.type === 'save-collection-source') {
        try {
            const { collectionName, source, mapping } = msg;
            const key = 'collectionSources';
            const existing = await figma.clientStorage.getAsync(key) || {};
            existing[collectionName] = { source, mapping: mapping || {} };
            await figma.clientStorage.setAsync(key, existing);
            figma.ui.postMessage({ type: 'collection-source-saved', collectionName });
        } catch (err) {
            console.error('Error saving collection source:', err);
            figma.ui.postMessage({ type: 'collection-source-error', message: err.message });
        }
    } else if (msg.type === 'get-collection-source') {
        try {
            const { collectionName } = msg;
            const key = 'collectionSources';
            const existing = await figma.clientStorage.getAsync(key) || {};
            let source = null;
            let mapping = {};
            const entry = existing[collectionName];
            if (typeof entry === 'string') {
                source = entry;
            } else if (entry && typeof entry === 'object') {
                source = entry.source || null;
                mapping = entry.mapping || {};
            }
            figma.ui.postMessage({ type: 'collection-source', collectionName, source, mapping });
        } catch (err) {
            console.error('Error getting collection source:', err);
            figma.ui.postMessage({ type: 'collection-source-error', message: err.message });
        }
    } else if (msg.type === 'cancel') {
        figma.closePlugin();
    }
};
