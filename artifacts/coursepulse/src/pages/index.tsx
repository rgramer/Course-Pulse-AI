import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, LineChart, ShieldCheck } from "lucide-react";

export default function IndexPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div className="max-w-3xl w-full space-y-12">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center p-3 bg-primary/5 rounded-full mb-4">
            <BookOpen className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-primary">CoursePulse AI</h1>
          <p className="text-xl text-muted-foreground max-w-xl mx-auto">
            A responsible AI-powered learning intelligence tool for faculty.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Link href="/student">
            <Card className="hover:border-primary/50 transition-colors cursor-pointer group h-full">
              <CardContent className="p-8 flex flex-col items-center text-center space-y-4">
                <div className="p-4 bg-secondary/10 rounded-full group-hover:bg-secondary/20 transition-colors">
                  <BookOpen className="w-8 h-8 text-secondary" />
                </div>
                <h2 className="text-2xl font-semibold">Student</h2>
                <p className="text-muted-foreground">
                  Submit your weekly reflection to help improve the course experience for everyone.
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/faculty-login">
            <Card className="hover:border-primary/50 transition-colors cursor-pointer group h-full">
              <CardContent className="p-8 flex flex-col items-center text-center space-y-4">
                <div className="p-4 bg-primary/10 rounded-full group-hover:bg-primary/20 transition-colors">
                  <LineChart className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-2xl font-semibold">Faculty</h2>
                <p className="text-muted-foreground">
                  View aggregated class-wide learning patterns and make data-informed instructional adjustments.
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>

        <div className="bg-muted/50 border rounded-xl p-6 text-center space-y-3">
          <ShieldCheck className="w-6 h-6 text-primary mx-auto opacity-80" />
          <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
            CoursePulse AI is designed for faculty decision-support, not surveillance. We use aggregated data to surface learning patterns. No individual student predictions, grades, or diagnostics are produced.
          </p>
          <div>
            <Link href="/governance" className="text-sm font-medium text-primary hover:underline">
              Read our full Responsible Use Statement &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
