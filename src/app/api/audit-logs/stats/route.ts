import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { auditLogs } from '@/db/schema';
import { sql, desc, gte, isNotNull } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    // Calculate today's start timestamp (midnight UTC) in seconds
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    // 1. Action Counts - Count of logs grouped by action type
    const actionCountsResult = await db
      .select({
        action: auditLogs.action,
        count: sql<number>`count(*)`.as('count')
      })
      .from(auditLogs)
      .groupBy(auditLogs.action);

    const actionCounts: Record<string, number> = {};
    actionCountsResult.forEach(row => {
      if (row.action) {
        actionCounts[row.action] = row.count;
      }
    });

    // 2. Entity Type Counts - Count of logs grouped by entity type
    const entityTypeCountsResult = await db
      .select({
        entityType: auditLogs.entityType,
        count: sql<number>`count(*)`.as('count')
      })
      .from(auditLogs)
      .groupBy(auditLogs.entityType);

    const entityTypeCounts: Record<string, number> = {};
    entityTypeCountsResult.forEach(row => {
      if (row.entityType) {
        entityTypeCounts[row.entityType] = row.count;
      }
    });

    // 3. Recent Activity - Last 10 audit log entries
    const recentActivity = await db
      .select()
      .from(auditLogs)
      .orderBy(desc(auditLogs.createdAt))
      .limit(10);

    // Parse metadata as JSON for recent activity
    const recentActivityParsed = recentActivity.map(log => ({
      ...log,
      metadata: log.metadata ? JSON.parse(log.metadata) : null
    }));

    // 4. Total Count - Total number of audit logs
    const totalCountResult = await db
      .select({
        total: sql<number>`count(*)`.as('total')
      })
      .from(auditLogs);

    const totalLogs = totalCountResult[0]?.total || 0;

    // 5. Today's Activity - Count of logs created today
    const todayCountResult = await db
      .select({
        count: sql<number>`count(*)`.as('count')
      })
      .from(auditLogs)
      .where(gte(auditLogs.createdAt, todayStart));

    const todayCount = todayCountResult[0]?.count || 0;

    // 6. Active Users - Count of unique user IDs (excluding null)
    // Note: Since we don't have a userId field, we'll return 0 for now
    const activeUsers = 0;

    // Return all statistics in a single response object
    return NextResponse.json({
      actionCounts,
      entityTypeCounts,
      recentActivity: recentActivityParsed,
      totalLogs,
      todayCount,
      activeUsers
    }, { status: 200 });

  } catch (error) {
    console.error('GET statistics error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
    }, { status: 500 });
  }
}