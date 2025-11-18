import { db } from '@/db';
import { auditLogs } from '@/db/schema';

async function main() {
    const sampleAuditLogs = [
        // Entry Created (8 entries)
        {
            action: 'entry_created',
            entityType: 'entry',
            entityId: 'entry_abc123',
            metadata: JSON.stringify({ 
                title: 'Morning Reflections on Productivity', 
                wordCount: 456, 
                tags: ['productivity', 'morning'],
                userId: 'user_123'
            }),
            ipAddress: '192.168.1.100',
            userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
            createdAt: new Date(Date.now() - (6 * 24 * 60 * 60 * 1000) - (8 * 60 * 60 * 1000))
        },
        {
            action: 'entry_created',
            entityType: 'entry',
            entityId: 'entry_xyz789',
            metadata: JSON.stringify({ 
                title: 'Weekend Adventure Plans', 
                wordCount: 234, 
                tags: ['travel', 'weekend'],
                userId: 'user_456'
            }),
            ipAddress: '10.0.0.50',
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            createdAt: new Date(Date.now() - (5 * 24 * 60 * 60 * 1000) - (14 * 60 * 60 * 1000))
        },
        {
            action: 'entry_created',
            entityType: 'entry',
            entityId: 'entry_def456',
            metadata: JSON.stringify({ 
                title: 'Learning TypeScript Deep Dive', 
                wordCount: 789, 
                tags: ['coding', 'learning', 'typescript'],
                userId: 'user_123'
            }),
            ipAddress: '192.168.1.100',
            userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
            createdAt: new Date(Date.now() - (4 * 24 * 60 * 60 * 1000) - (10 * 60 * 60 * 1000))
        },
        {
            action: 'entry_created',
            entityType: 'entry',
            entityId: 'entry_ghi789',
            metadata: JSON.stringify({ 
                title: 'Meditation Practice Notes', 
                wordCount: 178, 
                tags: ['mindfulness', 'health'],
                userId: 'user_789'
            }),
            ipAddress: '172.16.0.25',
            userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15',
            createdAt: new Date(Date.now() - (4 * 24 * 60 * 60 * 1000) - (6 * 60 * 60 * 1000))
        },
        {
            action: 'entry_created',
            entityType: 'entry',
            entityId: 'entry_jkl012',
            metadata: JSON.stringify({ 
                title: 'Book Review: Atomic Habits', 
                wordCount: 623, 
                tags: ['books', 'review', 'habits'],
                userId: 'user_456'
            }),
            ipAddress: '10.0.0.50',
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            createdAt: new Date(Date.now() - (3 * 24 * 60 * 60 * 1000) - (16 * 60 * 60 * 1000))
        },
        {
            action: 'entry_created',
            entityType: 'entry',
            entityId: 'entry_mno345',
            metadata: JSON.stringify({ 
                title: 'Project Milestone Achieved', 
                wordCount: 412, 
                tags: ['work', 'achievement'],
                userId: 'user_123'
            }),
            ipAddress: null,
            userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
            createdAt: new Date(Date.now() - (2 * 24 * 60 * 60 * 1000) - (12 * 60 * 60 * 1000))
        },
        {
            action: 'entry_created',
            entityType: 'entry',
            entityId: 'entry_pqr678',
            metadata: JSON.stringify({ 
                title: 'Cooking Experiment: Homemade Pasta', 
                wordCount: 345, 
                tags: ['cooking', 'food'],
                userId: 'user_789'
            }),
            ipAddress: '172.16.0.25',
            userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15',
            createdAt: new Date(Date.now() - (1 * 24 * 60 * 60 * 1000) - (18 * 60 * 60 * 1000))
        },
        {
            action: 'entry_created',
            entityType: 'entry',
            entityId: 'entry_stu901',
            metadata: JSON.stringify({ 
                title: 'Gratitude Journal Entry', 
                wordCount: 156, 
                tags: ['gratitude', 'wellness'],
                userId: 'user_456'
            }),
            ipAddress: '10.0.0.50',
            userAgent: null,
            createdAt: new Date(Date.now() - (9 * 60 * 60 * 1000))
        },

        // Entry Updated (9 entries)
        {
            action: 'entry_updated',
            entityType: 'entry',
            entityId: 'entry_abc123',
            metadata: JSON.stringify({ 
                changes: ['content'], 
                previousWordCount: 456, 
                newWordCount: 512,
                userId: 'user_123'
            }),
            ipAddress: '192.168.1.100',
            userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
            createdAt: new Date(Date.now() - (5 * 24 * 60 * 60 * 1000) - (20 * 60 * 60 * 1000))
        },
        {
            action: 'entry_updated',
            entityType: 'entry',
            entityId: 'entry_xyz789',
            metadata: JSON.stringify({ 
                changes: ['title', 'tags'], 
                previousWordCount: 234, 
                newWordCount: 234,
                userId: 'user_456'
            }),
            ipAddress: '10.0.0.50',
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            createdAt: new Date(Date.now() - (4 * 24 * 60 * 60 * 1000) - (22 * 60 * 60 * 1000))
        },
        {
            action: 'entry_updated',
            entityType: 'entry',
            entityId: 'entry_def456',
            metadata: JSON.stringify({ 
                changes: ['content'], 
                previousWordCount: 789, 
                newWordCount: 856,
                userId: 'user_123'
            }),
            ipAddress: '192.168.1.100',
            userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
            createdAt: new Date(Date.now() - (3 * 24 * 60 * 60 * 1000) - (14 * 60 * 60 * 1000))
        },
        {
            action: 'entry_updated',
            entityType: 'entry',
            entityId: 'entry_ghi789',
            metadata: JSON.stringify({ 
                changes: ['content', 'tags'], 
                previousWordCount: 178, 
                newWordCount: 203,
                userId: 'user_789'
            }),
            ipAddress: '172.16.0.25',
            userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15',
            createdAt: new Date(Date.now() - (3 * 24 * 60 * 60 * 1000) - (8 * 60 * 60 * 1000))
        },
        {
            action: 'entry_updated',
            entityType: 'entry',
            entityId: 'entry_jkl012',
            metadata: JSON.stringify({ 
                changes: ['content'], 
                previousWordCount: 623, 
                newWordCount: 678,
                userId: 'user_456'
            }),
            ipAddress: '10.0.0.50',
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            createdAt: new Date(Date.now() - (2 * 24 * 60 * 60 * 1000) - (18 * 60 * 60 * 1000))
        },
        {
            action: 'entry_updated',
            entityType: 'entry',
            entityId: 'entry_mno345',
            metadata: JSON.stringify({ 
                changes: ['title', 'content'], 
                previousWordCount: 412, 
                newWordCount: 467,
                userId: 'user_123'
            }),
            ipAddress: '192.168.1.100',
            userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
            createdAt: new Date(Date.now() - (1 * 24 * 60 * 60 * 1000) - (20 * 60 * 60 * 1000))
        },
        {
            action: 'entry_updated',
            entityType: 'entry',
            entityId: 'entry_abc123',
            metadata: JSON.stringify({ 
                changes: ['tags'], 
                previousWordCount: 512, 
                newWordCount: 512,
                userId: 'user_123'
            }),
            ipAddress: '192.168.1.100',
            userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
            createdAt: new Date(Date.now() - (1 * 24 * 60 * 60 * 1000) - (5 * 60 * 60 * 1000))
        },
        {
            action: 'entry_updated',
            entityType: 'entry',
            entityId: 'entry_pqr678',
            metadata: JSON.stringify({ 
                changes: ['content'], 
                previousWordCount: 345, 
                newWordCount: 389,
                userId: 'user_789'
            }),
            ipAddress: '172.16.0.25',
            userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15',
            createdAt: new Date(Date.now() - (1 * 24 * 60 * 60 * 1000) - (2 * 60 * 60 * 1000))
        },
        {
            action: 'entry_updated',
            entityType: 'entry',
            entityId: 'entry_stu901',
            metadata: JSON.stringify({ 
                changes: ['content', 'tags'], 
                previousWordCount: 156, 
                newWordCount: 187,
                userId: 'user_456'
            }),
            ipAddress: '10.0.0.50',
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            createdAt: new Date(Date.now() - (3 * 60 * 60 * 1000))
        },

        // Entry Deleted (3 entries)
        {
            action: 'entry_deleted',
            entityType: 'entry',
            entityId: 'entry_old123',
            metadata: JSON.stringify({ 
                title: 'Old Draft That Didn\'t Work Out', 
                deletedAt: Date.now() - (5 * 24 * 60 * 60 * 1000),
                userId: 'user_123'
            }),
            ipAddress: '192.168.1.100',
            userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
            createdAt: new Date(Date.now() - (5 * 24 * 60 * 60 * 1000) - (11 * 60 * 60 * 1000))
        },
        {
            action: 'entry_deleted',
            entityType: 'entry',
            entityId: 'entry_old456',
            metadata: JSON.stringify({ 
                title: 'Test Entry to Remove', 
                deletedAt: Date.now() - (2 * 24 * 60 * 60 * 1000),
                userId: 'user_456'
            }),
            ipAddress: '10.0.0.50',
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            createdAt: new Date(Date.now() - (2 * 24 * 60 * 60 * 1000) - (7 * 60 * 60 * 1000))
        },
        {
            action: 'entry_deleted',
            entityType: 'entry',
            entityId: 'entry_old789',
            metadata: JSON.stringify({ 
                title: 'Duplicate Entry Cleanup', 
                deletedAt: Date.now() - (6 * 60 * 60 * 1000),
                userId: 'user_789'
            }),
            ipAddress: null,
            userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15',
            createdAt: new Date(Date.now() - (6 * 60 * 60 * 1000))
        },

        // Entry Viewed (6 entries)
        {
            action: 'entry_viewed',
            entityType: 'entry',
            entityId: 'entry_abc123',
            metadata: JSON.stringify({ 
                duration: 145, 
                viewMode: 'read',
                userId: 'user_456'
            }),
            ipAddress: '10.0.0.50',
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            createdAt: new Date(Date.now() - (4 * 24 * 60 * 60 * 1000) - (15 * 60 * 60 * 1000))
        },
        {
            action: 'entry_viewed',
            entityType: 'entry',
            entityId: 'entry_xyz789',
            metadata: JSON.stringify({ 
                duration: 78, 
                viewMode: 'read',
                userId: 'user_123'
            }),
            ipAddress: '192.168.1.100',
            userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
            createdAt: new Date(Date.now() - (3 * 24 * 60 * 60 * 1000) - (19 * 60 * 60 * 1000))
        },
        {
            action: 'entry_viewed',
            entityType: 'entry',
            entityId: 'entry_def456',
            metadata: JSON.stringify({ 
                duration: 203, 
                viewMode: 'edit',
                userId: 'user_123'
            }),
            ipAddress: '192.168.1.100',
            userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
            createdAt: new Date(Date.now() - (3 * 24 * 60 * 60 * 1000) - (13 * 60 * 60 * 1000))
        },
        {
            action: 'entry_viewed',
            entityType: 'entry',
            entityId: 'entry_jkl012',
            metadata: JSON.stringify({ 
                duration: 56, 
                viewMode: 'read',
                userId: 'user_789'
            }),
            ipAddress: '172.16.0.25',
            userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15',
            createdAt: new Date(Date.now() - (2 * 24 * 60 * 60 * 1000) - (9 * 60 * 60 * 1000))
        },
        {
            action: 'entry_viewed',
            entityType: 'entry',
            entityId: 'entry_mno345',
            metadata: JSON.stringify({ 
                duration: 189, 
                viewMode: 'edit',
                userId: 'user_123'
            }),
            ipAddress: '192.168.1.100',
            userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
            createdAt: new Date(Date.now() - (1 * 24 * 60 * 60 * 1000) - (19 * 60 * 60 * 1000))
        },
        {
            action: 'entry_viewed',
            entityType: 'entry',
            entityId: 'entry_pqr678',
            metadata: JSON.stringify({ 
                duration: 92, 
                viewMode: 'read',
                userId: 'user_456'
            }),
            ipAddress: '10.0.0.50',
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            createdAt: new Date(Date.now() - (4 * 60 * 60 * 1000))
        },

        // Draft Auto-saved (7 entries) - showing progression
        {
            action: 'draft_auto_saved',
            entityType: 'draft',
            entityId: 'draft_temp_123',
            metadata: JSON.stringify({ 
                wordCount: 87, 
                autosaveVersion: 1,
                userId: 'user_123'
            }),
            ipAddress: '192.168.1.100',
            userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
            createdAt: new Date(Date.now() - (7 * 24 * 60 * 60 * 1000) - (4 * 60 * 60 * 1000))
        },
        {
            action: 'draft_auto_saved',
            entityType: 'draft',
            entityId: 'draft_temp_123',
            metadata: JSON.stringify({ 
                wordCount: 156, 
                autosaveVersion: 2,
                userId: 'user_123'
            }),
            ipAddress: '192.168.1.100',
            userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
            createdAt: new Date(Date.now() - (7 * 24 * 60 * 60 * 1000) - (3 * 60 * 60 * 1000))
        },
        {
            action: 'draft_auto_saved',
            entityType: 'draft',
            entityId: 'draft_temp_123',
            metadata: JSON.stringify({ 
                wordCount: 234, 
                autosaveVersion: 3,
                userId: 'user_123'
            }),
            ipAddress: '192.168.1.100',
            userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
            createdAt: new Date(Date.now() - (7 * 24 * 60 * 60 * 1000) - (2 * 60 * 60 * 1000))
        },
        {
            action: 'draft_auto_saved',
            entityType: 'draft',
            entityId: 'draft_temp_456',
            metadata: JSON.stringify({ 
                wordCount: 123, 
                autosaveVersion: 1,
                userId: 'user_456'
            }),
            ipAddress: '10.0.0.50',
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            createdAt: new Date(Date.now() - (3 * 24 * 60 * 60 * 1000) - (6 * 60 * 60 * 1000))
        },
        {
            action: 'draft_auto_saved',
            entityType: 'draft',
            entityId: 'draft_temp_456',
            metadata: JSON.stringify({ 
                wordCount: 298, 
                autosaveVersion: 2,
                userId: 'user_456'
            }),
            ipAddress: '10.0.0.50',
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            createdAt: new Date(Date.now() - (3 * 24 * 60 * 60 * 1000) - (5 * 60 * 60 * 1000))
        },
        {
            action: 'draft_auto_saved',
            entityType: 'draft',
            entityId: 'draft_temp_789',
            metadata: JSON.stringify({ 
                wordCount: 67, 
                autosaveVersion: 1,
                userId: 'user_789'
            }),
            ipAddress: '172.16.0.25',
            userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15',
            createdAt: new Date(Date.now() - (1 * 24 * 60 * 60 * 1000) - (7 * 60 * 60 * 1000))
        },
        {
            action: 'draft_auto_saved',
            entityType: 'draft',
            entityId: 'draft_temp_current',
            metadata: JSON.stringify({ 
                wordCount: 45, 
                autosaveVersion: 1,
                userId: 'user_123'
            }),
            ipAddress: '192.168.1.100',
            userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
            createdAt: new Date(Date.now() - (30 * 60 * 1000))
        },

        // Session Started (5 entries)
        {
            action: 'session_started',
            entityType: 'session',
            entityId: 'session_abc123',
            metadata: JSON.stringify({ 
                duration: 2456, 
                entriesViewed: 8,
                userId: 'user_123'
            }),
            ipAddress: '192.168.1.100',
            userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
            createdAt: new Date(Date.now() - (6 * 24 * 60 * 60 * 1000) - (9 * 60 * 60 * 1000))
        },
        {
            action: 'session_started',
            entityType: 'session',
            entityId: 'session_xyz789',
            metadata: JSON.stringify({ 
                duration: 1823, 
                entriesViewed: 5,
                userId: 'user_456'
            }),
            ipAddress: '10.0.0.50',
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            createdAt: new Date(Date.now() - (5 * 24 * 60 * 60 * 1000) - (13 * 60 * 60 * 1000))
        },
        {
            action: 'session_started',
            entityType: 'session',
            entityId: 'session_def456',
            metadata: JSON.stringify({ 
                duration: 3201, 
                entriesViewed: 10,
                userId: 'user_789'
            }),
            ipAddress: '172.16.0.25',
            userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15',
            createdAt: new Date(Date.now() - (3 * 24 * 60 * 60 * 1000) - (17 * 60 * 60 * 1000))
        },
        {
            action: 'session_started',
            entityType: 'session',
            entityId: 'session_ghi789',
            metadata: JSON.stringify({ 
                duration: 945, 
                entriesViewed: 3,
                userId: 'user_123'
            }),
            ipAddress: '192.168.1.100',
            userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
            createdAt: new Date(Date.now() - (1 * 24 * 60 * 60 * 1000) - (21 * 60 * 60 * 1000))
        },
        {
            action: 'session_started',
            entityType: 'session',
            entityId: 'session_jkl012',
            metadata: JSON.stringify({ 
                duration: 1567, 
                entriesViewed: 6,
                userId: 'user_456'
            }),
            ipAddress: null,
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            createdAt: new Date(Date.now() - (12 * 60 * 60 * 1000))
        },

        // Mode Switched (4 entries)
        {
            action: 'mode_switched',
            entityType: 'system',
            entityId: null,
            metadata: JSON.stringify({ 
                from: 'light', 
                to: 'dark',
                userId: 'user_123'
            }),
            ipAddress: '192.168.1.100',
            userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
            createdAt: new Date(Date.now() - (5 * 24 * 60 * 60 * 1000) - (8 * 60 * 60 * 1000))
        },
        {
            action: 'mode_switched',
            entityType: 'system',
            entityId: null,
            metadata: JSON.stringify({ 
                from: 'read', 
                to: 'edit',
                userId: 'user_456'
            }),
            ipAddress: '10.0.0.50',
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            createdAt: new Date(Date.now() - (3 * 24 * 60 * 60 * 1000) - (12 * 60 * 60 * 1000))
        },
        {
            action: 'mode_switched',
            entityType: 'system',
            entityId: null,
            metadata: JSON.stringify({ 
                from: 'dark', 
                to: 'light',
                userId: 'user_789'
            }),
            ipAddress: '172.16.0.25',
            userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15',
            createdAt: new Date(Date.now() - (2 * 24 * 60 * 60 * 1000) - (6 * 60 * 60 * 1000))
        },
        {
            action: 'mode_switched',
            entityType: 'system',
            entityId: null,
            metadata: JSON.stringify({ 
                from: 'edit', 
                to: 'read',
                userId: 'user_123'
            }),
            ipAddress: '192.168.1.100',
            userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
            createdAt: new Date(Date.now() - (8 * 60 * 60 * 1000))
        },

        // App Loaded (3 entries)
        {
            action: 'app_loaded',
            entityType: 'system',
            entityId: null,
            metadata: JSON.stringify({ 
                version: '1.0.0', 
                loadTime: 234,
                userId: 'user_123'
            }),
            ipAddress: '192.168.1.100',
            userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
            createdAt: new Date(Date.now() - (6 * 24 * 60 * 60 * 1000) - (10 * 60 * 60 * 1000))
        },
        {
            action: 'app_loaded',
            entityType: 'system',
            entityId: null,
            metadata: JSON.stringify({ 
                version: '1.0.0', 
                loadTime: 187,
                userId: 'user_456'
            }),
            ipAddress: '10.0.0.50',
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            createdAt: new Date(Date.now() - (4 * 24 * 60 * 60 * 1000) - (16 * 60 * 60 * 1000))
        },
        {
            action: 'app_loaded',
            entityType: 'system',
            entityId: null,
            metadata: JSON.stringify({ 
                version: '1.0.0', 
                loadTime: 312,
                userId: 'user_789'
            }),
            ipAddress: '172.16.0.25',
            userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15',
            createdAt: new Date(Date.now() - (1 * 24 * 60 * 60 * 1000) - (14 * 60 * 60 * 1000))
        },

        // Search Performed (4 entries)
        {
            action: 'search_performed',
            entityType: 'system',
            entityId: null,
            metadata: JSON.stringify({ 
                query: 'productivity tips', 
                resultsCount: 12,
                userId: 'user_123'
            }),
            ipAddress: '192.168.1.100',
            userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
            createdAt: new Date(Date.now() - (5 * 24 * 60 * 60 * 1000) - (7 * 60 * 60 * 1000))
        },
        {
            action: 'search_performed',
            entityType: 'system',
            entityId: null,
            metadata: JSON.stringify({ 
                query: 'meditation', 
                resultsCount: 8,
                userId: 'user_456'
            }),
            ipAddress: '10.0.0.50',
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            createdAt: new Date(Date.now() - (3 * 24 * 60 * 60 * 1000) - (11 * 60 * 60 * 1000))
        },
        {
            action: 'search_performed',
            entityType: 'system',
            entityId: null,
            metadata: JSON.stringify({ 
                query: 'nonexistent query xyz', 
                resultsCount: 0,
                userId: 'user_789'
            }),
            ipAddress: '172.16.0.25',
            userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15',
            createdAt: new Date(Date.now() - (2 * 24 * 60 * 60 * 1000) - (4 * 60 * 60 * 1000))
        },
        {
            action: 'search_performed',
            entityType: 'system',
            entityId: null,
            metadata: JSON.stringify({ 
                query: 'typescript learning', 
                resultsCount: 5,
                userId: 'user_123'
            }),
            ipAddress: null,
            userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
            createdAt: new Date(Date.now() - (5 * 60 * 60 * 1000))
        }
    ];

    await db.insert(auditLogs).values(sampleAuditLogs);
    
    console.log('✅ Audit logs seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});