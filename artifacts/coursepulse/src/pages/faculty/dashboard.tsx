import { useState } from "react";
import { FacultyLayout } from "@/components/faculty-layout";
import { useGetFacultyDashboard, getGetFacultyDashboardQueryKey } from "@workspace/api-client-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Users, TrendingUp, AlertTriangle, LifeBuoy, Filter, X, 
  Activity, BookOpen, Lightbulb, FileText, ArrowRight, CheckCircle2, 
  ShieldCheck
} from "lucide-react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, ReferenceLine
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function FacultyDashboardPage() {
  const [weekFilter, setWeekFilter] = useState<string | null>(null);
  const [topicFilter, setTopicFilter] = useState<string | null>(null);
  const [signalFilter, setSignalFilter] = useState<string | null>(null);

  const { data: stats, isLoading } = useGetFacultyDashboard(
    {
      week: weekFilter ? parseInt(weekFilter, 10) : undefined,
      topic: topicFilter ?? undefined,
      signal: signalFilter ?? undefined,
    },
    {
      query: {
        queryKey: getGetFacultyDashboardQueryKey({
          week: weekFilter ? parseInt(weekFilter, 10) : undefined,
          topic: topicFilter ?? undefined,
          signal: signalFilter ?? undefined,
        }),
      },
    }
  );

  const hasActiveFilters = weekFilter || topicFilter || signalFilter;

  const clearFilters = () => {
    setWeekFilter(null);
    setTopicFilter(null);
    setSignalFilter(null);
  };

  const getSeverityColor = (severity: number) => {
    if (severity < 1) return "bg-green-500";
    if (severity < 2) return "bg-amber-500";
    return "bg-destructive";
  };

  if (isLoading) {
    return (
      <FacultyLayout>
        <div className="space-y-6">
          <Skeleton className="h-[100px] w-full" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Skeleton className="h-[120px] w-full" />
            <Skeleton className="h-[120px] w-full" />
            <Skeleton className="h-[120px] w-full" />
            <Skeleton className="h-[120px] w-full" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Skeleton className="h-[300px] w-full" />
            <Skeleton className="h-[300px] w-full" />
          </div>
        </div>
      </FacultyLayout>
    );
  }

  if (!stats) return null;

  return (
    <FacultyLayout>
      <div className="space-y-8">
        
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold font-serif text-primary">Learning Intelligence</h1>
            <p className="text-muted-foreground mt-1">Aggregated class-wide patterns for instructional improvement.</p>
          </div>
        </div>

        {/* Filters */}
        <Card className="bg-muted/30 border-muted">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Filter className="w-4 h-4" />
                <span className="text-sm font-medium">Filter:</span>
              </div>
              
              <Select value={weekFilter || "all"} onValueChange={(val) => setWeekFilter(val === "all" ? null : val)}>
                <SelectTrigger className="w-[150px] bg-background">
                  <SelectValue placeholder="All weeks" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All weeks</SelectItem>
                  {Array.from({ length: 10 }, (_, i) => i + 1).map((w) => (
                    <SelectItem key={w} value={w.toString()}>Week {w}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={topicFilter || "all"} onValueChange={(val) => setTopicFilter(val === "all" ? null : val)}>
                <SelectTrigger className="w-[200px] bg-background">
                  <SelectValue placeholder="All topics" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All topics</SelectItem>
                  {/* Derive from topicConfusion if possible, or just unique topics */}
                  {stats.topicConfusion?.map(t => (
                    <SelectItem key={t.topic} value={t.topic}>{t.topic}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={signalFilter || "all"} onValueChange={(val) => setSignalFilter(val === "all" ? null : val)}>
                <SelectTrigger className="w-[180px] bg-background">
                  <SelectValue placeholder="All signals" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All signals</SelectItem>
                  {stats.signalDistribution?.map(s => (
                    <SelectItem key={s.signal} value={s.signal}>{s.signal}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters} className="text-muted-foreground h-9 px-3">
                  <X className="w-4 h-4 mr-1" /> Clear
                </Button>
              )}
            </div>
            {hasActiveFilters && (
              <div className="mt-3 text-sm text-primary font-medium">
                Filtered view — {stats.totalReflections} reflections
              </div>
            )}
          </CardContent>
        </Card>

        {stats.insufficientData ? (
          <Card className="bg-primary/5 border-primary/20 p-8 text-center">
            <ShieldCheck className="w-12 h-12 text-primary mx-auto mb-4 opacity-80" />
            <h3 className="text-xl font-semibold mb-2">Privacy Threshold Not Met</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Not enough reflections to display this view while preserving student privacy. (Minimum 5 reflections required)
            </p>
          </Card>
        ) : (
          <>
            {/* Weekly Learning Pulse */}
            {stats.weeklyPulse && !stats.weeklyPulse.insufficientData ? (
              <Card className="border-primary/20 shadow-sm overflow-hidden">
                <div className="bg-primary/5 border-b border-primary/10 px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-primary" />
                    <h2 className="text-lg font-bold font-serif text-primary">Weekly Learning Pulse</h2>
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Avg Confidence</p>
                      <p className="text-2xl font-bold">{stats.weeklyPulse.avgConfidence.toFixed(1)} <span className="text-sm font-normal text-muted-foreground">/ 5.0</span></p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Most Common Signal</p>
                      <Badge variant="secondary" className="text-sm">{stats.weeklyPulse.mostCommonSignal}</Badge>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Highest Concern Topic</p>
                      <p className="text-lg font-semibold truncate">{stats.weeklyPulse.highestConcernTopic || "None"}</p>
                    </div>
                    <div className="bg-primary/5 p-4 rounded-xl col-span-1 md:col-span-4 border border-primary/10">
                      <p className="text-sm font-semibold text-primary mb-1">Faculty Priority</p>
                      <p className="text-foreground">{stats.weeklyPulse.facultyPriority}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-dashed shadow-none">
                <CardContent className="p-8 text-center text-muted-foreground">
                  Weekly Pulse: Gather more reflections this week to generate the learning pulse.
                </CardContent>
              </Card>
            )}

            {/* Stat Cards - Row 1 & 2 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between space-y-0 pb-2">
                    <p className="text-sm font-medium text-muted-foreground">Total Reflections</p>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="text-2xl font-bold text-foreground">{stats.totalReflections}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between space-y-0 pb-2">
                    <p className="text-sm font-medium text-muted-foreground">Avg Confidence</p>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="text-2xl font-bold text-foreground">{stats.avgConfidenceScore.toFixed(1)} <span className="text-sm text-muted-foreground font-normal">/ 5.0</span></div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between space-y-0 pb-2">
                    <p className="text-sm font-medium text-muted-foreground">Support Requests</p>
                    <LifeBuoy className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="text-2xl font-bold text-foreground">{stats.percentRequestingSupport}%</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between space-y-0 pb-2">
                    <p className="text-sm font-medium text-muted-foreground">Top Learning Signal</p>
                    <Activity className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="text-lg font-bold text-foreground truncate mt-1">
                    <Badge variant="outline">{stats.signalDistribution?.[0]?.signal || "None"}</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="sm:col-span-2">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between space-y-0 pb-2">
                    <p className="text-sm font-medium text-muted-foreground">Highest Concern Topic</p>
                    <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="text-xl font-bold text-foreground truncate">{stats.highestConcernTopic || "None"}</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between space-y-0 pb-2">
                    <p className="text-sm font-medium text-muted-foreground">Avg Severity</p>
                    <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="text-2xl font-bold text-foreground">{stats.avgSeverity?.toFixed(1) || "0.0"} <span className="text-sm text-muted-foreground font-normal">/ 3.0</span></div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between space-y-0 pb-2">
                    <p className="text-sm font-medium text-muted-foreground">Actions Recorded</p>
                    <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="text-2xl font-bold text-foreground">{stats.totalInstructionalActions || 0}</div>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Signal Distribution</CardTitle>
                  <CardDescription>Classified learning signals across reflections</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats.signalDistribution} margin={{ top: 20, right: 30, left: 20, bottom: 25 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                      <XAxis 
                        dataKey="signal" 
                        tick={{fontSize: 11}} 
                        stroke="hsl(var(--muted-foreground))"
                        interval={0}
                        angle={-45}
                        textAnchor="end"
                      />
                      <YAxis tick={{fontSize: 12}} stroke="hsl(var(--muted-foreground))" />
                      <Tooltip 
                        contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                        itemStyle={{ color: 'hsl(var(--foreground))' }}
                        cursor={{ fill: 'hsl(var(--muted))' }}
                      />
                      <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} maxBarSize={50} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Confidence Trend</CardTitle>
                  <CardDescription>Average student confidence score by week</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={stats.confidenceTrend} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                      <XAxis dataKey="week" tickFormatter={(v) => `W${v}`} tick={{fontSize: 12}} stroke="hsl(var(--muted-foreground))" />
                      <YAxis domain={[0, 5]} ticks={[1, 2, 3, 4, 5]} tick={{fontSize: 12}} stroke="hsl(var(--muted-foreground))" />
                      <ReferenceLine y={3} stroke="hsl(var(--muted-foreground))" strokeDasharray="3 3" label={{ position: 'top', value: 'Target (3.0)', fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                        labelFormatter={(v) => `Week ${v}`}
                      />
                      <Line type="monotone" dataKey="avgConfidence" name="Avg Confidence" stroke="hsl(var(--secondary))" strokeWidth={3} dot={{r: 4, fill: "hsl(var(--secondary))", strokeWidth: 0}} activeDot={{r: 6}} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Topic Confusion Table */}
            <Card>
              <CardHeader>
                <CardTitle>Topic Confusion Heatmap</CardTitle>
                <CardDescription>Topics ordered by highest confusion severity (0-3 scale)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-muted/50 text-muted-foreground border-y">
                      <tr>
                        <th className="px-4 py-3 font-medium">Topic</th>
                        <th className="px-4 py-3 font-medium">Reflections</th>
                        <th className="px-4 py-3 font-medium w-1/3">Avg Severity</th>
                        <th className="px-4 py-3 font-medium text-right">Dominant Signal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {stats.topicConfusion?.map((item, i) => (
                        <tr key={i} className="hover:bg-muted/30 transition-colors">
                          <td className="px-4 py-4 font-medium text-foreground">{item.topic}</td>
                          <td className="px-4 py-4 text-muted-foreground">{item.count}</td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-3">
                              <span className="w-8 font-medium">{item.avgSeverity.toFixed(1)}</span>
                              <div className="w-full max-w-[120px] h-2.5 bg-muted rounded-full overflow-hidden">
                                <div 
                                  className={`h-full ${getSeverityColor(item.avgSeverity)}`}
                                  style={{ width: `${Math.min((item.avgSeverity / 3) * 100, 100)}%` }}
                                />
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-right">
                            <Badge variant="outline" className="bg-background">
                              {item.mostCommonSignal}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                      {(!stats.topicConfusion || stats.topicConfusion.length === 0) && (
                        <tr>
                          <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">No data available yet</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Top Themes */}
            {stats.topConfusionThemes && stats.topConfusionThemes.length > 0 && (
              <div className="space-y-4 pt-4">
                <h3 className="text-xl font-bold font-serif text-primary">Top Learning Themes This Period</h3>
                <div className="grid grid-cols-1 gap-3">
                  {stats.topConfusionThemes.map((theme, i) => (
                    <Card key={i} className="bg-muted/20 border-muted">
                      <CardContent className="p-4 flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                        <p className="text-foreground leading-relaxed">{theme}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Recommended Adjustments */}
            {stats.recommendedAdjustments && stats.recommendedAdjustments.length > 0 && (
              <div className="space-y-4 pt-6">
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="w-6 h-6 text-primary" />
                  <h3 className="text-xl font-bold font-serif text-primary">Recommended Instructional Adjustments</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {stats.recommendedAdjustments.map((adj, i) => (
                    <Card key={i} className="border-primary/20 bg-primary/5">
                      <CardContent className="p-6 space-y-4">
                        <div className="flex justify-between items-start">
                          <Badge variant="secondary" className="mb-2">{adj.topic}</Badge>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground mb-1">Pattern detected:</p>
                          <p className="text-foreground text-sm">{adj.pattern}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-primary mb-1">Recommended action:</p>
                          <p className="text-foreground font-medium">{adj.action}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground italic">Why this helps: {adj.rationale}</p>
                        </div>
                        {adj.learningObjective && (
                          <div className="pt-2 border-t border-primary/10">
                            <p className="text-xs text-muted-foreground">Related Objective: {adj.learningObjective}</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-10 pb-6 flex justify-center border-t">
              <Link href="/faculty/report">
                <Button size="lg" className="px-8 font-medium">
                  <FileText className="w-4 h-4 mr-2" />
                  View Course Learning Intelligence Report
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>

          </>
        )}
      </div>
    </FacultyLayout>
  );
}
