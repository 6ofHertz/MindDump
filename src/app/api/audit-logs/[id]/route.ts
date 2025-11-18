import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { auditLogs } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        {
          error: 'Valid ID is required',
          code: 'INVALID_ID'
        },
        { status: 400 }
      );
    }

    const auditLog = await db
      .select()
      .from(auditLogs)
      .where(eq(auditLogs.id, parseInt(id)))
      .limit(1);

    if (auditLog.length === 0) {
      return NextResponse.json(
        {
          error: 'Audit log not found',
          code: 'NOT_FOUND'
        },
        { status: 404 }
      );
    }

    const record = auditLog[0];
    
    let parsedMetadata = null;
    if (record.metadata) {
      try {
        parsedMetadata = JSON.parse(record.metadata);
      } catch {
        parsedMetadata = record.metadata;
      }
    }

    return NextResponse.json({
      ...record,
      metadata: parsedMetadata
    });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        {
          error: 'Valid ID is required',
          code: 'INVALID_ID'
        },
        { status: 400 }
      );
    }

    const auditLogId = parseInt(id);

    const existingRecord = await db
      .select()
      .from(auditLogs)
      .where(eq(auditLogs.id, auditLogId))
      .limit(1);

    if (existingRecord.length === 0) {
      return NextResponse.json(
        {
          error: 'Audit log not found',
          code: 'NOT_FOUND'
        },
        { status: 404 }
      );
    }

    const deleted = await db
      .delete(auditLogs)
      .where(eq(auditLogs.id, auditLogId))
      .returning();

    return NextResponse.json({
      message: 'Audit log deleted successfully',
      id: auditLogId,
      deletedRecord: deleted[0]
    });
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
      },
      { status: 500 }
    );
  }
}