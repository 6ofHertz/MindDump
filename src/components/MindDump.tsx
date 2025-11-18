"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { BookOpen, PenLine, Trash2, Activity } from "lucide-react";
import { auditLog } from "@/lib/audit-logger";
import { useRouter } from "next/navigation";

interface Entry {
  id: string;
  content: string;
  timestamp: number;
}

export default function MindDump() {
  const [mode, setMode] = useState<"write" | "view">("write");
  const [currentContent, setCurrentContent] = useState("");
  const [entries, setEntries] = useState<Entry[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<Entry | null>(null);
  const [autoSaveTimeout, setAutoSaveTimeout] = useState<NodeJS.Timeout | null>(null);
  const router = useRouter();

  // Load entries from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("mindDumpEntries");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setEntries(parsed);
      } catch (e) {
        console.error("Failed to parse stored entries:", e);
      }
    }

    // Load current draft
    const draft = localStorage.getItem("mindDumpDraft");
    if (draft) {
      setCurrentContent(draft);
    }

    // Log app loaded
    auditLog.appLoaded({
      version: "1.0.0",
      entriesCount: entries.length,
      hasDraft: !!draft,
    });
  }, []);

  // Auto-save draft to localStorage (debounced)
  useEffect(() => {
    if (autoSaveTimeout) {
      clearTimeout(autoSaveTimeout);
    }

    const timeout = setTimeout(() => {
      localStorage.setItem("mindDumpDraft", currentContent);
      
      // Log draft auto-save
      if (currentContent.trim()) {
        auditLog.draftAutoSaved("draft_current", {
          wordCount: currentContent.trim().split(/\s+/).length,
          characterCount: currentContent.length,
        });
      }
    }, 500);

    setAutoSaveTimeout(timeout);

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [currentContent]);

  const saveEntry = useCallback(() => {
    if (!currentContent.trim()) return;

    const newEntry: Entry = {
      id: Date.now().toString(),
      content: currentContent,
      timestamp: Date.now(),
    };

    const updatedEntries = [newEntry, ...entries];
    setEntries(updatedEntries);
    localStorage.setItem("mindDumpEntries", JSON.stringify(updatedEntries));
    setCurrentContent("");
    localStorage.setItem("mindDumpDraft", "");

    // Log entry created
    auditLog.entryCreated(newEntry.id, {
      wordCount: currentContent.trim().split(/\s+/).length,
      characterCount: currentContent.length,
      timestamp: newEntry.timestamp,
    });
  }, [currentContent, entries]);

  const deleteEntry = useCallback(
    (id: string) => {
      const entryToDelete = entries.find((entry) => entry.id === id);
      const updatedEntries = entries.filter((entry) => entry.id !== id);
      setEntries(updatedEntries);
      localStorage.setItem("mindDumpEntries", JSON.stringify(updatedEntries));
      if (selectedEntry?.id === id) {
        setSelectedEntry(null);
      }

      // Log entry deleted
      if (entryToDelete) {
        auditLog.entryDeleted(id, {
          wordCount: entryToDelete.content.trim().split(/\s+/).length,
          timestamp: entryToDelete.timestamp,
        });
      }
    },
    [entries, selectedEntry]
  );

  const handleModeSwitch = useCallback((newMode: "write" | "view") => {
    setMode(newMode);
    setSelectedEntry(null);

    // Log mode switch
    auditLog.modeSwitched({
      from: mode,
      to: newMode,
    });
  }, [mode]);

  const handleEntryView = useCallback((entry: Entry) => {
    setSelectedEntry(entry);

    // Log entry viewed
    auditLog.entryViewed(entry.id, {
      wordCount: entry.content.trim().split(/\s+/).length,
      timestamp: entry.timestamp,
    });
  }, []);

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    const isYesterday =
      date.toDateString() ===
      new Date(now.getTime() - 24 * 60 * 60 * 1000).toDateString();

    const time = date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    if (isToday) return `Today at ${time}`;
    if (isYesterday) return `Yesterday at ${time}`;

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="min-h-screen bg-[#fdfcfb] dark:bg-[#1a1816] flex flex-col">
      {/* Header */}
      <header className="border-b border-[#e8e5e1] dark:border-[#2d2a26] bg-white/50 dark:bg-black/20 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-light tracking-wide text-[#2d2a26] dark:text-[#e8e5e1]">
            MindDump
          </h1>
          <div className="flex gap-2">
            <Button
              variant={mode === "write" ? "default" : "ghost"}
              size="sm"
              onClick={() => handleModeSwitch("write")}
              className="gap-2"
            >
              <PenLine className="w-4 h-4" />
              Write
            </Button>
            <Button
              variant={mode === "view" ? "default" : "ghost"}
              size="sm"
              onClick={() => handleModeSwitch("view")}
              className="gap-2"
            >
              <BookOpen className="w-4 h-4" />
              Entries ({entries.length})
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/audit-logs")}
              className="gap-2"
              title="View Audit Logs"
            >
              <Activity className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-6 py-8">
        {mode === "write" ? (
          <div className="space-y-4 animate-in fade-in duration-300">
            <textarea
              value={currentContent}
              onChange={(e) => setCurrentContent(e.target.value)}
              placeholder="Start writing your thoughts..."
              className="w-full min-h-[500px] p-6 bg-white dark:bg-[#0f0e0d] border border-[#e8e5e1] dark:border-[#2d2a26] rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#8b7355] dark:focus:ring-[#a89179] text-[#2d2a26] dark:text-[#e8e5e1] placeholder:text-[#a89179] dark:placeholder:text-[#5a564f] leading-relaxed text-lg font-light"
              autoFocus
            />
            {currentContent.trim() && (
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setCurrentContent("")}
                  size="sm"
                >
                  Clear
                </Button>
                <Button onClick={saveEntry} size="sm">
                  Save Entry
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4 animate-in fade-in duration-300">
            {entries.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-[#a89179] dark:text-[#5a564f] text-lg font-light">
                  No entries yet. Start writing to create your first memory.
                </p>
              </div>
            ) : selectedEntry ? (
              <div className="space-y-4">
                <Button
                  variant="ghost"
                  onClick={() => setSelectedEntry(null)}
                  size="sm"
                  className="mb-4"
                >
                  ← Back to all entries
                </Button>
                <div className="bg-white dark:bg-[#0f0e0d] border border-[#e8e5e1] dark:border-[#2d2a26] rounded-lg p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-[#a89179] dark:text-[#5a564f]">
                      {formatDate(selectedEntry.timestamp)}
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteEntry(selectedEntry.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="prose prose-lg dark:prose-invert max-w-none">
                    <p className="whitespace-pre-wrap text-[#2d2a26] dark:text-[#e8e5e1] leading-relaxed font-light">
                      {selectedEntry.content}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {entries.map((entry) => (
                  <div
                    key={entry.id}
                    onClick={() => handleEntryView(entry)}
                    className="bg-white dark:bg-[#0f0e0d] border border-[#e8e5e1] dark:border-[#2d2a26] rounded-lg p-5 cursor-pointer hover:border-[#8b7355] dark:hover:border-[#a89179] transition-all hover:shadow-md"
                  >
                    <p className="text-sm text-[#a89179] dark:text-[#5a564f] mb-2">
                      {formatDate(entry.timestamp)}
                    </p>
                    <p className="text-[#2d2a26] dark:text-[#e8e5e1] line-clamp-2 font-light">
                      {entry.content}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}