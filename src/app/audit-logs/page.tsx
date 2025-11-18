"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Activity,
  ArrowLeft,
  Filter,
  TrendingUp,
  Users,
  FileText,
  Calendar,
  Eye,
  Edit,
  Trash2,
  Save,
  Settings,
  Search,
  Loader2,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface AuditLog {
  id: number;
  userId: string | null;
  action: string;
  entityType: string;
  entityId: string | null;
  metadata: any;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: Date;
}

interface Stats {
  actionCounts: Record<string, number>;
  entityTypeCounts: Record<string, number>;
  recentActivity: AuditLog[];
  totalLogs: number;
  todayCount: number;
  activeUsers: number;
}

export default function AuditLogsPage() {
  const router = useRouter();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [selectedEntityType, setSelectedEntityType] = useState<string>("all");

  useEffect(() => {
    fetchStats();
    fetchLogs();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/audit-logs/stats");
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
  };

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({ limit: "100" });
      
      if (selectedFilter !== "all") {
        params.append("action", selectedFilter);
      }
      
      if (selectedEntityType !== "all") {
        params.append("entity_type", selectedEntityType);
      }

      const response = await fetch(`/api/audit-logs?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setLogs(data);
      }
    } catch (error) {
      console.error("Failed to fetch logs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [selectedFilter, selectedEntityType]);

  const getActionIcon = (action: string) => {
    switch (action) {
      case "entry_created":
        return <FileText className="w-4 h-4 text-green-500" />;
      case "entry_updated":
        return <Edit className="w-4 h-4 text-blue-500" />;
      case "entry_deleted":
        return <Trash2 className="w-4 h-4 text-red-500" />;
      case "entry_viewed":
        return <Eye className="w-4 h-4 text-purple-500" />;
      case "draft_auto_saved":
        return <Save className="w-4 h-4 text-yellow-500" />;
      case "mode_switched":
        return <Settings className="w-4 h-4 text-indigo-500" />;
      case "app_loaded":
        return <Activity className="w-4 h-4 text-cyan-500" />;
      case "search_performed":
        return <Search className="w-4 h-4 text-orange-500" />;
      default:
        return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  const formatDate = (date: Date) => {
    const d = new Date(date);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: d.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  };

  const formatActionText = (log: AuditLog) => {
    const action = log.action.replace(/_/g, " ");
    const metadata = log.metadata;

    switch (log.action) {
      case "entry_created":
        return `Created entry with ${metadata?.wordCount || 0} words`;
      case "entry_updated":
        return `Updated entry (${metadata?.previousWordCount || 0} → ${metadata?.newWordCount || 0} words)`;
      case "entry_deleted":
        return `Deleted entry with ${metadata?.wordCount || 0} words`;
      case "entry_viewed":
        return `Viewed entry (${metadata?.wordCount || 0} words)`;
      case "draft_auto_saved":
        return `Auto-saved draft with ${metadata?.wordCount || 0} words`;
      case "mode_switched":
        return `Switched from ${metadata?.from || "?"} to ${metadata?.to || "?"} mode`;
      case "app_loaded":
        return `Loaded app v${metadata?.version || "?"}`;
      case "search_performed":
        return `Searched for "${metadata?.query || "?"}" (${metadata?.resultsCount || 0} results)`;
      default:
        return action;
    }
  };

  return (
    <div className="min-h-screen bg-[#fdfcfb] dark:bg-[#1a1816]">
      {/* Header */}
      <header className="border-b border-[#e8e5e1] dark:border-[#2d2a26] bg-white/50 dark:bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/")}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-light tracking-wide text-[#2d2a26] dark:text-[#e8e5e1] flex items-center gap-2">
                <Activity className="w-6 h-6" />
                Audit Logs
              </h1>
              <p className="text-sm text-[#a89179] dark:text-[#5a564f]">
                Track all activities in your MindDump app
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Statistics Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card className="p-6 bg-white dark:bg-[#0f0e0d] border-[#e8e5e1] dark:border-[#2d2a26]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#a89179] dark:text-[#5a564f]">
                    Total Logs
                  </p>
                  <p className="text-3xl font-light text-[#2d2a26] dark:text-[#e8e5e1] mt-1">
                    {stats.totalLogs}
                  </p>
                </div>
                <Activity className="w-10 h-10 text-[#8b7355] dark:text-[#a89179] opacity-50" />
              </div>
            </Card>

            <Card className="p-6 bg-white dark:bg-[#0f0e0d] border-[#e8e5e1] dark:border-[#2d2a26]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#a89179] dark:text-[#5a564f]">
                    Today's Activity
                  </p>
                  <p className="text-3xl font-light text-[#2d2a26] dark:text-[#e8e5e1] mt-1">
                    {stats.todayCount}
                  </p>
                </div>
                <TrendingUp className="w-10 h-10 text-green-500 opacity-50" />
              </div>
            </Card>

            <Card className="p-6 bg-white dark:bg-[#0f0e0d] border-[#e8e5e1] dark:border-[#2d2a26]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#a89179] dark:text-[#5a564f]">
                    Active Users
                  </p>
                  <p className="text-3xl font-light text-[#2d2a26] dark:text-[#e8e5e1] mt-1">
                    {stats.activeUsers}
                  </p>
                </div>
                <Users className="w-10 h-10 text-blue-500 opacity-50" />
              </div>
            </Card>

            <Card className="p-6 bg-white dark:bg-[#0f0e0d] border-[#e8e5e1] dark:border-[#2d2a26]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#a89179] dark:text-[#5a564f]">
                    Entries Created
                  </p>
                  <p className="text-3xl font-light text-[#2d2a26] dark:text-[#e8e5e1] mt-1">
                    {stats.actionCounts["entry_created"] || 0}
                  </p>
                </div>
                <FileText className="w-10 h-10 text-purple-500 opacity-50" />
              </div>
            </Card>
          </div>
        )}

        {/* Action Breakdown */}
        {stats && (
          <Card className="p-6 bg-white dark:bg-[#0f0e0d] border-[#e8e5e1] dark:border-[#2d2a26] mb-8">
            <h2 className="text-lg font-light text-[#2d2a26] dark:text-[#e8e5e1] mb-4">
              Action Breakdown
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(stats.actionCounts).map(([action, count]) => (
                <div key={action} className="flex items-center gap-2">
                  {getActionIcon(action)}
                  <div>
                    <p className="text-sm text-[#2d2a26] dark:text-[#e8e5e1] capitalize">
                      {action.replace(/_/g, " ")}
                    </p>
                    <p className="text-xs text-[#a89179] dark:text-[#5a564f]">
                      {count} times
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#a89179] dark:text-[#5a564f]" />
            <span className="text-sm text-[#a89179] dark:text-[#5a564f]">
              Filter by action:
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {["all", "entry_created", "entry_updated", "entry_deleted", "entry_viewed", "draft_auto_saved"].map(
              (filter) => (
                <Button
                  key={filter}
                  variant={selectedFilter === filter ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedFilter(filter)}
                  className="text-xs"
                >
                  {filter === "all" ? "All" : filter.replace(/_/g, " ")}
                </Button>
              )
            )}
          </div>
        </div>

        {/* Logs List */}
        <Card className="bg-white dark:bg-[#0f0e0d] border-[#e8e5e1] dark:border-[#2d2a26]">
          <div className="p-6 border-b border-[#e8e5e1] dark:border-[#2d2a26]">
            <h2 className="text-lg font-light text-[#2d2a26] dark:text-[#e8e5e1]">
              Recent Activity
            </h2>
          </div>

          {loading ? (
            <div className="p-12 flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-[#8b7355] dark:text-[#a89179]" />
            </div>
          ) : logs.length === 0 ? (
            <div className="p-12 text-center">
              <Activity className="w-12 h-12 mx-auto text-[#a89179] dark:text-[#5a564f] opacity-50 mb-4" />
              <p className="text-[#a89179] dark:text-[#5a564f]">
                No audit logs found
              </p>
            </div>
          ) : (
            <div className="divide-y divide-[#e8e5e1] dark:divide-[#2d2a26]">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className="p-6 hover:bg-[#fdfcfb] dark:hover:bg-[#1a1816] transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div className="mt-1">{getActionIcon(log.action)}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[#2d2a26] dark:text-[#e8e5e1] font-light">
                        {formatActionText(log)}
                      </p>
                      <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-[#a89179] dark:text-[#5a564f]">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(log.createdAt)}
                        </span>
                        {log.entityId && (
                          <span className="flex items-center gap-1">
                            <FileText className="w-3 h-3" />
                            ID: {log.entityId.slice(0, 8)}...
                          </span>
                        )}
                        {log.userId && (
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            User: {log.userId}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </main>
    </div>
  );
}
