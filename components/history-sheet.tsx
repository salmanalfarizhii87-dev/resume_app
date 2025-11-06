"use client";

import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { History, Trash2, Clock } from "lucide-react";
import { fetchHistory, deleteSummary, type HistoryItem } from "@/app/actions/summarize";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";

export function HistorySheet() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) {
      loadHistory();
    }
  }, [open]);

  const loadHistory = async () => {
    setLoading(true);
    const data = await fetchHistory();
    setHistory(data);
    setLoading(false);
  };

  const handleDelete = async (id: number) => {
    const result = await deleteSummary(id);
    if (result.success) {
      toast.success("Summary deleted");
      setHistory(history.filter((item) => item.id !== id));
    } else {
      toast.error(result.error || "Failed to delete summary");
    }
  };

  const getSourceLabel = (type: string) => {
    switch (type) {
      case "url":
        return "URL";
      case "youtube":
        return "YouTube";
      case "text":
        return "Text";
      default:
        return type;
    }
  };

  const getStyleLabel = (style: string) => {
    switch (style) {
      case "bullet_points":
        return "Bullet Points";
      case "short_paragraph":
        return "Short Paragraph";
      case "explain_like_five":
        return "ELI5";
      default:
        return style;
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon">
          <History className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Summary History</SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-100px)] mt-6">
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="border rounded-lg p-4 animate-pulse">
                  <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : history.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              <History className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No summaries yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {history.map((item) => (
                <div key={item.id} className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex gap-2 mb-2">
                        <Badge variant="secondary">{getSourceLabel(item.sourceType)}</Badge>
                        <Badge variant="outline">{getStyleLabel(item.summaryStyle)}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground truncate mb-2">
                        {item.originalSource}
                      </p>
                      <p className="text-sm line-clamp-3">{item.summaryText}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(item.id)}
                      className="shrink-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
