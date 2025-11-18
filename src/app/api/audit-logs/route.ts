import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { auditLogs } from '@/db/schema';
import { eq, and, gte, lte, desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // Single record fetch by ID
    if (id) {
      if (!id || isNaN(parseInt(id))) {
        return NextResponse.json({ 
          error: "Valid ID is required",
          code: "INVALID_ID" 
        }, { status: 400 });
      }

      const record = await db.select()
        .from(auditLogs)
        .where(eq(auditLogs.id, parseInt(id)))
        .limit(1);

      if (record.length === 0) {
        return NextResponse.json({ 
          error: 'Audit log not found',
          code: "NOT_FOUND" 
        }, { status: 404 });
      }

      // Parse metadata if it exists
      const result = {
        ...record[0],
        metadata: record[0].metadata ? JSON.parse(record[0].metadata) : null
      };

      return NextResponse.json(result, { status: 200 });
    }

    // List with pagination and filtering
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '50'), 200);
    const offset = parseInt(searchParams.get('offset') ?? '0');
    const action = searchParams.get('action');
    const entityType = searchParams.get('entity_type');
    const entityId = searchParams.get('entity_id');
    const userId = searchParams.get('user_id');
    const startDate = searchParams.get('start_date');
    const endDate = searchParams.get('end_date');

    // Build filter conditions
    const conditions = [];

    if (action) {
      conditions.push(eq(auditLogs.action, action));
    }

    if (entityType) {
      conditions.push(eq(auditLogs.entityType, entityType));
    }

    if (entityId) {
      conditions.push(eq(auditLogs.entityId, entityId));
    }

    if (userId) {
      conditions.push(eq(auditLogs.userId, userId));
    }

    if (startDate) {
      const startTimestamp = parseInt(startDate);
      if (!isNaN(startTimestamp)) {
        conditions.push(gte(auditLogs.createdAt, startTimestamp));
      }
    }

    if (endDate) {
      const endTimestamp = parseInt(endDate);
      if (!isNaN(endTimestamp)) {
        conditions.push(lte(auditLogs.createdAt, endTimestamp));
      }
    }

    let query = db.select().from(auditLogs);

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    const results = await query
      .orderBy(desc(auditLogs.createdAt))
      .limit(limit)
      .offset(offset);

    // Parse metadata for all results
    const parsedResults = results.map(log => ({
      ...log,
      metadata: log.metadata ? JSON.parse(log.metadata) : null
    }));

    return NextResponse.json(parsedResults, { status: 200 });

  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message,
      code: "INTERNAL_ERROR"
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, entityType, userId, entityId, metadata, ipAddress, userAgent } = body;

    // Validate required fields
    if (!action) {
      return NextResponse.json({ 
        error: "Action is required",
        code: "MISSING_ACTION" 
      }, { status: 400 });
    }

    if (!entityType) {
      return NextResponse.json({ 
        error: "Entity type is required",
        code: "MISSING_ENTITY_TYPE" 
      }, { status: 400 });
    }

    // Prepare insert data
    const insertData: {
      action: string;
      entityType: string;
      userId?: string | null;
      entityId?: string | null;
      metadata?: string | null;
      ipAddress?: string | null;
      userAgent?: string | null;
      createdAt: Date;
    } = {
      action: action.trim(),
      entityType: entityType.trim(),
      createdAt: new Date()
    };

    // Add optional fields if provided
    if (userId !== undefined) {
      insertData.userId = userId ? userId.trim() : null;
    }

    if (entityId !== undefined) {
      insertData.entityId = entityId ? entityId.trim() : null;
    }

    if (metadata !== undefined) {
      // Validate and stringify metadata if it's an object
      if (metadata !== null) {
        try {
          insertData.metadata = typeof metadata === 'string' 
            ? metadata 
            : JSON.stringify(metadata);
        } catch (e) {
          return NextResponse.json({ 
            error: "Invalid metadata format",
            code: "INVALID_METADATA" 
          }, { status: 400 });
        }
      } else {
        insertData.metadata = null;
      }
    }

    if (ipAddress !== undefined) {
      insertData.ipAddress = ipAddress ? ipAddress.trim() : null;
    }

    if (userAgent !== undefined) {
      insertData.userAgent = userAgent ? userAgent.trim() : null;
    }

    const newRecord = await db.insert(auditLogs)
      .values(insertData)
      .returning();

    // Parse metadata in response
    const result = {
      ...newRecord[0],
      metadata: newRecord[0].metadata ? JSON.parse(newRecord[0].metadata) : null
    };

    return NextResponse.json(result, { status: 201 });

  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message,
      code: "INTERNAL_ERROR"
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // Validate ID
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: "Valid ID is required",
        code: "INVALID_ID" 
      }, { status: 400 });
    }

    // Check if record exists
    const existing = await db.select()
      .from(auditLogs)
      .where(eq(auditLogs.id, parseInt(id)))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json({ 
        error: 'Audit log not found',
        code: "NOT_FOUND" 
      }, { status: 404 });
    }

    // Delete the record
    const deleted = await db.delete(auditLogs)
      .where(eq(auditLogs.id, parseInt(id)))
      .returning();

    // Parse metadata in response
    const result = {
      ...deleted[0],
      metadata: deleted[0].metadata ? JSON.parse(deleted[0].metadata) : null
    };

    return NextResponse.json({ 
      message: 'Audit log deleted successfully',
      deletedRecord: result
    }, { status: 200 });

  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message,
      code: "INTERNAL_ERROR"
    }, { status: 500 });
  }
}