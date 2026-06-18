import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { BookOpen, ArrowRight, ShieldCheck } from "lucide-react";

export default function StudentIndexPage() {
  return (
    <div className="min-h-screen bg-background p-6 flex items-center justify-center">
      <div className="max-w-2xl mx-auto space-y-10 text-center">
        
        <div className="space-y-4">
          <div className="inline-flex items-center justify-center p-3 bg-secondary/10 rounded-full mb-2">
            <BookOpen className="w-8 h-8 text-secondary" />
          </div>
          <h1 className="text-4xl font-bold text-primary">Course Reflection</h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Take a few minutes to reflect on this week's material. Your feedback helps adjust the course pacing and clarify complex topics for the whole class.
          </p>
        </div>

        <div className="bg-card border shadow-sm rounded-xl p-8 text-left space-y-6">
          <div className="flex items-start gap-4">
            <ShieldCheck className="w-6 h-6 text-primary mt-1 shrink-0" />
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">How your data is used</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Your reflection is processed by CoursePulse AI to find class-wide themes (e.g., "Many students are struggling with recursive functions"). 
                The instructor only sees aggregated patterns, not your individual submission or name.
              </p>
              <ul className="text-sm text-muted-foreground list-disc list-inside pl-1 space-y-1 mt-2">
                <li>Not used for grading or ranking</li>
                <li>Not used for surveillance or failure prediction</li>
                <li>Used exclusively to improve the course experience</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="pt-4">
          <Link href="/student/submit">
            <Button size="lg" className="w-full sm:w-auto text-lg px-8">
              Start Reflection <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
