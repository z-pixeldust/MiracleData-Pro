// Service registry for dependency injection and service management
import { Logger } from './logger.js';

export class ServiceRegistry {
  constructor() {
    this.services = new Map();
    this.fallbacks = new Map();
    this.healthChecks = new Map();
    this.middleware = new Map();
  }
  
  // Register a service with optional fallback and health check
  register(name, service, options = {}) {
    const { fallback = null, healthCheck = null, middleware = null } = options;
    
    this.services.set(name, service);
    
    if (fallback) {
      this.fallbacks.set(name, fallback);
      Logger.info(`Registered service with fallback: ${name}`);
    }
    
    if (healthCheck) {
      this.healthChecks.set(name, healthCheck);
    }
    
    if (middleware) {
      this.middleware.set(name, middleware);
    }
    
    Logger.info(`Registered service: ${name}`);
  }
  
  // Get a service, using fallback if main service is unavailable
  get(name) {
    const service = this.services.get(name);
    
    if (!service && this.fallbacks.has(name)) {
      Logger.warn(`Service ${name} not available, using fallback`);
      return this.fallbacks.get(name);
    }
    
    if (!service) {
      Logger.error(`Service ${name} not found and no fallback available`);
      return null;
    }
    
    // Apply middleware if available
    const middleware = this.middleware.get(name);
    if (middleware) {
      return this.wrapWithMiddleware(service, middleware);
    }
    
    return service;
  }
  
  // Check if a service is registered
  has(name) {
    return this.services.has(name) || this.fallbacks.has(name);
  }
  
  // Remove a service
  unregister(name) {
    this.services.delete(name);
    this.fallbacks.delete(name);
    this.healthChecks.delete(name);
    this.middleware.delete(name);
    Logger.info(`Unregistered service: ${name}`);
  }
  
  // Get all registered service names
  listServices() {
    const allServices = new Set([
      ...this.services.keys(),
      ...this.fallbacks.keys()
    ]);
    return Array.from(allServices);
  }
  
  // Run health checks for all services
  async checkHealth() {
    const results = {};
    
    for (const [name, healthCheck] of this.healthChecks) {
      try {
        results[name] = await healthCheck();
      } catch (error) {
        results[name] = { 
          healthy: false, 
          error: error.message,
          timestamp: new Date().toISOString()
        };
      }
    }
    
    const healthyCount = Object.values(results).filter(r => r.healthy).length;
    const totalCount = Object.keys(results).length;
    
    Logger.info(`Health check completed: ${healthyCount}/${totalCount} services healthy`);
    
    return {
      healthy: healthyCount === totalCount,
      services: results,
      summary: {
        total: totalCount,
        healthy: healthyCount,
        unhealthy: totalCount - healthyCount
      }
    };
  }
  
  // Wrap service with middleware
  wrapWithMiddleware(service, middleware) {
    if (typeof middleware === 'function') {
      return middleware(service);
    }
    
    // Handle array of middleware functions
    if (Array.isArray(middleware)) {
      return middleware.reduce((wrapped, mw) => mw(wrapped), service);
    }
    
    return service;
  }
  
  // Clear all services (for testing)
  clear() {
    this.services.clear();
    this.fallbacks.clear();
    this.healthChecks.clear();
    this.middleware.clear();
    Logger.info('All services cleared');
  }
}

// Global service registry instance
export const services = new ServiceRegistry();

// Common middleware for services
export const Middleware = {
  // Logging middleware
  withLogging(serviceName) {
    return (service) => {
      return new Proxy(service, {
        get(target, prop) {
          const originalMethod = target[prop];
          
          if (typeof originalMethod === 'function') {
            return function(...args) {
              Logger.debug(`Calling ${serviceName}.${prop}`, { args });
              const start = performance.now();
              
              try {
                const result = originalMethod.apply(this, args);
                
                // Handle async methods
                if (result && typeof result.then === 'function') {
                  return result.then(
                    (res) => {
                      const duration = performance.now() - start;
                      Logger.performance(`${serviceName}.${prop}`, duration);
                      return res;
                    },
                    (error) => {
                      const duration = performance.now() - start;
                      Logger.error(`${serviceName}.${prop} failed`, { duration, error });
                      throw error;
                    }
                  );
                }
                
                const duration = performance.now() - start;
                Logger.performance(`${serviceName}.${prop}`, duration);
                return result;
              } catch (error) {
                const duration = performance.now() - start;
                Logger.error(`${serviceName}.${prop} failed`, { duration, error });
                throw error;
              }
            };
          }
          
          return originalMethod;
        }
      });
    };
  },
  
  // Error handling middleware
  withErrorHandling(serviceName) {
    return (service) => {
      return new Proxy(service, {
        get(target, prop) {
          const originalMethod = target[prop];
          
          if (typeof originalMethod === 'function') {
            return function(...args) {
              try {
                const result = originalMethod.apply(this, args);
                
                // Handle async methods
                if (result && typeof result.catch === 'function') {
                  return result.catch(error => {
                    Logger.error(`${serviceName}.${prop} error`, { error });
                    throw error;
                  });
                }
                
                return result;
              } catch (error) {
                Logger.error(`${serviceName}.${prop} error`, { error });
                throw error;
              }
            };
          }
          
          return originalMethod;
        }
      });
    };
  },
  
  // Retry middleware
  withRetry(maxRetries = 3, delay = 1000) {
    return (service) => {
      return new Proxy(service, {
        get(target, prop) {
          const originalMethod = target[prop];
          
          if (typeof originalMethod === 'function') {
            return async function(...args) {
              let lastError;
              
              for (let attempt = 1; attempt <= maxRetries; attempt++) {
                try {
                  const result = await originalMethod.apply(this, args);
                  return result;
                } catch (error) {
                  lastError = error;
                  
                  if (attempt < maxRetries) {
                    Logger.warn(`Retry ${attempt}/${maxRetries} for ${prop}`, { error });
                    await new Promise(resolve => setTimeout(resolve, delay * attempt));
                  }
                }
              }
              
              Logger.error(`${prop} failed after ${maxRetries} attempts`, { error: lastError });
              throw lastError;
            };
          }
          
          return originalMethod;
        }
      });
    };
  }
};
