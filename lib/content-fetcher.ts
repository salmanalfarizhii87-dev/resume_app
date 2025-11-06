import * as cheerio from "cheerio";
import { YoutubeTranscript } from "youtube-transcript";

export type SourceType = "text" | "url" | "youtube";

export interface FetchedContent {
  sourceType: SourceType;
  originalSource: string;
  processedText: string;
}

/**
 * Fetch and parse content from a URL (article)
 */
export async function fetchArticleContent(url: string): Promise<FetchedContent> {
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch URL: ${response.status} ${response.statusText}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Remove unwanted elements
    $("script, style, nav, header, footer, aside, iframe, noscript").remove();

    // Try to find the main content
    let mainText = "";
    const mainSelectors = ["article", "main", '[role="main"]', ".post-content", ".article-content", ".entry-content"];
    
    for (const selector of mainSelectors) {
      const content = $(selector).text().trim();
      if (content.length > mainText.length) {
        mainText = content;
      }
    }

    // Fallback to body if no main content found
    if (mainText.length < 100) {
      mainText = $("body").text().trim();
    }

    // Clean up whitespace
    mainText = mainText.replace(/\s+/g, " ").trim();

    if (mainText.length < 50) {
      throw new Error("Could not extract meaningful content from the URL. The page may be behind a paywall or use dynamic content.");
    }

    return {
      sourceType: "url",
      originalSource: url,
      processedText: mainText,
    };
  } catch (error) {
    console.error("Article fetch error:", error);
    if (error instanceof Error) {
      throw new Error(`Failed to fetch article: ${error.message}`);
    }
    throw new Error("Failed to fetch article content");
  }
}

/**
 * Fetch YouTube video transcript
 */
export async function fetchYoutubeTranscript(url: string): Promise<FetchedContent> {
  try {
    // Extract video ID from URL
    const videoIdMatch = url.match(/(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/watch\?.+&v=))([^&\n?#]+)/);
    
    if (!videoIdMatch || !videoIdMatch[1]) {
      throw new Error("Invalid YouTube URL. Please provide a valid YouTube video link.");
    }

    const videoId = videoIdMatch[1];
    
    const transcriptData = await YoutubeTranscript.fetchTranscript(videoId);
    
    if (!transcriptData || transcriptData.length === 0) {
      throw new Error("No transcript available for this video. The video may not have captions enabled.");
    }

    // Combine all transcript segments
    const fullTranscript = transcriptData.map((segment) => segment.text).join(" ");

    return {
      sourceType: "youtube",
      originalSource: url,
      processedText: fullTranscript,
    };
  } catch (error) {
    console.error("YouTube transcript error:", error);
    if (error instanceof Error) {
      throw new Error(`Failed to fetch YouTube transcript: ${error.message}`);
    }
    throw new Error("Failed to fetch YouTube transcript");
  }
}

/**
 * Process text input (no fetching needed)
 */
export function processTextInput(text: string): FetchedContent {
  if (text.trim().length < 10) {
    throw new Error("Text is too short. Please provide at least 10 characters.");
  }

  return {
    sourceType: "text",
    originalSource: text.substring(0, 100) + (text.length > 100 ? "..." : ""),
    processedText: text.trim(),
  };
}

/**
 * Main function to fetch content based on source type
 */
export async function fetchContent(
  sourceType: SourceType,
  input: string
): Promise<FetchedContent> {
  switch (sourceType) {
    case "url":
      return await fetchArticleContent(input);
    case "youtube":
      return await fetchYoutubeTranscript(input);
    case "text":
      return processTextInput(input);
    default:
      throw new Error("Invalid source type");
  }
}
