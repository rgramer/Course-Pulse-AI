import { FacultyLayout } from "@/components/faculty-layout";
import { useGetFacultyReport } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  ArrowLeft, ShieldCheck, FileText, AlertTriangle, 
  TrendingUp, Users, Target, BookOpen, Clock, Activity,
  ArrowRight
} from "lucide-react";

export default function FacultyReportPage() {
  const { data: report, isLoading } = useGetFacultyReport();

  if (isLoading) {
    return (
      <FacultyLayout>
        <div className="space-y-6">
          <Skeleton className="h-[100px] w-full" />
          <Skeleton className="h-[200px] w-full" />
          <Skeleton className="h-[400px] w-full" />
        </div>
      </FacultyLayout>
    );
  }

  if (!report) return null;

  return (
    <FacultyLayout>
      <div className="space-y-10 max-w-5xl mx-auto pb-12">
        <Link href="/faculty/dashboard">
          <Button variant="ghost" className="mb-2 -ml-4 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>

        {/* Header */}
        <div className="space-y-4 border-b pb-8">
          <div className="flex items-center justify-between">
            <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 mb-2">
              Faculty Decision-Support Tool
            </Badge>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              Generated: {new Date(report.generatedAt).toLocaleString()}
            </div>
          </div>
          <h1 className="text-4xl font-bold font-serif text-primary">Course Learning Intelligence Report</h1>
          <p className="text-xl text-muted-foreground">
            Aggregated class-wide patterns — for instructional improvement only
          </p>
        </div>

        {/* Summary Stats row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-muted/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <Users className="w-5 h-5 text-muted-foreground" />
                <p className="font-medium text-muted-foreground">Total Reflections</p>
              </div>
              <p className="text-3xl font-bold">{report.totalReflections}</p>
            </CardContent>
          </Card>
          <Card className="bg-muted/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="w-5 h-5 text-muted-foreground" />
                <p className="font-medium text-muted-foreground">Avg Confidence</p>
              </div>
              <p className="text-3xl font-bold">{report.avgConfidence.toFixed(1)} <span className="text-lg font-normal text-muted-foreground">/ 5.0</span></p>
            </CardContent>
          </Card>
          <Card className="bg-muted/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <Target className="w-5 h-5 text-muted-foreground" />
                <p className="font-medium text-muted-foreground">Support Request Rate</p>
              </div>
              <p className="text-3xl font-bold">{report.supportRate.toFixed(1)}%</p>
            </CardContent>
          </Card>
        </div>

        {/* Narratives */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" /> Confidence Trend Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground leading-relaxed">{report.confidenceTrendSummary}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-muted-foreground" /> Support Needs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">{report.supportNeedsSummary}</p>
            </CardContent>
          </Card>
        </div>

        {/* Topics lists */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="text-xl font-serif font-bold flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-destructive" /> Most Confusing Topics
            </h3>
            {report.mostConfusingTopics.length === 0 ? (
              <p className="text-muted-foreground italic">No confusing topics identified yet.</p>
            ) : (
              <div className="space-y-3">
                {report.mostConfusingTopics.map((topic, i) => (
                  <Card key={i} className="border-l-4" style={{ borderLeftColor: topic.avgSeverity >= 2 ? 'hsl(var(--destructive))' : '#f59e0b' }}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-foreground">{topic.topic}</h4>
                        <Badge variant="outline">{topic.dominantSignal}</Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Severity: <strong className="text-foreground">{topic.avgSeverity.toFixed(1)}</strong>/3</span>
                        <span>{topic.count} reflections</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-serif font-bold flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-secondary" /> Highest Engagement Topics
            </h3>
            {report.highestEngagementTopics.length === 0 ? (
              <p className="text-muted-foreground italic">No highly engaged topics identified yet.</p>
            ) : (
              <div className="space-y-3">
                {report.highestEngagementTopics.map((topic, i) => (
                  <Card key={i} className="border-l-4 border-secondary">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-foreground">{topic.topic}</h4>
                        <Badge variant="secondary" className="bg-secondary/10 text-secondary-foreground">{topic.dominantSignal}</Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Engagement: <strong className="text-foreground">{topic.engagementLevel}</strong></span>
                        <span>{topic.count} reflections</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Evidence of Improvement */}
        <div className="space-y-4 pt-6">
          <h3 className="text-2xl font-serif font-bold border-b pb-2">Evidence of Improvement</h3>
          {report.impactComparisons.length === 0 ? (
            <Card className="border-dashed bg-muted/20">
              <CardContent className="p-8 text-center text-muted-foreground">
                <TrendingUp className="w-8 h-8 mx-auto mb-3 opacity-50" />
                No before/after comparisons available yet — record more faculty actions and gather reflections across multiple weeks to see impact.
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {report.impactComparisons.map((impact, i) => (
                <Card key={i}>
                  <CardContent className="p-5">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <Badge variant="outline" className="mb-2">Week {impact.week} • {impact.topic}</Badge>
                        <p className="text-sm font-medium">{impact.actionTaken}</p>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-sm font-bold ${impact.improvement > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {impact.improvement > 0 ? '+' : ''}{impact.improvement}%
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm pt-3 border-t">
                      <div className="text-muted-foreground">Signal: <span className="font-medium text-foreground">{impact.signal}</span></div>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">Before: {impact.beforePct}%</span>
                        <ArrowRight className="w-3 h-3 text-muted-foreground" />
                        <span className="font-medium text-foreground">After: {impact.afterPct}%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Instructional Actions Recorded */}
        <div className="space-y-4 pt-6">
          <h3 className="text-2xl font-serif font-bold border-b pb-2">Instructional Actions Recorded</h3>
          {report.instructionalActionsRecorded.length === 0 ? (
            <p className="text-muted-foreground italic">No actions recorded in the impact tracker yet.</p>
          ) : (
            <div className="space-y-4">
              {report.instructionalActionsRecorded.map((action) => (
                <div key={action.id} className="flex gap-4 p-4 rounded-xl bg-card border">
                  <div className="shrink-0 w-12 text-center">
                    <div className="text-xs font-bold uppercase text-muted-foreground">Week</div>
                    <div className="text-xl font-serif font-bold text-foreground">{action.week}</div>
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{action.topic}</Badge>
                      <span className="text-xs text-muted-foreground">{new Date(action.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-sm font-medium text-foreground">{action.actionTaken}</p>
                    {action.reason && (
                      <p className="text-sm text-muted-foreground italic bg-muted/50 p-2 rounded">
                        Reason: {action.reason}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Responsible AI Note */}
        <div className="mt-12 bg-muted/50 border rounded-xl p-6 flex items-start gap-4">
          <ShieldCheck className="w-6 h-6 text-muted-foreground shrink-0 mt-1" />
          <div className="text-sm text-muted-foreground leading-relaxed">
            <strong className="text-foreground block mb-1">Responsible AI Note</strong>
            {report.responsibleAiNote}
          </div>
        </div>

      </div>
    </FacultyLayout>
  );
}
