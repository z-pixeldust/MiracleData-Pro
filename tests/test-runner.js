// Test runner for regression testing and validation
import { Logger } from '../shared/logger.js';
import { HealthMonitor } from '../monitoring/health-check.js';
import { CONFIG } from '../shared/config.js';

export class TestRunner {
  constructor() {
    this.testResults = [];
    this.startTime = null;
  }
  
  // Run all backward compatibility tests
  static async runBackwardCompatibilityTests() {
    Logger.info('Running backward compatibility tests...');
    
    const runner = new TestRunner();
    const results = {
      healthCheck: await runner.runHealthCheckTests(),
      performance: await runner.runPerformanceTests(),
      functionality: await runner.runFunctionalityTests(),
      timestamp: new Date().toISOString(),
      duration: 0
    };
    
    const allPassed = Object.values(results).every(result => 
      result && typeof result === 'object' && result.success !== false
    );
    
    Logger.info('Backward compatibility test results:', results);
    
    if (allPassed) {
      Logger.info('✅ All backward compatibility tests passed');
    } else {
      Logger.error('❌ Some backward compatibility tests failed');
    }
    
    return {
      success: allPassed,
      results,
      summary: {
        total: Object.keys(results).length,
        passed: Object.values(results).filter(r => r.success).length,
        failed: Object.values(results).filter(r => !r.success).length
      }
    };
  }
  
  async runHealthCheckTests() {
    try {
      Logger.debug('Running health check tests');
      const health = await HealthMonitor.checkExistingFeatures();
      
      return {
        success: health.healthy,
        results: health.results,
        testType: 'health-check'
      };
    } catch (error) {
      Logger.error('Health check test failed', { error: error.message });
      return {
        success: false,
        error: error.message,
        testType: 'health-check'
      };
    }
  }
  
  async runPerformanceTests() {
    try {
      Logger.debug('Running performance tests');
      
      const tests = [
        { name: 'Sports API Response Time', fn: () => this.testSportsAPIPerformance() },
        { name: 'CSV Import Performance', fn: () => this.testCSVImportPerformance() },
        { name: 'Variable Creation Performance', fn: () => this.testVariableCreationPerformance() }
      ];
      
      const results = {};
      
      for (const test of tests) {
        const start = performance.now();
        try {
          await test.fn();
          const duration = performance.now() - start;
          results[test.name] = { 
            success: true, 
            duration: Math.round(duration),
            threshold: this.getPerformanceThreshold(test.name)
          };
          
          // Check if performance is within acceptable limits
          if (duration > this.getPerformanceThreshold(test.name)) {
            Logger.warn(`Performance test warning: ${test.name} took ${Math.round(duration)}ms (threshold: ${this.getPerformanceThreshold(test.name)}ms)`);
          }
        } catch (error) {
          const duration = performance.now() - start;
          results[test.name] = { 
            success: false, 
            duration: Math.round(duration),
            error: error.message 
          };
        }
      }
      
      const allPassed = Object.values(results).every(r => r.success);
      
      return {
        success: allPassed,
        results,
        testType: 'performance'
      };
    } catch (error) {
      Logger.error('Performance test failed', { error: error.message });
      return {
        success: false,
        error: error.message,
        testType: 'performance'
      };
    }
  }
  
  async runFunctionalityTests() {
    try {
      Logger.debug('Running functionality tests');
      
      const tests = [
        { name: 'Sports Data Import', fn: () => this.testSportsDataImport() },
        { name: 'CSV Data Import', fn: () => this.testCSVDataImport() },
        { name: 'Variable Management', fn: () => this.testVariableManagement() }
      ];
      
      const results = {};
      
      for (const test of tests) {
        try {
          const result = await test.fn();
          results[test.name] = { 
            success: result.success,
            data: result.data
          };
        } catch (error) {
          results[test.name] = { 
            success: false, 
            error: error.message 
          };
        }
      }
      
      const allPassed = Object.values(results).every(r => r.success);
      
      return {
        success: allPassed,
        results,
        testType: 'functionality'
      };
    } catch (error) {
      Logger.error('Functionality test failed', { error: error.message });
      return {
        success: false,
        error: error.message,
        testType: 'functionality'
      };
    }
  }
  
  // Individual test methods
  async testSportsAPIPerformance() {
    const response = await fetch(CONFIG.sports.apiEndpoints.nba);
    if (!response.ok) {
      throw new Error(`Sports API returned ${response.status}`);
    }
    const data = await response.json();
    if (!data.sports || !data.sports[0] || !data.sports[0].leagues || !data.sports[0].leagues[0] || !data.sports[0].leagues[0].teams) {
      throw new Error('Sports API returned unexpected data structure');
    }
    return data;
  }
  
  async testCSVImportPerformance() {
    const csvData = 'Team Name,City,Logo\nLakers,Los Angeles,LA\nWarriors,San Francisco,SF';
    const result = importCSVData(csvData, 'Performance Test');
    if (!result.success) {
      throw new Error('CSV import failed');
    }
    return result;
  }
  
  async testVariableCreationPerformance() {
    const collection = figma.variables.createVariableCollection('Performance Test Collection');
    const variable = figma.variables.createVariable('Performance Test Variable', collection.id, 'STRING');
    
    if (!variable) {
      throw new Error('Variable creation failed');
    }
    
    return { collection, variable };
  }
  
  async testSportsDataImport() {
    // Test if existing sports data import functions work
    if (typeof fetchNBAData === 'function') {
      const nbaData = await fetchNBAData();
      if (!Array.isArray(nbaData) || nbaData.length === 0) {
        throw new Error('NBA data import returned invalid data');
      }
      return { success: true, data: { teamCount: nbaData.length } };
    } else {
      throw new Error('fetchNBAData function not available');
    }
  }
  
  async testCSVDataImport() {
    const csvData = 'Name,Value\nTest Team,Test Value\nAnother Team,Another Value';
    const result = importCSVData(csvData, 'Functionality Test');
    
    if (!result.success) {
      throw new Error(`CSV import failed: ${result.error}`);
    }
    
    return { success: true, data: { rowCount: result.rowCount } };
  }
  
  async testVariableManagement() {
    const collections = await figma.variables.getLocalVariableCollectionsAsync();
    
    if (!Array.isArray(collections)) {
      throw new Error('Variable collections not accessible');
    }
    
    return { success: true, data: { collectionsCount: collections.length } };
  }
  
  getPerformanceThreshold(testName) {
    const thresholds = {
      'Sports API Response Time': 5000,  // 5 seconds
      'CSV Import Performance': 2000,   // 2 seconds
      'Variable Creation Performance': 1000  // 1 second
    };
    
    return thresholds[testName] || 3000; // 3 seconds default
  }
  
  // Utility methods
  static async runQuickTest() {
    Logger.info('Running quick functionality test...');
    
    try {
      // Test basic functionality
      const collections = await figma.variables.getLocalVariableCollectionsAsync();
      const uiElements = document.querySelectorAll('.tab, button');
      
      const success = collections.length >= 0 && uiElements.length > 0;
      
      Logger.info(`Quick test ${success ? 'passed' : 'failed'}`, {
        collections: collections.length,
        uiElements: uiElements.length
      });
      
      return { success };
    } catch (error) {
      Logger.error('Quick test failed', { error: error.message });
      return { success: false, error: error.message };
    }
  }
  
  static async runFullTestSuite() {
    Logger.info('Running full test suite...');
    
    const results = await TestRunner.runBackwardCompatibilityTests();
    
    // Additional tests can be added here
    const additionalTests = {
      configuration: await TestRunner.testConfiguration(),
      services: await TestRunner.testServices()
    };
    
    return {
      ...results,
      additional: additionalTests
    };
  }
  
  static async testConfiguration() {
    try {
      Logger.debug('Testing configuration system');
      
      // Test feature flags
      const features = CONFIG.features;
      const expectedFeatures = ['realTimeSync', 'googleAuth', 'websocketClient', 'advancedFiltering'];
      
      const missingFeatures = expectedFeatures.filter(f => !(f in features));
      const hasAllFeatures = missingFeatures.length === 0;
      
      return {
        success: hasAllFeatures,
        data: {
          features: Object.keys(features),
          missingFeatures
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  static async testServices() {
    try {
      Logger.debug('Testing service registry');
      
      // Test if services are properly registered
      if (typeof services !== 'undefined') {
        const registeredServices = services.listServices();
        return {
          success: registeredServices.length > 0,
          data: { registeredServices }
        };
      } else {
        return {
          success: false,
          error: 'Service registry not available'
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
}

// Auto-run tests in debug mode
if (CONFIG.debug) {
  TestRunner.runQuickTest().then(result => {
    Logger.info('Auto-test completed', result);
  });
}
