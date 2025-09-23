// Configuration and feature flags - central configuration management
export const CONFIG = {
  // Feature flags - all start disabled for safety
  features: {
    realTimeSync: false,        // Real-time Google Sheets sync
    googleAuth: false,          // Google OAuth2 authentication
    websocketClient: false,     // WebSocket client for real-time updates
    advancedFiltering: true,    // CSV filtering (already implemented)
    healthMonitoring: true,     // Health monitoring system
    performanceTracking: false  // Performance monitoring
  },
  
  // Existing sports API configuration (copied from current code)
  sports: {
    apiEndpoints: {
      nba: 'https://site.api.espn.com/apis/site/v2/sports/basketball/nba/teams',
      nfl: 'https://site.api.espn.com/apis/site/v2/sports/football/nfl/teams',
      mlb: 'https://site.api.espn.com/apis/site/v2/sports/baseball/mlb/teams',
      nhl: 'https://site.api.espn.com/apis/site/v2/sports/hockey/nhl/teams',
      wnba: 'https://site.api.espn.com/apis/site/v2/sports/basketball/wnba/teams',
      ncaa: 'https://site.api.espn.com/apis/site/v2/sports/football/college-football/rankings'
    },
    timeout: 10000, // 10 seconds timeout for API calls
    retryAttempts: 3
  },
  
  // CSV import configuration
  csv: {
    maxFileSize: 5 * 1024 * 1024, // 5MB
    supportedTypes: ['text/csv', 'application/vnd.ms-excel'],
    previewRows: 10,
    defaultCollectionName: 'CSV Import'
  },
  
  // Real-time sync configuration (for future use)
  realTimeSync: {
    websocketUrl: null, // Will be set when feature is enabled
    reconnectInterval: 5000, // 5 seconds
    maxReconnectAttempts: 10,
    heartbeatInterval: 30000, // 30 seconds
    syncInterval: 2000 // 2 seconds for polling fallback
  },
  
  // Google Sheets configuration (for future use)
  googleSheets: {
    clientId: null, // Will be set when feature is enabled
    redirectUri: null,
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    apiKey: null
  },
  
  // Debug and development settings
  debug: false,
  verbose: false,
  
  // Performance monitoring
  monitoring: {
    enabled: false,
    endpoint: null,
    sampleRate: 0.1, // 10% of operations
    maxEventsPerMinute: 100
  },
  
  // Error handling
  errorHandling: {
    maxRetries: 3,
    retryDelay: 1000, // 1 second
    showUserNotifications: true,
    logErrors: true
  }
};

// Utility functions for configuration
export const ConfigUtils = {
  // Check if a feature is enabled
  isFeatureEnabled(feature) {
    return CONFIG.features[feature] === true;
  },
  
  // Enable a feature (for development/testing)
  enableFeature(feature) {
    if (CONFIG.features.hasOwnProperty(feature)) {
      CONFIG.features[feature] = true;
      console.log(`Feature enabled: ${feature}`);
    } else {
      console.warn(`Unknown feature: ${feature}`);
    }
  },
  
  // Disable a feature
  disableFeature(feature) {
    if (CONFIG.features.hasOwnProperty(feature)) {
      CONFIG.features[feature] = false;
      console.log(`Feature disabled: ${feature}`);
    } else {
      console.warn(`Unknown feature: ${feature}`);
    }
  },
  
  // Get configuration value with fallback
  get(key, fallback = null) {
    const keys = key.split('.');
    let value = CONFIG;
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return fallback;
      }
    }
    
    return value;
  },
  
  // Set configuration value
  set(key, value) {
    const keys = key.split('.');
    const lastKey = keys.pop();
    let target = CONFIG;
    
    for (const k of keys) {
      if (!target[k] || typeof target[k] !== 'object') {
        target[k] = {};
      }
      target = target[k];
    }
    
    target[lastKey] = value;
  },
  
  // Reset configuration to defaults
  reset() {
    // Reset feature flags to defaults
    CONFIG.features.realTimeSync = false;
    CONFIG.features.googleAuth = false;
    CONFIG.features.websocketClient = false;
    CONFIG.features.performanceTracking = false;
    
    console.log('Configuration reset to defaults');
  }
};
