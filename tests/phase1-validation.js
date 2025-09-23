// Phase 1 validation script - ensures all infrastructure is working
import { Logger } from '../shared/logger.js';
import { CONFIG } from '../shared/config.js';
import { services } from '../shared/service-registry.js';
import { HealthMonitor } from '../monitoring/health-check.js';
import { TestRunner } from './test-runner.js';

export class Phase1Validator {
  static async validate() {
    Logger.info('Starting Phase 1 validation...');
    
    const results = {
      infrastructure: await this.validateInfrastructure(),
      backwardCompatibility: await this.validateBackwardCompatibility(),
      serviceRegistry: await this.validateServiceRegistry(),
      healthMonitoring: await this.validateHealthMonitoring(),
      featureFlags: await this.validateFeatureFlags(),
      timestamp: new Date().toISOString()
    };
    
    const allPassed = Object.values(results).every(result => 
      result && typeof result === 'object' && result.success !== false
    );
    
    Logger.info('Phase 1 validation completed', { 
      success: allPassed,
      results: Object.keys(results).length 
    });
    
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
  
  static async validateInfrastructure() {
    try {
      Logger.debug('Validating infrastructure components');
      
      // Check if all required files are accessible
      const components = [
        { name: 'Logger', check: () => typeof Logger === 'object' && Logger.info },
        { name: 'CONFIG', check: () => typeof CONFIG === 'object' && CONFIG.features },
        { name: 'services', check: () => typeof services === 'object' && services.register },
        { name: 'HealthMonitor', check: () => typeof HealthMonitor === 'object' && HealthMonitor.checkExistingFeatures },
        { name: 'TestRunner', check: () => typeof TestRunner === 'object' && TestRunner.runBackwardCompatibilityTests }
      ];
      
      const results = {};
      let allAvailable = true;
      
      for (const component of components) {
        try {
          const available = component.check();
          results[component.name] = { available, error: null };
          if (!available) allAvailable = false;
        } catch (error) {
          results[component.name] = { available: false, error: error.message };
          allAvailable = false;
        }
      }
      
      return {
        success: allAvailable,
        results,
        testType: 'infrastructure'
      };
    } catch (error) {
      Logger.error('Infrastructure validation failed', { error: error.message });
      return {
        success: false,
        error: error.message,
        testType: 'infrastructure'
      };
    }
  }
  
  static async validateBackwardCompatibility() {
    try {
      Logger.debug('Validating backward compatibility');
      
      // Run the backward compatibility tests
      const testResults = await TestRunner.runBackwardCompatibilityTests();
      
      return {
        success: testResults.success,
        results: testResults.results,
        summary: testResults.summary,
        testType: 'backward-compatibility'
      };
    } catch (error) {
      Logger.error('Backward compatibility validation failed', { error: error.message });
      return {
        success: false,
        error: error.message,
        testType: 'backward-compatibility'
      };
    }
  }
  
  static async validateServiceRegistry() {
    try {
      Logger.debug('Validating service registry');
      
      // Check if services are properly registered
      const registeredServices = services.listServices();
      const expectedServices = ['variableManager', 'csvImporter', 'sportsApi'];
      
      const missingServices = expectedServices.filter(service => 
        !registeredServices.includes(service)
      );
      
      const allServicesRegistered = missingServices.length === 0;
      
      // Test service functionality
      const serviceTests = {};
      
      for (const serviceName of expectedServices) {
        try {
          const service = services.get(serviceName);
          serviceTests[serviceName] = { 
            available: service !== null,
            hasMethods: service && typeof service === 'object'
          };
        } catch (error) {
          serviceTests[serviceName] = { 
            available: false, 
            error: error.message 
          };
        }
      }
      
      return {
        success: allServicesRegistered,
        results: {
          registeredServices,
          missingServices,
          serviceTests
        },
        testType: 'service-registry'
      };
    } catch (error) {
      Logger.error('Service registry validation failed', { error: error.message });
      return {
        success: false,
        error: error.message,
        testType: 'service-registry'
      };
    }
  }
  
  static async validateHealthMonitoring() {
    try {
      Logger.debug('Validating health monitoring');
      
      // Run health check
      const health = await HealthMonitor.checkExistingFeatures();
      
      // Check if health monitoring is working
      const healthWorking = health && typeof health === 'object' && 
                           'healthy' in health && 'results' in health;
      
      return {
        success: healthWorking && health.healthy,
        results: health.results,
        testType: 'health-monitoring'
      };
    } catch (error) {
      Logger.error('Health monitoring validation failed', { error: error.message });
      return {
        success: false,
        error: error.message,
        testType: 'health-monitoring'
      };
    }
  }
  
  static async validateFeatureFlags() {
    try {
      Logger.debug('Validating feature flags');
      
      // Check if feature flags are properly configured
      const expectedFlags = ['realTimeSync', 'googleAuth', 'websocketClient', 'advancedFiltering'];
      const actualFlags = Object.keys(CONFIG.features);
      
      const missingFlags = expectedFlags.filter(flag => !(flag in CONFIG.features));
      const allFlagsPresent = missingFlags.length === 0;
      
      // Check if new features are disabled by default (safety check)
      const newFeatures = ['realTimeSync', 'googleAuth', 'websocketClient'];
      const disabledNewFeatures = newFeatures.filter(feature => 
        CONFIG.features[feature] === false
      );
      
      const safetyCheckPassed = disabledNewFeatures.length === newFeatures.length;
      
      return {
        success: allFlagsPresent && safetyCheckPassed,
        results: {
          expectedFlags,
          actualFlags,
          missingFlags,
          disabledNewFeatures,
          safetyCheckPassed
        },
        testType: 'feature-flags'
      };
    } catch (error) {
      Logger.error('Feature flags validation failed', { error: error.message });
      return {
        success: false,
        error: error.message,
        testType: 'feature-flags'
      };
    }
  }
  
  static async runQuickValidation() {
    Logger.info('Running quick Phase 1 validation...');
    
    try {
      // Quick checks without full test suite
      const checks = [
        { name: 'Logger', test: () => typeof Logger === 'object' },
        { name: 'CONFIG', test: () => typeof CONFIG === 'object' },
        { name: 'services', test: () => typeof services === 'object' },
        { name: 'HealthMonitor', test: () => typeof HealthMonitor === 'object' }
      ];
      
      const results = {};
      let allPassed = true;
      
      for (const check of checks) {
        try {
          const passed = check.test();
          results[check.name] = passed;
          if (!passed) allPassed = false;
        } catch (error) {
          results[check.name] = false;
          allPassed = false;
        }
      }
      
      Logger.info(`Quick validation ${allPassed ? 'passed' : 'failed'}`, results);
      
      return { success: allPassed, results };
    } catch (error) {
      Logger.error('Quick validation failed', { error: error.message });
      return { success: false, error: error.message };
    }
  }
}

// Auto-run quick validation in debug mode
if (CONFIG && CONFIG.debug) {
  Phase1Validator.runQuickValidation().then(result => {
    Logger.info('Auto-validation completed', result);
  });
}
