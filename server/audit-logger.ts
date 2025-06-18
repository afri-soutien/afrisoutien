import { Request } from 'express';

// Types d'actions auditées
export enum AuditAction {
  VIEW_DASHBOARD = 'view_dashboard',
  LIST_USERS = 'list_users',
  BLOCK_USER = 'block_user',
  UNBLOCK_USER = 'unblock_user',
  CHANGE_USER_ROLE = 'change_user_role',
  UPDATE_USER = 'update_user',
  DELETE_USER = 'delete_user',
  EXPORT_USERS = 'export_users',
  LIST_CAMPAIGNS = 'list_campaigns',
  CHANGE_CAMPAIGN_STATUS = 'change_campaign_status',
  DELETE_CAMPAIGN = 'delete_campaign',
  LIST_DONATIONS = 'list_donations',
  EXPORT_DONATIONS = 'export_donations',
  UPDATE_MATERIAL_DONATION = 'update_material_donation',
  VIEW_MONTHLY_REPORT = 'view_monthly_report',
  VIEW_CONTENT = 'view_content',
  VIEW_PAYMENT_CONFIG = 'view_payment_config',
  VIEW_LOGS = 'view_logs',
  ADMIN_LOGIN_SUCCESS = 'admin_login_success',
  ADMIN_LOGIN_FAILED = 'admin_login_failed',
  ADMIN_ACCESS_DENIED = 'admin_access_denied'
}

export interface AuditLog {
  timestamp: string;
  userId: number | null;
  userEmail: string | null;
  action: AuditAction;
  resource?: string;
  resourceId?: number;
  ipAddress: string;
  userAgent: string;
  success: boolean;
  details?: any;
}

class AuditLogger {
  private logs: AuditLog[] = [];

  log(
    req: Request,
    action: AuditAction,
    success: boolean = true,
    details?: any,
    resource?: string,
    resourceId?: number
  ): void {
    const user = (req as any).user;
    const timestamp = new Date().toISOString();
    const ipAddress = req.ip || req.connection.remoteAddress || 'unknown';
    const userAgent = req.get('User-Agent') || 'unknown';

    const auditLog: AuditLog = {
      timestamp,
      userId: user?.id || null,
      userEmail: user?.email || null,
      action,
      resource,
      resourceId,
      ipAddress,
      userAgent,
      success,
      details
    };

    this.logs.push(auditLog);

    // Log to console for immediate monitoring
    const logLevel = success ? 'INFO' : 'WARN';
    const actionDesc = success ? 'SUCCESS' : 'FAILED';
    
    console.log(
      `[${logLevel}] [ADMIN AUDIT] ${timestamp} - ${actionDesc} - ` +
      `User: ${user?.email || 'anonymous'} (ID: ${user?.id || 'none'}) - ` +
      `Action: ${action} - IP: ${ipAddress} - ` +
      `Resource: ${resource || 'none'}${resourceId ? `(${resourceId})` : ''} - ` +
      `Details: ${details ? JSON.stringify(details) : 'none'}`
    );

    // Keep only last 1000 logs in memory
    if (this.logs.length > 1000) {
      this.logs = this.logs.slice(-1000);
    }
  }

  getLogs(limit: number = 100): AuditLog[] {
    return this.logs
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
  }

  getLogsByUser(userId: number, limit: number = 50): AuditLog[] {
    return this.logs
      .filter(log => log.userId === userId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
  }

  getSecurityLogs(limit: number = 50): AuditLog[] {
    const securityActions = [
      AuditAction.ADMIN_LOGIN_FAILED,
      AuditAction.ADMIN_ACCESS_DENIED,
      AuditAction.DELETE_USER,
      AuditAction.CHANGE_USER_ROLE
    ];

    return this.logs
      .filter(log => securityActions.includes(log.action) || !log.success)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
  }
}

export const auditLogger = new AuditLogger();

// Middleware d'audit automatique pour les routes admin
export const auditMiddleware = (action: AuditAction, resource?: string) => {
  return (req: Request, res: any, next: any) => {
    const originalSend = res.send;
    const originalJson = res.json;

    // Intercepter la réponse pour déterminer le succès
    res.send = function(data: any) {
      const success = res.statusCode >= 200 && res.statusCode < 400;
      auditLogger.log(req, action, success, null, resource);
      return originalSend.call(this, data);
    };

    res.json = function(data: any) {
      const success = res.statusCode >= 200 && res.statusCode < 400;
      auditLogger.log(req, action, success, null, resource);
      return originalJson.call(this, data);
    };

    next();
  };
};

// Rate limiting simple en mémoire
class RateLimiter {
  private requests: Map<string, number[]> = new Map();

  isAllowed(key: string, maxRequests: number, windowMs: number): boolean {
    const now = Date.now();
    const requests = this.requests.get(key) || [];
    
    // Supprimer les requêtes anciennes
    const validRequests = requests.filter(time => now - time < windowMs);
    
    if (validRequests.length >= maxRequests) {
      return false;
    }
    
    validRequests.push(now);
    this.requests.set(key, validRequests);
    
    return true;
  }

  reset(key: string): void {
    this.requests.delete(key);
  }
}

export const rateLimiter = new RateLimiter();

// Middleware de rate limiting
export const rateLimit = (maxRequests: number, windowMs: number) => {
  return (req: Request, res: any, next: any) => {
    const key = req.ip || 'unknown';
    
    if (!rateLimiter.isAllowed(key, maxRequests, windowMs)) {
      auditLogger.log(req, AuditAction.ADMIN_ACCESS_DENIED, false, {
        reason: 'Rate limit exceeded',
        maxRequests,
        windowMs
      });
      
      return res.status(429).json({
        error: 'RATE_LIMIT_EXCEEDED',
        message: 'Trop de requêtes. Veuillez patienter avant de réessayer.',
        retryAfter: Math.ceil(windowMs / 1000)
      });
    }
    
    next();
  };
};