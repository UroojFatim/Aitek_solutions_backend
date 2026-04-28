import logger from '../config/logger.config.js';
import jwt from 'jsonwebtoken';
import AuditLog from '../models/auditLog.model.js';

const SENSITIVE_FIELDS = [
  'password',
  'secret',
  'token',
  'key',
  'apiKey',
  'apiSecret',
  'authToken',
  'accessToken',
  'refreshToken',
  'sessionId',
  'credential',
  'credentials'
];

const redactSensitiveData = (data) => {
  if (!data) return null;

  let obj;
  try {
    obj = typeof data === 'string' ? JSON.parse(data) : data;
  } catch {
    return data;
  }

  if (typeof obj !== 'object' || obj === null) {
    return data;
  }

  const redactObject = (input) => {
    if (Array.isArray(input)) {
      return input.map(redactObject);
    }
    if (typeof input === 'object' && input !== null) {
      const result = {};
      for (const [key, value] of Object.entries(input)) {
        const lowerKey = key.toLowerCase();
        if (SENSITIVE_FIELDS.some(field => lowerKey.includes(field.toLowerCase()))) {
          result[key] = '<SENSITIVE_DATA>';
        } else if (typeof value === 'object' && value !== null) {
          result[key] = redactObject(value);
        } else {
          result[key] = value;
        }
      }
      return result;
    }
    return input;
  };

  return JSON.stringify(redactObject(obj), null, 2);
};

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_here';

export const requestLogger = (req, res, next) => {
  const startTime = Date.now();
  
  // Prepare request payload
  let requestPayload = null;
  try {
    if (req.body && Object.keys(req.body).length > 0) {
      requestPayload = redactSensitiveData(req.body);
      requestPayload = requestPayload ? requestPayload.substring(0, 1000) : 'No request payload provided';
    } else {
      requestPayload = 'No request payload provided';
    }
  } catch (error) {
    requestPayload = 'Unable to parse request payload';
  }

  // Try to get user info from req.user or decode JWT from cookie
  let userId, userName, userEmail;
  if (req.user && req.user.id) {
    userId = req.user.id;
    userName = req.user.full_name;
    userEmail = req.user.email;
  } else if (req.cookies && req.cookies.token) {
    const token = req.cookies.token;
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      userId = decoded.id;
      userName = decoded.full_name;
      userEmail = decoded.email;
    } catch (e) {
      // ignore invalid token
    }
  }
  
  const originalSend = res.send;
  
  res.send = function (body) {
    const duration = Date.now() - startTime;
    
    // Prepare response payload
    let responsePayload = null;
    try {
      responsePayload = redactSensitiveData(body);
      responsePayload = responsePayload ? responsePayload.substring(0, 1000) : 'No response payload provided';
    } catch (error) {
      responsePayload = 'Unable to parse response payload';
    }
    
    // Single combined log entry
    logger.info('HTTP Request-Response', {
      request: {
        method: req.method,
        url: req.originalUrl,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        contentType: req.get('Content-Type'),
        payload: requestPayload,
        userId,
        userName,
        userEmail,
      },
      response: {
        statusCode: res.statusCode,
        contentLength: res.get('Content-Length'),
        payload: responsePayload,
      },
      duration: `${duration}ms`,
      timestamp: new Date().toISOString()
    });
    
    // Save audit data to database
    if (userId) {
      try {
        // Simple CRUD mapping
        const CRUD_MAP = {
          'POST': 'CREATE',
          'GET': 'READ', 
          'PUT': 'UPDATE',
          'PATCH': 'UPDATE',
          'DELETE': 'DELETE'
        };
        
        // Extract resource type from URL
        const getResource = (url) => {
          if (url.includes('/business')) return 'business';
          if (url.includes('/documents')) return 'document';
          if (url.includes('/onboarding')) return 'onboarding';
          if (url.includes('/services')) return 'service';
          if (url.includes('/auth')) return 'auth';
          return 'unknown';
        };
        
        // Simple action naming
        const getActionName = (method, url) => {
          const resource = getResource(url);
          return `${CRUD_MAP[method]}_${resource.toUpperCase()}`;
        };
        
        // Prepare request data for database
        const requestData = {
          body: req.body ? redactSensitiveData(req.body) : null,
          params: req.params,
          query: req.query,
          headers: redactSensitiveData(req.headers),
          userAgent: req.get('User-Agent')
        };
        
        // Save to database
        AuditLog.create({
          user_id: userId,
          user_name: userName || 'Unknown',
          user_email: userEmail || 'Unknown',
          user_role: req.user?.role || 'Unknown',
          action: getActionName(req.method, req.originalUrl),
          crud_operation: CRUD_MAP[req.method],
          endpoint: req.originalUrl,
          method: req.method,
          affected_business_id: null,
          affected_business_name: null,
          status_code: res.statusCode,
          ip_address: req.ip,
          request_data: requestData,
          response_data: responsePayload,
        }).catch(err => {
          logger.error('Audit log database save failed', { 
            error: err.message,
            endpoint: req.originalUrl,
            user: userEmail 
          });
        });
        
      } catch (error) {
        logger.error('Audit log failed', { 
          error: error.message,
          endpoint: req.originalUrl,
          user: userEmail 
        });
      }
    }
    
    return originalSend.call(this, body);
  };
  
  next();
};

export const errorLogger = (err, req, res, next) => {
  let requestPayload = null;
  try {
    if (req.body && Object.keys(req.body).length > 0) {
      requestPayload = redactSensitiveData(req.body);
      requestPayload = requestPayload ? requestPayload.substring(0, 1000) : 'No request payload provided';
    } else {
      requestPayload = 'No request payload provided';
    }
  } catch (error) {
    requestPayload = 'Unable to parse request payload';
  }
  
  logger.error('Application Error', {
    error: err.message,
    stack: err.stack,
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    payload: requestPayload,
    timestamp: new Date().toISOString()
  });
  
  next(err);
};
