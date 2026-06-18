import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, LineChart, ShieldCheck, CheckCircle2, User, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function IndexPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-between p-6 pb-12">
      <div className="max-w-5xl w-full space-y-16 mt-12">
        <div className="text-center space-y-6">
          <div className="inline-flex items-center justify-center p-4 bg-primary/5 rounded-full mb-4">
            <BookOpen className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold font-serif text-primary tracking-tight">CoursePulse AI</h1>
          <p className="text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Turning weekly student reflections into responsible faculty learning intelligence
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Badge variant="secondary" className="px-3 py-1 text-sm font-medium bg-primary/5 text-primary border-primary/20">Aggregated Only</Badge>
            <Badge variant="secondary" className="px-3 py-1 text-sm font-medium bg-primary/5 text-primary border-primary/20">No Grading</Badge>
            <Badge variant="secondary" className="px-3 py-1 text-sm font-medium bg-primary/5 text-primary border-primary/20">Faculty Decision-Support</Badge>
            <Badge variant="secondary" className="px-3 py-1 text-sm font-medium bg-primary/5 text-primary border-primary/20">Privacy-Preserving MVP</Badge>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card className="border-none shadow-md bg-card/50">
            <CardContent className="p-8 space-y-4">
              <div className="p-3 bg-secondary/10 w-fit rounded-lg mb-2">
                <User className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold">1. Students submit low-stakes reflections</h3>
              <p className="text-muted-foreground leading-relaxed">
                Weekly, anonymous at the pattern level, no judgment. Students share what clicked and what didn't.
              </p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-md bg-card/50">
            <CardContent className="p-8 space-y-4">
              <div className="p-3 bg-primary/10 w-fit rounded-lg mb-2">
                <LineChart className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">2. AI maps reflections to course learning signals</h3>
              <p className="text-muted-foreground leading-relaxed">
                A rule-based classifier identifies Comprehension, Confusion, Transfer Gaps, Pacing, and more.
              </p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-md bg-card/50">
            <CardContent className="p-8 space-y-4">
              <div className="p-3 bg-secondary/10 w-fit rounded-lg mb-2">
                <Users className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold">3. Faculty use aggregated insights to adjust instruction</h3>
              <p className="text-muted-foreground leading-relaxed">
                No individual data, no ranking, no surveillance. Just actionable patterns to improve teaching.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="max-w-3xl mx-auto space-y-8 pt-8">
          <div className="grid md:grid-cols-2 gap-6">
            <Link href="/student">
              <Card className="hover:border-primary/40 hover:shadow-lg transition-all cursor-pointer group h-full">
                <CardContent className="p-10 flex flex-col items-center text-center space-y-4">
                  <div className="p-4 bg-secondary/10 rounded-full group-hover:bg-secondary/20 transition-colors">
                    <BookOpen className="w-10 h-10 text-secondary" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">Student Reflection Portal</h2>
                </CardContent>
              </Card>
            </Link>

            <Link href="/faculty-login">
              <Card className="hover:border-primary/40 hover:shadow-lg transition-all cursor-pointer group h-full">
                <CardContent className="p-10 flex flex-col items-center text-center space-y-4">
                  <div className="p-4 bg-primary/10 rounded-full group-hover:bg-primary/20 transition-colors">
                    <LineChart className="w-10 h-10 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">Faculty Dashboard</h2>
                </CardContent>
              </Card>
            </Link>
          </div>
          <div className="text-center">
            <Link href="/governance" className="text-base font-medium text-primary hover:text-primary/80 transition-colors">
              View Governance Note &rarr;
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-3xl w-full mt-24 text-center space-y-3">
        <ShieldCheck className="w-6 h-6 text-muted-foreground mx-auto" />
        <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
          CoursePulse AI shows aggregated instructional patterns only. It does not grade, rank, predict failure, or evaluate individual students.
        </p>
        <Link href="/governance" className="text-sm font-medium text-muted-foreground hover:text-foreground underline underline-offset-4">
          Read Responsible Use Policy
        </Link>
      </div>
    </div>
  );
}
