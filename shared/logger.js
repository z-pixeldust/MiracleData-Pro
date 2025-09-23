// Logging utilities - extracted for consistent logging across features
export class Logger {
  static info(message, data = null) {
    const timestamp = new Date().toISOString();
    if (data) {
      console.log(`[${timestamp}] [INFO] ${message}`, data);
    } else {
      console.log(`[${timestamp}] [INFO] ${message}`);
    }
  }
  
  static warn(message, data = null) {
    const timestamp = new Date().toISOString();
    if (data) {
      console.warn(`[${timestamp}] [WARN] ${message}`, data);
    } else {
      console.warn(`[${timestamp}] [WARN] ${message}`);
    }
  }
  
  static error(message, data = null) {
    const timestamp = new Date().toISOString();
    if (data) {
      console.error(`[${timestamp}] [ERROR] ${message}`, data);
    } else {
      console.error(`[${timestamp}] [ERROR] ${message}`);
    }
  }
  
  static debug(message, data = null) {
    // Only log debug messages if debug mode is enabled
    if (typeof CONFIG !== 'undefined' && CONFIG.debug) {
      const timestamp = new Date().toISOString();
      if (data) {
        console.log(`[${timestamp}] [DEBUG] ${message}`, data);
      } else {
        console.log(`[${timestamp}] [DEBUG] ${message}`);
      }
    }
  }
  
  static performance(operation, duration, additionalData = null) {
    const timestamp = new Date().toISOString();
    const logData = {
      operation,
      duration: `${duration.toFixed(2)}ms`,
      timestamp
    };
    
    if (additionalData) {
      Object.assign(logData, additionalData);
    }
    
    console.log(`[${timestamp}] [PERF] ${operation}: ${logData.duration}`, logData);
  }
  
  static trackEvent(eventName, properties = {}) {
    const timestamp = new Date().toISOString();
    const eventData = {
      event: eventName,
      timestamp,
      properties
    };
    
    console.log(`[${timestamp}] [EVENT] ${eventName}`, eventData);
    
    // In the future, this could send events to analytics
    // this.sendToAnalytics(eventData);
  }
}
