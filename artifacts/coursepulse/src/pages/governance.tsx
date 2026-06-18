import { Link } from "wouter";
import { ShieldCheck, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GovernancePage() {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-3xl mx-auto pt-12 pb-24 space-y-8">
        <Link href="/" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-8">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>
        
        <div className="space-y-4 border-b pb-8">
          <div className="inline-flex items-center justify-center p-3 bg-primary/5 rounded-full">
            <ShieldCheck className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-primary">Responsible Use Statement</h1>
          <p className="text-xl text-muted-foreground">
            Our commitment to ethical, privacy-preserving educational technology.
          </p>
        </div>

        <div className="prose prose-slate prose-lg max-w-none text-foreground/80">
          <p className="lead font-medium text-foreground">
            CoursePulse AI Responsible Use Statement:
          </p>
          <p>
            CoursePulse AI is designed as a faculty decision-support tool, not a grading, ranking, surveillance, or disciplinary system. Student reflections are used to identify class-wide learning patterns connected to course topics and learning objectives. 
          </p>
          <p>
            The system does not evaluate individual students, predict failure, diagnose mental health concerns, or replace faculty judgment. Faculty should use the dashboard only to improve instruction, adjust pacing, clarify confusing topics, and provide additional support resources. 
          </p>
          <p>
            Data governance, retention policy, and student access rights are determined by institutional policy. This system supports the instructor's professional judgment, not surveillance.
          </p>
        </div>
        
        <div className="pt-8 border-t">
          <Link href="/">
            <Button variant="outline">Return Home</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
