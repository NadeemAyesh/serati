// Environment configuration with smart auto-detection for local dev vs production
const isAngularDevServer = typeof window !== 'undefined' && 
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') && 
  window.location.port === '4200';

export const environment = {
  production: !isAngularDevServer,
  apiUrl: isAngularDevServer ? 'http://localhost:5000/api' : '/api'
};
