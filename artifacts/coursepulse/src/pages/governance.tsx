import { Link } from "wouter";
import { ShieldCheck, ArrowLeft, Lock, EyeOff, Scale, UserCheck, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CoursePulseLogo } from "@/components/logo";

export default function GovernancePage() {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-3xl mx-auto pt-12 pb-24 space-y-12">
        <CoursePulseLogo size="md" />
        <Link href="/" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        <div className="space-y-4 border-b pb-8">
          <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-full mb-2">
            <ShieldCheck className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold font-serif text-primary tracking-tight">Responsible Use Statement</h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Our commitment to ethical, privacy-preserving educational technology.
          </p>
        </div>

        <div className="space-y-10">
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold flex items-center gap-2">
              <Scale className="w-6 h-6 text-primary" /> Purpose of this tool
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              CoursePulse AI is designed to help faculty understand class-wide learning patterns, pacing challenges, and comprehension gaps based on weekly student reflections. It serves as a formative feedback loop to improve instructional quality — not to evaluate, rank, or surveil individual students.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold flex items-center gap-2">
              <UserCheck className="w-6 h-6 text-primary" /> What the system does
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              The system aggregates reflections, classifies text into learning signals (e.g., Comprehension, Application Gap, Pacing Concern), and surfaces overarching themes. It highlights areas where the class as a whole might need additional support or alternative explanations.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold flex items-center gap-2">
              <EyeOff className="w-6 h-6 text-destructive" /> What the system does not do
            </h2>
            <ul className="list-disc list-outside pl-6 space-y-2 text-muted-foreground leading-relaxed">
              <li>No grading of student reflections or assigning points based on content.</li>
              <li>No ranking of students based on their understanding or confidence.</li>
              <li>No failure prediction or "at-risk" student profiling.</li>
              <li>No individual surveillance — individual submissions are never linked to a student identity in the dashboard.</li>
              <li>No mental health diagnosis or behavioral profiling.</li>
              <li>No automated disciplinary actions or academic penalties.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold flex items-center gap-2">
              <Lock className="w-6 h-6 text-primary" /> Data minimization approach
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              We employ strict data minimization. The system displays only class-wide aggregated patterns. A minimum threshold of reflections is enforced before detailed charts are shown — preventing reverse-identification of individual students. No student names or identifying information are stored or displayed in the faculty dashboard.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold flex items-center gap-2">
              <FileText className="w-6 h-6 text-primary" /> Regulatory compliance posture
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              CoursePulse AI is designed with awareness of the following regulatory frameworks:
            </p>
            <ul className="list-disc list-outside pl-6 space-y-2 text-muted-foreground leading-relaxed">
              <li><strong className="text-foreground">FERPA (Family Educational Rights and Privacy Act)</strong> — Student reflections are treated as education records. No personally identifiable information is surfaced to faculty. Aggregated-only reporting is maintained throughout. Institutional administrators are responsible for ensuring FERPA-compliant data governance policies.</li>
              <li><strong className="text-foreground">GDPR</strong> — For institutions operating in or serving students in the EU, data minimization and purpose limitation principles are followed by design. Retention policy and data subject rights management are the responsibility of the deploying institution.</li>
              <li><strong className="text-foreground">NIST AI Risk Management Framework</strong> — The system is designed with Govern, Map, Measure, and Manage principles in mind: human oversight, transparency about capabilities and limitations, and faculty-in-the-loop decision-making.</li>
            </ul>
            <p className="text-sm text-muted-foreground mt-4 italic">
              Specific compliance determinations, data processing agreements, and institutional policies remain the responsibility of the deploying institution. CoursePulse AI provides privacy-by-design defaults — not legal compliance certification.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Human oversight</h2>
            <p className="text-muted-foreground leading-relaxed">
              Faculty judgment is always required. CoursePulse AI is a decision-support tool; it does not replace instructional decisions. The AI surfaces patterns, but the instructor determines the appropriate pedagogical response. No automated actions are taken based on system output.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Classroom use boundaries</h2>
            <p className="text-muted-foreground leading-relaxed">
              Insights generated by this tool are strictly for improving instruction and supporting the learning experience. They must never be used for disciplinary action, formal academic evaluation, or any purpose beyond formative course improvement.
            </p>
          </section>

          <section className="space-y-6 bg-muted/30 p-8 rounded-2xl border">
            <h2 className="text-xl font-bold font-serif">Responsible Use Statement</h2>
            <blockquote className="text-lg leading-relaxed text-foreground italic border-l-4 border-primary pl-6 py-2">
              "CoursePulse AI is designed as a faculty decision-support tool, not a grading, ranking, surveillance, or disciplinary system. Student reflections are used to identify class-wide learning patterns connected to course topics and learning objectives. The system does not evaluate individual students, predict failure, diagnose mental health concerns, or replace faculty judgment. Faculty should use the dashboard only to improve instruction, adjust pacing, clarify confusing topics, and provide additional support resources. Data governance, retention policy, and student access rights are determined by institutional policy in accordance with applicable law, including FERPA. This system supports the instructor's professional judgment, not surveillance."
            </blockquote>
          </section>
        </div>

        <div className="pt-10">
          <Link href="/">
            <Button size="lg" variant="outline" className="px-8">Return Home</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
