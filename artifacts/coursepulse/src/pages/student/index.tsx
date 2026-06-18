import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { BookOpen, ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react";

export default function StudentIndexPage() {
  return (
    <div className="min-h-screen bg-background p-6 flex flex-col items-center py-20">
      <div className="max-w-2xl w-full mx-auto space-y-12">
        
        <div className="space-y-6 text-center">
          <div className="inline-flex items-center justify-center p-4 bg-secondary/10 rounded-full mb-2">
            <BookOpen className="w-10 h-10 text-secondary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold font-serif text-primary">Course Reflection</h1>
          <p className="text-xl text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Take a few minutes to reflect on this week's material. Your feedback helps adjust the course pacing and clarify complex topics for the whole class.
          </p>
        </div>

        <div className="bg-card border shadow-md rounded-2xl p-8 space-y-6">
          <div className="flex items-center gap-3 border-b pb-4">
            <ShieldCheck className="w-6 h-6 text-primary shrink-0" />
            <h3 className="font-semibold text-xl">How your reflection is used</h3>
          </div>
          
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
              <span className="text-foreground">Helps faculty identify class-wide learning patterns</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
              <span className="text-foreground">Not used for grading</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
              <span className="text-foreground">Not used for ranking</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
              <span className="text-foreground">Not used for failure prediction</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
              <span className="text-foreground">Not shown as an individual student profile</span>
            </li>
          </ul>
        </div>

        <div className="flex justify-center pt-4">
          <Link href="/student/submit">
            <Button size="lg" className="w-full sm:w-auto text-lg px-10 py-6 h-auto" data-testid="start-reflection-btn">
              Submit Your Reflection <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
