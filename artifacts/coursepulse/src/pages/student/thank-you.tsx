import { Link } from "wouter";
import { CheckCircle2, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function StudentThankYouPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 py-20">
      <div className="max-w-lg w-full bg-card border shadow-lg rounded-3xl p-10 text-center space-y-8">
        <div className="inline-flex items-center justify-center p-5 bg-secondary/10 text-secondary rounded-full mb-2">
          <CheckCircle2 className="w-16 h-16" />
        </div>
        
        <h1 className="text-4xl font-bold font-serif text-primary">Thank you for your reflection.</h1>
        
        <div className="space-y-4">
          <p className="text-foreground text-lg leading-relaxed">
            Your reflection has been included in class-wide course improvement analytics. This submission will not be used for grading, ranking, failure prediction, or surveillance.
          </p>
          <p className="text-muted-foreground text-sm font-medium">
            Your anonymized responses contribute to better instruction for the entire class.
          </p>
        </div>
        
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
