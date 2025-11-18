/**
 * Audit Logger Utility
 * Provides easy-to-use functions for logging user actions throughout the app
 */

type AuditAction =
  | 'entry_created'
  | 'entry_updated'
  | 'entry_deleted'
  | 'entry_viewed'
  | 'draft_auto_saved'
  | 'mode_switched'
  | 'app_loaded'
  | 'search_performed';

type EntityType = 'entry' | 'draft' | 'system';

interface LogOptions {
  action: AuditAction;
  entityType: EntityType;
  entityId?: string;
  userId?: string;
  metadata?: Record<string, any>;
}

/**
 * Log an audit event to the backend
 */
export async function logAudit(options: LogOptions): Promise<void> {
  try {
    const { action, entityType, entityId, userId, metadata } = options;

    // Get user agent and approximate IP (client-side can't get real IP)
    const userAgent = navigator.userAgent;

    await fetch('/api/audit-logs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action,
        entityType,
        entityId,
        userId,
        metadata,
        userAgent,
        ipAddress: null, // Will be set server-side if needed
      }),
    });

    // Fire and forget - don't block UI on logging errors
  } catch (error) {
    console.error('Audit logging failed:', error);
    // Don't throw - logging shouldn't break the app
  }
}

/**
 * Convenience functions for common audit actions
 */
export const auditLog = {
  entryCreated: (entryId: string, metadata?: Record<string, any>) =>
    logAudit({
      action: 'entry_created',
      entityType: 'entry',
      entityId: entryId,
      metadata,
    }),

  entryUpdated: (entryId: string, metadata?: Record<string, any>) =>
    logAudit({
      action: 'entry_updated',
      entityType: 'entry',
      entityId: entryId,
      metadata,
    }),

  entryDeleted: (entryId: string, metadata?: Record<string, any>) =>
    logAudit({
      action: 'entry_deleted',
      entityType: 'entry',
      entityId: entryId,
      metadata,
    }),

  entryViewed: (entryId: string, metadata?: Record<string, any>) =>
    logAudit({
      action: 'entry_viewed',
      entityType: 'entry',
      entityId: entryId,
      metadata,
    }),

  draftAutoSaved: (draftId: string, metadata?: Record<string, any>) =>
    logAudit({
      action: 'draft_auto_saved',
      entityType: 'draft',
      entityId: draftId,
      metadata,
    }),

  modeSwitched: (metadata?: Record<string, any>) =>
    logAudit({
      action: 'mode_switched',
      entityType: 'system',
      metadata,
    }),

  appLoaded: (metadata?: Record<string, any>) =>
    logAudit({
      action: 'app_loaded',
      entityType: 'system',
      metadata,
    }),

  searchPerformed: (metadata?: Record<string, any>) =>
    logAudit({
      action: 'search_performed',
      entityType: 'system',
      metadata,
    }),
};
