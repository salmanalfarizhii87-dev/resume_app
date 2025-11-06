import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center px-4">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <Card className="max-w-2xl w-full p-8 sm:p-12">
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <div className="bg-primary/10 p-4 rounded-full">
              <Sparkles className="h-12 w-12 text-primary" />
            </div>
          </div>

          <div>
            <h1 className="text-4xl sm:text-5xl font-bold mb-3">
              RingkasCepat
            </h1>
            <p className="text-xl text-muted-foreground">
              Peringkas Konten Instan Berbasis AI
            </p>
          </div>

          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            Combat information overload with instant, high-quality AI-powered summaries of articles, threads, and videos.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button asChild size="lg" className="text-lg">
              <Link href="/sign-in">Get Started</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-lg">
              <Link href="/sign-up">Create Account</Link>
            </Button>
          </div>

          <div className="pt-8 border-t">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
              <div>
                <div className="font-semibold mb-1">📄 Articles</div>
                <div className="text-muted-foreground">Extract key insights from long articles</div>
              </div>
              <div>
                <div className="font-semibold mb-1">🎥 YouTube</div>
                <div className="text-muted-foreground">Get video summaries instantly</div>
              </div>
              <div>
                <div className="font-semibold mb-1">📝 Text</div>
                <div className="text-muted-foreground">Condense any text content</div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
