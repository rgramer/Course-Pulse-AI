import { useEffect, useState } from "react";
import { Link } from "wouter";
import { CheckCircle2, Home, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CoursePulseLogo } from "@/components/logo";

interface SignalResult {
  primarySignal: string;
  secondarySignal: string | null;
  severityScore: number;
  themeSummary: string;
  recommendedAction: string;
}

const SIGNAL_STUDENT_COPY: Record<string, { color: string; description: string }> = {
  "Comprehension": {
    color: "bg-green-100 text-green-800 border-green-200",
    description: "Your reflection suggests you're following the material well. Your confidence helps the class pattern too.",
  },
  "Engagement Signal": {
    color: "bg-teal-100 text-teal-800 border-teal-200",
    description: "Your reflection shows strong curiosity or interest in the topic. That energy shows up in the class-wide picture.",
  },
  "Application Gap": {
    color: "bg-amber-100 text-amber-800 border-amber-200",
    description: "Your reflection suggests the class could use more hands-on practice or worked examples to apply this concept.",
  },
  "Transfer Gap": {
    color: "bg-amber-100 text-amber-800 border-amber-200",
    description: "Your reflection suggests the class could benefit from more real-world examples or connections to prior topics.",
  },
  "Definitional Confusion": {
    color: "bg-orange-100 text-orange-800 border-orange-200",
    description: "Your reflection suggests some key terms or definitions could use more clarification in the next session.",
  },
  "Pacing Concern": {
    color: "bg-orange-100 text-orange-800 border-orange-200",
    description: "Your reflection suggests the class may need more time or a slower pace on this topic.",
  },
  "Support Need": {
    color: "bg-red-100 text-red-800 border-red-200",
    description: "Your reflection suggests the class could benefit from additional resources or support on this material.",
  },
};

export default function StudentThankYouPage() {
  const [signal, setSignal] = useState<SignalResult | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("cp_last_signal");
    if (stored) {
      try {
        setSignal(JSON.parse(stored));
      } catch {
        // ignore
      }
      sessionStorage.removeItem("cp_last_signal");
    }
  }, []);

  const signalStyle = signal ? (SIGNAL_STUDENT_COPY[signal.primarySignal] ?? {
    color: "bg-muted text-foreground border-border",
    description: "Your reflection has been included in the class-wide learning pattern.",
  }) : null;

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 gap-8">
      <CoursePulseLogo size="sm" />

      <div className="max-w-lg w-full bg-card border shadow-lg rounded-3xl p-10 text-center space-y-8">
        <div className="inline-flex items-center justify-center p-5 bg-green-100 text-green-600 rounded-full">
          <CheckCircle2 className="w-16 h-16" />
        </div>

        <h1 className="text-4xl font-bold font-serif text-primary">Thank you for your reflection.</h1>

        {signal && signalStyle ? (
          <div className="space-y-4 text-left">
            <div className="flex items-center gap-2 justify-center">
              <Sparkles className="w-4 h-4 text-primary" />
              <p className="text-sm font-semibold text-primary uppercase tracking-wide">Learning signal detected</p>
            </div>
            <div className={`border rounded-2xl px-5 py-4 space-y-2 ${signalStyle.color}`}>
              <div className="flex items-center gap-2">
                <Badge className={`text-sm font-semibold border ${signalStyle.color}`}>
                  {signal.primarySignal}
                </Badge>
                {signal.secondarySignal && (
                  <Badge variant="outline" className="text-xs text-muted-foreground">
                    + {signal.secondarySignal}
                  </Badge>
                )}
              </div>
              <p className="text-sm leading-relaxed">{signalStyle.description}</p>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed text-center px-2">
              This signal is aggregated with the rest of the class — your individual response is never shown to your instructor. It is not used for grading, ranking, or any individual evaluation.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-foreground text-lg leading-relaxed">
              Your reflection has been included in class-wide course improvement analytics.
            </p>
            <p className="text-muted-foreground text-sm font-medium">
              This submission will not be used for grading, ranking, failure prediction, or surveillance.
            </p>
          </div>
        )}

        <div className="pt-6 border-t border-border/50">
          <Link href="/">
            <Button size="lg" variant="default" className="w-full sm:w-auto px-8" data-testid="return-home-btn">
              <Home className="w-5 h-5 mr-2" /> Return Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
