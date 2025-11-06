"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Share2 } from "lucide-react";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";

interface SummaryResultProps {
  loading: boolean;
  error: string | null;
  summary: string | null;
}

export function SummaryResult({ loading, error, summary }: SummaryResultProps) {
  const handleCopy = async () => {
    if (!summary) return;
    try {
      await navigator.clipboard.writeText(summary);
      toast.success("Summary copied!");
    } catch (err) {
      toast.error("Failed to copy");
    }
  };

  const handleShare = async () => {
    if (!summary) return;
    try {
      if (navigator.share) {
        await navigator.share({
          title: "RingkasCepat Summary",
          text: summary,
        });
      } else {
        await navigator.clipboard.writeText(summary);
        toast.success("Summary copied (sharing not supported)");
      }
    } catch (err) {
      // User cancelled or sharing failed
      console.error("Share error:", err);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Generating Summary...</CardTitle>
          <CardDescription>Please wait while we process your content</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/6" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/6" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (!summary) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Summary</CardTitle>
          <CardDescription>
            Enter content above and click "Ringkas" to generate a summary
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-12">
            <p>No summary yet</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Your Summary</CardTitle>
            <CardDescription>AI-generated summary of your content</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={handleCopy}>
              <Copy className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={handleShare}>
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <div className="whitespace-pre-wrap">{summary}</div>
        </div>
      </CardContent>
    </Card>
  );
}
