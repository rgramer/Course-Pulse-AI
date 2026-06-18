import { Link } from "wouter";
import { CheckCircle2, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function StudentThankYouPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full bg-card border rounded-2xl p-8 text-center space-y-6 shadow-sm">
        <div className="inline-flex items-center justify-center p-4 bg-green-50 text-green-600 rounded-full mb-2">
          <CheckCircle2 className="w-12 h-12" />
        </div>
        
        <h1 className="text-3xl font-bold text-primary">Thank You</h1>
        
        <div className="p-4 bg-muted/50 rounded-lg text-left">
          <p className="text-muted-foreground text-sm leading-relaxed font-medium">
            Your reflection has been included in class-wide course improvement analytics. This submission will not be used for grading, ranking, failure prediction, or surveillance.
          </p>
        </div>
        
        <div className="pt-4">
          <Link href="/">
            <Button variant="outline" className="w-full">
              <Home className="w-4 h-4 mr-2" /> Return to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
