import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, FileText, Video, Type, Zap, Shield, TrendingUp } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import Link from "next/link";

export default async function Home() {
  // Check if user is authenticated
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Redirect to /app if authenticated
  if (session?.user) {
    redirect("/app");
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-950 dark:via-purple-950/20 dark:to-blue-950/20 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-pink-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle />
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-12">
        <div className="max-w-6xl w-full space-y-12">
          {/* Hero Section */}
          <div className="text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-effect border border-purple-200 dark:border-purple-800">
              <Sparkles className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              <span className="text-sm font-medium bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Powered by Advanced AI
              </span>
            </div>

            <div className="space-y-4">
              <h1 className="text-5xl sm:text-7xl font-black tracking-tight">
                <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent animate-gradient">
                  RingkasCepat
                </span>
              </h1>
              <p className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-200">
                Peringkas Konten Instan Berbasis AI
              </p>
              <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Combat information overload with instant, high-quality AI-powered summaries of articles, threads, and videos in seconds.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Button asChild size="lg" className="text-lg h-14 px-8 gradient-primary text-white border-0 hover:opacity-90 transition-opacity shadow-lg glow-effect">
                <Link href="/sign-in">
                  <Zap className="mr-2 h-5 w-5" />
                  Get Started Free
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-lg h-14 px-8 glass-effect hover:bg-white/80 dark:hover:bg-gray-800/80">
                <Link href="/sign-up">Create Account</Link>
              </Button>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 pt-6 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-green-500" />
                <span>100% Secure</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-yellow-500" />
                <span>Instant Results</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-blue-500" />
                <span>AI-Powered</span>
              </div>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
            <Card className="group hover:shadow-2xl transition-all duration-300 border-2 hover:border-purple-300 dark:hover:border-purple-700 glass-effect hover:-translate-y-2">
              <CardContent className="p-6 space-y-4">
                <div className="inline-flex p-3 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 text-white shadow-lg">
                  <FileText className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">📄 Articles</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Extract key insights from long articles and blog posts in seconds. Perfect for research and quick reading.
                </p>
                <Badge variant="secondary" className="gradient-primary text-white border-0">
                  Most Popular
                </Badge>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-2xl transition-all duration-300 border-2 hover:border-pink-300 dark:hover:border-pink-700 glass-effect hover:-translate-y-2">
              <CardContent className="p-6 space-y-4">
                <div className="inline-flex p-3 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500 text-white shadow-lg">
                  <Video className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">🎥 YouTube</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Get video summaries instantly without watching hours of content. Save time and stay informed.
                </p>
                <Badge variant="secondary" className="gradient-accent text-white border-0">
                  Time Saver
                </Badge>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-2xl transition-all duration-300 border-2 hover:border-blue-300 dark:hover:border-blue-700 glass-effect hover:-translate-y-2">
              <CardContent className="p-6 space-y-4">
                <div className="inline-flex p-3 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-500 text-white shadow-lg">
                  <Type className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">📝 Text</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Condense any text content into digestible summaries. Great for documents and long-form content.
                </p>
                <Badge variant="secondary" className="gradient-secondary text-white border-0">
                  Versatile
                </Badge>
              </CardContent>
            </Card>
          </div>

          {/* Stats Section */}
          <Card className="glass-effect border-2 border-purple-200 dark:border-purple-800">
            <CardContent className="p-8">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
                <div>
                  <div className="text-4xl font-black bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">10K+</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">Summaries Generated</div>
                </div>
                <div>
                  <div className="text-4xl font-black bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">2.5s</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">Average Processing Time</div>
                </div>
                <div>
                  <div className="text-4xl font-black bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">98%</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">User Satisfaction</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
