# Audit Log System Documentation

## Overview

The MindDump app now includes a comprehensive audit logging system that tracks all user activities and system events. This provides complete visibility into how the application is being used and helps with debugging, analytics, and compliance.

## Features

### 🎯 What Gets Tracked

The audit log system automatically tracks:

1. **Entry Management**
   - `entry_created` - When a new entry is saved
   - `entry_updated` - When an entry is modified
   - `entry_deleted` - When an entry is removed
   - `entry_viewed` - When a user views an entry

2. **Draft Management**
   - `draft_auto_saved` - When drafts are auto-saved (every 500ms)

3. **System Events**
   - `app_loaded` - When the application loads
   - `mode_switched` - When switching between write/view modes
   - `search_performed` - When search is executed (future feature)

### 📊 Captured Information

Each audit log entry includes:

- **Action** - Type of action performed
- **Entity Type** - What was affected (entry, draft, system)
- **Entity ID** - Unique identifier of the affected entity
- **User ID** - User who performed the action (nullable)
- **Metadata** - JSON object with action-specific details:
  - Word count
  - Character count
  - Previous/new values for updates
  - Mode switches (from/to)
  - App version and load time
  - Search queries and result counts
- **IP Address** - User's IP (nullable)
- **User Agent** - Browser/device information
- **Timestamp** - When the action occurred

## Architecture

### Database Schema

```typescript
// src/db/schema.ts
export const auditLogs = sqliteTable('audit_logs', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: text('user_id'),
  action: text('action').notNull(),
  entityType: text('entity_type').notNull(),
  entityId: text('entity_id'),
  metadata: text('metadata', { mode: 'json' }),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});
```

### API Endpoints

#### 1. Create Audit Log
```
POST /api/audit-logs
```

**Request Body:**
```json
{
  "action": "entry_created",
  "entityType": "entry",
  "entityId": "1234567890",
  "userId": "user_123",
  "metadata": {
    "wordCount": 245,
    "characterCount": 1523,
    "timestamp": 1700000000000
  },
  "ipAddress": "192.168.1.100",
  "userAgent": "Mozilla/5.0..."
}
```

**Response:** `201 Created`
```json
{
  "id": 1,
  "action": "entry_created",
  "entityType": "entry",
  "entityId": "1234567890",
  "userId": "user_123",
  "metadata": {
    "wordCount": 245,
    "characterCount": 1523,
    "timestamp": 1700000000000
  },
  "ipAddress": "192.168.1.100",
  "userAgent": "Mozilla/5.0...",
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

#### 2. Get All Audit Logs (with Filtering & Pagination)
```
GET /api/audit-logs
```

**Query Parameters:**
- `limit` (default: 50, max: 200) - Number of results
- `offset` (default: 0) - Pagination offset
- `action` - Filter by action type
- `entity_type` - Filter by entity type
- `entity_id` - Filter by specific entity
- `user_id` - Filter by user
- `start_date` - Filter from date (timestamp)
- `end_date` - Filter to date (timestamp)

**Examples:**
```bash
# Get last 100 logs
GET /api/audit-logs?limit=100

# Get all entry creations
GET /api/audit-logs?action=entry_created

# Get logs for specific entry
GET /api/audit-logs?entity_id=1234567890

# Get logs in date range
GET /api/audit-logs?start_date=1700000000&end_date=1700100000
```

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "action": "entry_created",
    "entityType": "entry",
    "metadata": { ... },
    "createdAt": "2024-01-15T10:30:00.000Z"
  },
  ...
]
```

#### 3. Get Single Audit Log
```
GET /api/audit-logs/[id]
GET /api/audit-logs?id=[id]
```

**Response:** `200 OK` or `404 Not Found`

#### 4. Get Statistics
```
GET /api/audit-logs/stats
```

**Response:** `200 OK`
```json
{
  "actionCounts": {
    "entry_created": 45,
    "entry_updated": 23,
    "entry_deleted": 5,
    "draft_auto_saved": 312
  },
  "entityTypeCounts": {
    "entry": 73,
    "draft": 312,
    "system": 89
  },
  "recentActivity": [ /* last 10 logs */ ],
  "totalLogs": 474,
  "todayCount": 42,
  "activeUsers": 3
}
```

#### 5. Delete Audit Log
```
DELETE /api/audit-logs/[id]
```

**Response:** `200 OK`
```json
{
  "message": "Audit log deleted successfully",
  "id": 1,
  "deletedRecord": { ... }
}
```

## Usage

### Frontend Integration

The audit logger utility provides easy-to-use functions:

```typescript
import { auditLog } from '@/lib/audit-logger';

// Log entry creation
auditLog.entryCreated(entryId, {
  wordCount: 245,
  characterCount: 1523
});

// Log entry update
auditLog.entryUpdated(entryId, {
  previousWordCount: 245,
  newWordCount: 312
});

// Log entry deletion
auditLog.entryDeleted(entryId, {
  wordCount: 312
});

// Log entry view
auditLog.entryViewed(entryId, {
  wordCount: 312
});

// Log draft auto-save
auditLog.draftAutoSaved(draftId, {
  wordCount: 123,
  autosaveVersion: 5
});

// Log mode switch
auditLog.modeSwitched({
  from: 'write',
  to: 'view'
});

// Log app load
auditLog.appLoaded({
  version: '1.0.0',
  loadTime: 234
});

// Log search
auditLog.searchPerformed({
  query: 'morning routine',
  resultsCount: 5
});
```

### Custom Logging

For custom actions:

```typescript
import { logAudit } from '@/lib/audit-logger';

await logAudit({
  action: 'custom_action',
  entityType: 'custom_entity',
  entityId: 'abc123',
  userId: 'user_123',
  metadata: {
    customField1: 'value1',
    customField2: 123
  }
});
```

## Audit Log Viewer

Access the audit log viewer at `/audit-logs` or click the Activity icon (📊) in the main header.

### Features

1. **Statistics Dashboard**
   - Total logs count
   - Today's activity count
   - Active users count
   - Entry creation count

2. **Action Breakdown**
   - Visual breakdown of all action types
   - Count for each action type
   - Color-coded icons

3. **Filtering**
   - Filter by action type
   - Filter by entity type
   - Real-time filtering without page reload

4. **Activity Feed**
   - Chronological list of all activities
   - Smart time formatting (e.g., "5m ago", "2h ago")
   - Detailed metadata display
   - User and entity information

## Deployment Considerations

### Environment Variables

The audit log system uses the same Turso database credentials as the rest of the app:

```env
TURSO_CONNECTION_URL=libsql://...
TURSO_AUTH_TOKEN=eyJ...
```

These are already configured and ready for deployment.

### Vercel Deployment

The audit log system is fully compatible with Vercel deployment:

1. All API routes are serverless functions
2. Database operations use Turso (serverless SQLite)
3. No additional configuration needed
4. Scales automatically with traffic

### Performance

- **Async Logging**: All audit logs are "fire and forget" - they don't block UI operations
- **Efficient Queries**: Indexed on `createdAt` for fast filtering
- **Pagination**: Limits results to prevent large payloads
- **Metadata as JSON**: Flexible schema for different action types

## Privacy & Data Management

### What Gets Stored

- **User Actions**: All interactions with entries and drafts
- **System Events**: App loads, mode switches, searches
- **Metadata**: Word counts, timestamps, but NOT entry content
- **Technical Data**: User agent, IP address (if available)

### What Doesn't Get Stored

- **Entry Content**: Only metadata like word count
- **Personal Information**: No PII unless explicitly added
- **Passwords**: Never logged
- **API Keys**: Never logged

### Data Retention

Currently, audit logs are retained indefinitely. To implement retention policies:

```typescript
// Delete logs older than 90 days
const ninetyDaysAgo = Date.now() - (90 * 24 * 60 * 60 * 1000);
await db.delete(auditLogs)
  .where(lte(auditLogs.createdAt, ninetyDaysAgo));
```

## Troubleshooting

### Logs Not Appearing

1. **Check API Routes**: Ensure `/api/audit-logs` is accessible
2. **Check Database**: Verify Turso connection is working
3. **Check Browser Console**: Look for fetch errors
4. **Check Network Tab**: Verify POST requests are being sent

### Missing Metadata

1. **Check Logging Calls**: Ensure metadata is being passed
2. **Check JSON Serialization**: Metadata must be JSON-serializable
3. **Check API Response**: Verify metadata is in response

### Performance Issues

1. **Reduce Autosave Frequency**: Increase debounce time
2. **Add Pagination**: Limit results per page
3. **Add Indexes**: Create indexes on frequently filtered columns
4. **Archive Old Logs**: Move old logs to cold storage

## Future Enhancements

### Planned Features

1. **Export Functionality**
   - Export logs as CSV
   - Export logs as JSON
   - Email reports

2. **Advanced Analytics**
   - Usage trends over time
   - User behavior patterns
   - Popular features

3. **Real-time Updates**
   - WebSocket integration
   - Live activity feed
   - Push notifications

4. **Compliance Features**
   - GDPR data export
   - Right to deletion
   - Audit trail integrity verification

5. **Search & Filtering**
   - Full-text search in metadata
   - Advanced date range filters
   - Saved filter presets

## Support

For issues or questions about the audit log system:

1. Check this documentation
2. Review the API route implementations in `src/app/api/audit-logs/`
3. Check the utility functions in `src/lib/audit-logger.ts`
4. Review the viewer component in `src/app/audit-logs/page.tsx`

## License

The audit log system is part of the MindDump project and uses the same MIT license.

---

**Last Updated**: November 2024  
**Version**: 1.0.0
