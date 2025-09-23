// Figma-compatible infrastructure (no ES6 modules)
// This file contains all the Phase 1 infrastructure in a single file for Figma compatibility

// Feature flags and configuration
const CONFIG = {
  features: {
    realTimeSync: false,
    googleAuth: false,
    websocketClient: false,
    advancedFiltering: true,
    healthMonitoring: true,
    performanceTracking: false
  },
  debug: false
};

// Simple logger
const Logger = {
  info: (message, data = null) => {
    const timestamp = new Date().toISOString();
    if (data) {
      console.log(`[${timestamp}] [INFO] ${message}`, data);
    } else {
      console.log(`[${timestamp}] [INFO] ${message}`);
    }
  },
  warn: (message, data = null) => {
    const timestamp = new Date().toISOString();
    if (data) {
      console.warn(`[${timestamp}] [WARN] ${message}`, data);
    } else {
      console.warn(`[${timestamp}] [WARN] ${message}`);
    }
  },
  error: (message, data = null) => {
    const timestamp = new Date().toISOString();
    if (data) {
      console.error(`[${timestamp}] [ERROR] ${message}`, data);
    } else {
      console.error(`[${timestamp}] [ERROR] ${message}`);
    }
  }
};

// Simple error handler
const ErrorHandler = {
  handle: (error, context = '') => {
    const errorMessage = error.message || 'Unknown error occurred';
    const contextPrefix = context ? `[${context}] ` : '';
    console.error(`${contextPrefix}Error:`, error);
    figma.notify(`${contextPrefix}Error: ${errorMessage}`, { error: true });
  }
};

// Simple service registry
const ServiceRegistry = class {
  constructor() {
    this.services = new Map();
    this.fallbacks = new Map();
  }
  
  register(name, service, fallback = null) {
    this.services.set(name, service);
    if (fallback) {
      this.fallbacks.set(name, fallback);
    }
    Logger.info(`Registered service: ${name}`);
  }
  
  get(name) {
    const service = this.services.get(name);
    if (!service && this.fallbacks.has(name)) {
      Logger.warn(`Service ${name} not available, using fallback`);
      return this.fallbacks.get(name);
    }
    if (!service) {
      Logger.error(`Service ${name} not found`);
      return null;
    }
    return service;
  }
  
  listServices() {
    return Array.from(this.services.keys());
  }
};

// Global service registry instance
const services = new ServiceRegistry();

// Simple health monitor
const HealthMonitor = {
  async checkExistingFeatures() {
    Logger.info('Starting health check for existing features');
    
    const results = {
      plugin: await this.checkPluginHealth(),
      figma: await this.checkFigmaAPI(),
      timestamp: new Date().toISOString()
    };
    
    const healthy = Object.values(results).every(check => 
      check && typeof check === 'object' && check.healthy !== false
    );
    
    Logger.info('Health check completed', { healthy });
    
    return { healthy, results };
  },
  
  async checkPluginHealth() {
    try {
      return { healthy: true, message: 'Plugin is running' };
    } catch (error) {
      return { healthy: false, error: error.message };
    }
  },
  
  async checkFigmaAPI() {
    try {
      const collections = await figma.variables.getLocalVariableCollectionsAsync();
      return { 
        healthy: true, 
        collectionsCount: collections.length,
        message: 'Figma API accessible'
      };
    } catch (error) {
      return { healthy: false, error: error.message };
    }
  }
};

// Initialize Phase 1 infrastructure
function initializePhase1Infrastructure() {
  try {
    Logger.info('Initializing Phase 1 infrastructure');
    
    // Register existing services
    services.register('variableManager', {
      createVariable: figma.variables.createVariable,
      createCollection: figma.variables.createVariableCollection,
      getCollections: figma.variables.getLocalVariableCollectionsAsync
    });
    
    services.register('csvImporter', {
      importData: typeof importCSVData === 'function' ? importCSVData : null
    });
    
    services.register('sportsApi', {
      fetchNBA: typeof fetchNBAData === 'function' ? fetchNBAData : null,
      fetchNFL: typeof fetchNFLData === 'function' ? fetchNFLData : null,
      fetchMLB: typeof fetchMLBData === 'function' ? fetchMLBData : null,
      fetchNHL: typeof fetchNHLData === 'function' ? fetchNHLData : null,
      fetchWNBA: typeof fetchWNBAData === 'function' ? fetchWNBAData : null,
      fetchNCAA: typeof fetchNCAAData === 'function' ? fetchNCAAData : null
    });
    
    Logger.info('Phase 1 infrastructure initialized successfully');
    
    // Make infrastructure available globally for testing
    window.CONFIG = CONFIG;
    window.Logger = Logger;
    window.services = services;
    window.HealthMonitor = HealthMonitor;
    
    return true;
  } catch (error) {
    Logger.error('Failed to initialize Phase 1 infrastructure', { error: error.message });
    return false;
  }
}

// Auto-initialize when this script loads
if (typeof window !== 'undefined') {
  initializePhase1Infrastructure();
}
