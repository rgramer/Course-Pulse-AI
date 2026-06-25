import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, LineChart, ShieldCheck, User, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CoursePulseLogo } from "@/components/logo";

export default function IndexPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center p-6 pb-16">
      <div className="max-w-5xl w-full space-y-16 mt-12">
        <div className="text-center space-y-6">
          <div className="flex justify-center mb-8">
            <CoursePulseLogo size="lg" showTagline={true} />
          </div>
          <p className="text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Turning weekly student reflections into responsible faculty learning intelligence
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Badge variant="secondary" className="px-3 py-1 text-sm font-medium bg-primary/8 text-primary border-primary/20">Aggregated Only</Badge>
            <Badge variant="secondary" className="px-3 py-1 text-sm font-medium bg-primary/8 text-primary border-primary/20">No Grading</Badge>
            <Badge variant="secondary" className="px-3 py-1 text-sm font-medium bg-primary/8 text-primary border-primary/20">Faculty Decision-Support</Badge>
            <Badge variant="secondary" className="px-3 py-1 text-sm font-medium bg-primary/8 text-primary border-primary/20">Privacy-Preserving MVP</Badge>
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

        <div className="max-w-3xl mx-auto space-y-6 pt-4">
          <div className="grid md:grid-cols-3 gap-5">
            {/* Student card — light teal */}
            <Link href="/student">
              <div className="group rounded-2xl border-2 border-teal-200 bg-teal-50 p-7 cursor-pointer transition-all duration-200 hover:border-teal-400 hover:bg-teal-100 hover:shadow-lg hover:-translate-y-0.5 flex flex-col items-center text-center space-y-3 h-full">
                <div className="p-4 rounded-full bg-teal-500 group-hover:bg-teal-600 transition-colors">
                  <BookOpen className="w-7 h-7 text-white" />
                </div>
                <h2 className="text-xl font-serif font-bold text-teal-900">Student Reflection Portal</h2>
                <p className="text-sm text-teal-700 leading-relaxed">Submit your weekly reflection on course material and pacing.</p>
                <div className="mt-auto pt-2 px-5 py-2 rounded-full bg-teal-500 text-white text-sm font-semibold group-hover:bg-teal-600 transition-colors w-full text-center">
                  Enter Student Portal &rarr;
                </div>
              </div>
            </Link>

            {/* Faculty card — NYU Violet */}
            <Link href="/faculty-login">
              <div className="group rounded-2xl border-2 border-primary/30 bg-primary/5 p-7 cursor-pointer transition-all duration-200 hover:border-primary/60 hover:bg-primary/10 hover:shadow-lg hover:-translate-y-0.5 flex flex-col items-center text-center space-y-3 h-full">
                <div className="p-4 rounded-full bg-primary group-hover:bg-[#330662] transition-colors">
                  <LineChart className="w-7 h-7 text-white" />
                </div>
                <h2 className="text-xl font-serif font-bold text-primary">Faculty Dashboard</h2>
                <p className="text-sm text-primary/70 leading-relaxed">Review aggregated class-wide learning patterns and signals.</p>
                <div className="mt-auto pt-2 px-5 py-2 rounded-full bg-primary text-white text-sm font-semibold group-hover:bg-[#330662] transition-colors w-full text-center">
                  Enter Faculty Dashboard &rarr;
                </div>
              </div>
            </Link>

            {/* Governance card — neutral slate */}
            <Link href="/governance">
              <div className="group rounded-2xl border-2 border-slate-200 bg-slate-50 p-7 cursor-pointer transition-all duration-200 hover:border-slate-400 hover:bg-slate-100 hover:shadow-lg hover:-translate-y-0.5 flex flex-col items-center text-center space-y-3 h-full">
                <div className="p-4 rounded-full bg-slate-500 group-hover:bg-slate-600 transition-colors">
                  <ShieldCheck className="w-7 h-7 text-white" />
                </div>
                <h2 className="text-xl font-serif font-bold text-slate-800">Governance Note</h2>
                <p className="text-sm text-slate-600 leading-relaxed">Read our responsible use statement and ethics commitments.</p>
                <div className="mt-auto pt-2 px-5 py-2 rounded-full bg-slate-500 text-white text-sm font-semibold group-hover:bg-slate-600 transition-colors w-full text-center">
                  View Governance Note &rarr;
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer — governance note */}
      <div className="max-w-3xl w-full mt-16 text-center space-y-3">
        <div className="flex items-center justify-center gap-2 text-muted-foreground">
          <ShieldCheck className="w-5 h-5 shrink-0" />
          <p className="text-sm max-w-2xl">
            CoursePulse AI shows aggregated instructional patterns only. It does not grade, rank, predict failure, or evaluate individual students.
          </p>
        </div>
        <Link href="/governance" className="text-sm font-medium text-muted-foreground hover:text-foreground underline underline-offset-4">
          Read Responsible Use Policy
        </Link>
      </div>

      {/* Footer — NYU institutional branding */}
      <div className="w-full mt-12 border-t bg-[#57068C]">
        <div className="max-w-5xl mx-auto px-8 py-10 flex flex-col md:flex-row items-center md:items-start justify-between gap-8">
          {/* NYU logo lockup */}
          <div className="flex items-center gap-4">
            <span className="text-5xl font-bold text-white leading-none tracking-tight" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
              NYU
            </span>
            <div className="flex flex-col gap-0.5">
              <span className="text-white text-sm font-semibold tracking-wide leading-tight">New York University</span>
              <span className="text-white/70 text-xs tracking-wide leading-tight">School of Professional Studies</span>
            </div>
          </div>

          {/* Divider — desktop only */}
          <div className="hidden md:block w-px self-stretch bg-white/20" />

          {/* Course + team */}
          <div className="flex flex-col items-center md:items-end gap-1 text-right">
            <p className="text-white font-semibold text-sm tracking-wide">
              Emerging Technologies &mdash; Summer 2026
            </p>
            <p className="text-white/70 text-sm">
              MS in Management &amp; Analytics
            </p>
            <p className="text-white/50 text-xs mt-2">
              Angelah Laba &middot; Russel Gramer &middot; Matthew Lukacs &middot; David Petrusev
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
