"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Loader2, Sparkles } from "lucide-react";
import { summarizeContent } from "@/app/actions/summarize";
import { SummaryResult } from "@/components/summary-result";
import { HistorySheet } from "@/components/history-sheet";
import { ThemeToggle } from "@/components/theme-toggle";

type SourceType = "url" | "text" | "youtube";
type SummaryStyle = "bullet_points" | "short_paragraph" | "explain_like_five";

export default function AppPage() {
  const [activeTab, setActiveTab] = useState<SourceType>("url");
  const [input, setInput] = useState("");
  const [summaryStyle, setSummaryStyle] = useState<SummaryStyle>("bullet_points");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim()) {
      setError("Please enter some content");
      return;
    }

    setLoading(true);
    setError(null);
    setSummary(null);

    const formData = new FormData();
    formData.append("sourceType", activeTab);
    formData.append("input", input);
    formData.append("summaryStyle", summaryStyle);

    const result = await summarizeContent(formData);

    setLoading(false);

    if (result.success && result.data) {
      setSummary(result.data.summaryText);
    } else {
      setError(result.error || "An error occurred");
    }
  };

  const getPlaceholder = () => {
    switch (activeTab) {
      case "url":
        return "https://example.com/article";
      case "youtube":
        return "https://youtube.com/watch?v=...";
      case "text":
        return "Paste your text here...";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 dark:from-gray-950 dark:via-purple-950/10 dark:to-blue-950/10 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }} />
      </div>

      <header className="border-b backdrop-blur-xl bg-white/70 dark:bg-gray-900/70 border-white/20 relative z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 text-white shadow-lg">
              <Sparkles className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-black bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">RingkasCepat</h1>
          </div>
          <div className="flex items-center gap-2">
            <HistorySheet />
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-5xl relative z-10">
        <div className="grid gap-6 md:grid-cols-1">
          <Card className="glass-effect border-2 shadow-2xl">
            <CardHeader className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                  <Sparkles className="h-5 w-5" />
                </div>
                <CardTitle className="text-2xl font-bold">Summarize Content</CardTitle>
              </div>
              <CardDescription className="text-base">
                Choose your content type and get an instant AI-powered summary
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as SourceType)}>
                  <TabsList className="grid w-full grid-cols-3 h-12 bg-gradient-to-r from-purple-100 via-pink-100 to-blue-100 dark:from-purple-900/20 dark:via-pink-900/20 dark:to-blue-900/20">
                    <TabsTrigger value="url" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-blue-500 data-[state=active]:text-white font-semibold">URL</TabsTrigger>
                    <TabsTrigger value="text" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-rose-500 data-[state=active]:text-white font-semibold">Text</TabsTrigger>
                    <TabsTrigger value="youtube" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-500 data-[state=active]:text-white font-semibold">YouTube</TabsTrigger>
                  </TabsList>

                  <TabsContent value="url" className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="url-input">Article URL</Label>
                      <Input
                        id="url-input"
                        type="url"
                        placeholder={getPlaceholder()}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        disabled={loading}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="text" className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="text-input">Text Content</Label>
                      <Textarea
                        id="text-input"
                        placeholder={getPlaceholder()}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        disabled={loading}
                        rows={8}
                        className="resize-none"
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="youtube" className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="youtube-input">YouTube URL</Label>
                      <Input
                        id="youtube-input"
                        type="url"
                        placeholder={getPlaceholder()}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        disabled={loading}
                      />
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="space-y-2">
                  <Label htmlFor="style-select">Summary Style</Label>
                  <Select
                    value={summaryStyle}
                    onValueChange={(v) => setSummaryStyle(v as SummaryStyle)}
                    disabled={loading}
                  >
                    <SelectTrigger id="style-select">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bullet_points">Key Bullet Points</SelectItem>
                      <SelectItem value="short_paragraph">100-Word Summary</SelectItem>
                      <SelectItem value="explain_like_five">Explain Like I'm 5 (ELI5)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button type="submit" className="w-full h-14 gradient-primary text-white border-0 hover:opacity-90 transition-opacity shadow-lg text-lg font-bold glow-effect" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                  <Sparkles className="mr-2 h-5 w-5" />
                  Ringkas Sekarang
                </Button>
              </form>
            </CardContent>
          </Card>

          <SummaryResult loading={loading} error={error} summary={summary} />
        </div>
      </main>
    </div>
  );
}
