"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db, summary } from "@/db";
import { eq, desc } from "drizzle-orm";
import { fetchContent, type SourceType } from "@/lib/content-fetcher";
import { generateSummary, type SummaryStyle } from "@/lib/gemini";

export interface SummarizeResult {
  success: boolean;
  data?: {
    id: number;
    summaryText: string;
    sourceType: SourceType;
    summaryStyle: SummaryStyle;
    originalSource: string;
    createdAt: Date;
  };
  error?: string;
}

export async function summarizeContent(formData: FormData): Promise<SummarizeResult> {
  try {
    // Get the authenticated user session
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return {
        success: false,
        error: "You must be logged in to use this feature.",
      };
    }

    // Extract form data
    const sourceType = formData.get("sourceType") as SourceType;
    const input = formData.get("input") as string;
    const summaryStyle = formData.get("summaryStyle") as SummaryStyle;

    // Validate inputs
    if (!sourceType || !input || !summaryStyle) {
      return {
        success: false,
        error: "Missing required fields. Please fill in all fields.",
      };
    }

    if (!["text", "url", "youtube"].includes(sourceType)) {
      return {
        success: false,
        error: "Invalid source type.",
      };
    }

    if (!["bullet_points", "short_paragraph", "explain_like_five"].includes(summaryStyle)) {
      return {
        success: false,
        error: "Invalid summary style.",
      };
    }

    // Fetch and process content
    const fetchedContent = await fetchContent(sourceType, input);

    // Generate summary using Gemini
    const summaryText = await generateSummary(fetchedContent.processedText, summaryStyle);

    // Save to database
    const [newSummary] = await db
      .insert(summary)
      .values({
        userId: session.user.id,
        sourceType: fetchedContent.sourceType,
        summaryStyle: summaryStyle,
        originalSource: fetchedContent.originalSource,
        processedText: fetchedContent.processedText,
        summaryText: summaryText,
      })
      .returning();

    return {
      success: true,
      data: {
        id: newSummary.id,
        summaryText: newSummary.summaryText,
        sourceType: newSummary.sourceType,
        summaryStyle: newSummary.summaryStyle,
        originalSource: newSummary.originalSource,
        createdAt: newSummary.createdAt,
      },
    };
  } catch (error) {
    console.error("Summarize error:", error);
    if (error instanceof Error) {
      return {
        success: false,
        error: error.message,
      };
    }
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
}

export interface HistoryItem {
  id: number;
  sourceType: SourceType;
  summaryStyle: SummaryStyle;
  originalSource: string;
  summaryText: string;
  createdAt: Date;
}

export async function fetchHistory(): Promise<HistoryItem[]> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return [];
    }

    const summaries = await db
      .select({
        id: summary.id,
        sourceType: summary.sourceType,
        summaryStyle: summary.summaryStyle,
        originalSource: summary.originalSource,
        summaryText: summary.summaryText,
        createdAt: summary.createdAt,
      })
      .from(summary)
      .where(eq(summary.userId, session.user.id))
      .orderBy(desc(summary.createdAt))
      .limit(50);

    return summaries;
  } catch (error) {
    console.error("Fetch history error:", error);
    return [];
  }
}

export interface DeleteResult {
  success: boolean;
  error?: string;
}

export async function deleteSummary(summaryId: number): Promise<DeleteResult> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return {
        success: false,
        error: "You must be logged in to delete summaries.",
      };
    }

    // Verify the summary belongs to the user before deleting
    const [existingSummary] = await db
      .select()
      .from(summary)
      .where(eq(summary.id, summaryId));

    if (!existingSummary) {
      return {
        success: false,
        error: "Summary not found.",
      };
    }

    if (existingSummary.userId !== session.user.id) {
      return {
        success: false,
        error: "You do not have permission to delete this summary.",
      };
    }

    await db.delete(summary).where(eq(summary.id, summaryId));

    return {
      success: true,
    };
  } catch (error) {
    console.error("Delete summary error:", error);
    return {
      success: false,
      error: "Failed to delete summary. Please try again.",
    };
  }
}
