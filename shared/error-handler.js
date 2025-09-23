// Error handling utilities - extracted for reuse across features
export class ErrorHandler {
  static handle(error, context = '') {
    const errorMessage = error.message || 'Unknown error occurred';
    const contextPrefix = context ? `[${context}] ` : '';
    
    console.error(`${contextPrefix}Error:`, error);
    figma.notify(`${contextPrefix}Error: ${errorMessage}`, { error: true });
  }
  
  static handleAsync(asyncFn, context = '') {
    return async (...args) => {
      try {
        return await asyncFn(...args);
      } catch (error) {
        this.handle(error, context);
        throw error;
      }
    };
  }
  
  static handleSilent(error, context = '') {
    const contextPrefix = context ? `[${context}] ` : '';
    console.error(`${contextPrefix}Silent Error:`, error);
    // Don't show user notification for silent errors
  }
  
  static wrapFunction(fn, context = '') {
    return (...args) => {
      try {
        const result = fn(...args);
        // Handle both sync and async functions
        if (result && typeof result.catch === 'function') {
          return result.catch(error => {
            this.handle(error, context);
            throw error;
          });
        }
        return result;
      } catch (error) {
        this.handle(error, context);
        throw error;
      }
    };
  }
}
