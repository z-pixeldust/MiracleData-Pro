// Health monitoring system for tracking plugin functionality
import { Logger } from '../shared/logger.js';
import { CONFIG } from '../shared/config.js';

export class HealthMonitor {
  static async checkExistingFeatures() {
    Logger.info('Starting health check for existing features');
    
    const results = {
      sportsApi: await this.checkSportsAPI(),
      csvImport: await this.checkCSVImport(),
      variableManagement: await this.checkVariableManagement(),
      ui: await this.checkUI(),
      timestamp: new Date().toISOString()
    };
    
    const healthy = Object.values(results).every(check => 
      check && typeof check === 'object' && check.healthy !== false
    );
    
    Logger.info('Health check completed', { 
      healthy, 
      results: Object.keys(results).length 
    });
    
    return { healthy, results };
  }
  
  static async checkSportsAPI() {
    try {
      Logger.debug('Checking sports API health');
      
      // Test NBA API endpoint (most reliable)
      const response = await fetch(CONFIG.sports.apiEndpoints.nba, {
        method: 'GET',
        timeout: CONFIG.sports.timeout || 10000
      });
      
      const isHealthy = response.ok;
      const status = response.status;
      
      if (isHealthy) {
        const data = await response.json();
        const teamCount = data?.sports?.[0]?.leagues?.[0]?.teams?.length || 0;
        
        Logger.debug('Sports API health check passed', { status, teamCount });
        
        return { 
          healthy: true, 
          status,
          teamCount,
          feature: 'sports-api'
        };
      } else {
        Logger.warn('Sports API health check failed', { status });
        return { 
          healthy: false, 
          status,
          error: `HTTP ${status}`,
          feature: 'sports-api'
        };
      }
    } catch (error) {
      Logger.error('Sports API health check error', { error: error.message });
      return { 
        healthy: false, 
        error: error.message,
        feature: 'sports-api'
      };
    }
  }
  
  static async checkCSVImport() {
    try {
      Logger.debug('Checking CSV import health');
      
      // Test CSV parsing functionality
      const testCSV = 'Name,Value\nTest Team,Test Value\nAnother Team,Another Value';
      
      // Use the existing importCSVData function if available
      if (typeof importCSVData === 'function') {
        const result = importCSVData(testCSV, 'Health Check Test');
        
        Logger.debug('CSV import health check passed', { 
          success: result.success,
          rowCount: result.rowCount 
        });
        
        return { 
          healthy: result.success,
          rowCount: result.rowCount,
          feature: 'csv-import'
        };
      } else {
        Logger.warn('CSV import function not available');
        return { 
          healthy: false, 
          error: 'CSV import function not available',
          feature: 'csv-import'
        };
      }
    } catch (error) {
      Logger.error('CSV import health check error', { error: error.message });
      return { 
        healthy: false, 
        error: error.message,
        feature: 'csv-import'
      };
    }
  }
  
  static async checkVariableManagement() {
    try {
      Logger.debug('Checking variable management health');
      
      // Test variable collection access
      const collections = await figma.variables.getLocalVariableCollectionsAsync();
      
      Logger.debug('Variable management health check passed', { 
        collectionsCount: collections.length 
      });
      
      return { 
        healthy: true,
        collectionsCount: collections.length,
        feature: 'variable-management'
      };
    } catch (error) {
      Logger.error('Variable management health check error', { error: error.message });
      return { 
        healthy: false, 
        error: error.message,
        feature: 'variable-management'
      };
    }
  }
  
  static async checkUI() {
    try {
      Logger.debug('Checking UI health');
      
      // Check if UI elements are present and functional
      const tabs = document.querySelectorAll('.tab');
      const importSections = document.querySelectorAll('.import-section, .form-group');
      const buttons = document.querySelectorAll('button');
      
      const uiHealthy = tabs.length > 0 && buttons.length > 0;
      
      Logger.debug('UI health check completed', { 
        tabsCount: tabs.length,
        sectionsCount: importSections.length,
        buttonsCount: buttons.length,
        healthy: uiHealthy
      });
      
      return { 
        healthy: uiHealthy,
        tabsCount: tabs.length,
        sectionsCount: importSections.length,
        buttonsCount: buttons.length,
        feature: 'ui'
      };
    } catch (error) {
      Logger.error('UI health check error', { error: error.message });
      return { 
        healthy: false, 
        error: error.message,
        feature: 'ui'
      };
    }
  }
  
  // Performance monitoring
  static async checkPerformance() {
    try {
      Logger.debug('Checking performance metrics');
      
      const metrics = {
        memoryUsage: this.getMemoryUsage(),
        loadTime: this.getLoadTime(),
        domReady: this.getDOMReadyTime()
      };
      
      Logger.debug('Performance check completed', metrics);
      
      return {
        healthy: true,
        metrics,
        feature: 'performance'
      };
    } catch (error) {
      Logger.error('Performance check error', { error: error.message });
      return {
        healthy: false,
        error: error.message,
        feature: 'performance'
      };
    }
  }
  
  static getMemoryUsage() {
    if (performance.memory) {
      return {
        used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024),
        total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024),
        limit: Math.round(performance.memory.jsHeapSizeLimit / 1024 / 1024)
      };
    }
    return null;
  }
  
  static getLoadTime() {
    if (performance.timing) {
      const timing = performance.timing;
      return timing.loadEventEnd - timing.navigationStart;
    }
    return null;
  }
  
  static getDOMReadyTime() {
    if (performance.timing) {
      const timing = performance.timing;
      return timing.domContentLoadedEventEnd - timing.navigationStart;
    }
    return null;
  }
  
  // Continuous health monitoring
  static startMonitoring(intervalMs = 60000) { // 1 minute default
    if (this.monitoringInterval) {
      Logger.warn('Health monitoring already started');
      return;
    }
    
    Logger.info(`Starting continuous health monitoring (interval: ${intervalMs}ms)`);
    
    this.monitoringInterval = setInterval(async () => {
      try {
        const health = await this.checkExistingFeatures();
        
        if (!health.healthy) {
          Logger.warn('Health check failed', health.results);
          
          // Could trigger alerts or notifications here
          if (CONFIG.features.healthMonitoring) {
            this.handleHealthFailure(health.results);
          }
        }
      } catch (error) {
        Logger.error('Health monitoring error', { error: error.message });
      }
    }, intervalMs);
  }
  
  static stopMonitoring() {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
      Logger.info('Health monitoring stopped');
    }
  }
  
  static handleHealthFailure(results) {
    Logger.error('Health failure detected', results);
    
    // Log which features are failing
    const failedFeatures = Object.entries(results)
      .filter(([name, result]) => name !== 'timestamp' && !result.healthy)
      .map(([name]) => name);
    
    if (failedFeatures.length > 0) {
      Logger.error('Failed features', { failedFeatures });
      
      // Could send to monitoring service or show user notification
      // figma.notify(`Plugin health issues detected: ${failedFeatures.join(', ')}`, { error: true });
    }
  }
}
