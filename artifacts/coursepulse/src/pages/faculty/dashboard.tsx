import { FacultyLayout } from "@/components/faculty-layout";
import { useGetFacultyDashboard } from "@workspace/api-client-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldAlert, Users, TrendingUp, AlertTriangle, LifeBuoy } from "lucide-react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line 
} from "recharts";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";

export default function FacultyDashboardPage() {
  const { data: stats, isLoading } = useGetFacultyDashboard();

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
      <div className="space-y-6">
        
        <Alert className="bg-primary/5 border-primary/20 text-primary">
          <ShieldAlert className="h-4 w-4" />
          <AlertTitle>Governance Reminder</AlertTitle>
          <AlertDescription className="text-primary/80">
            This dashboard displays aggregated class-wide patterns for instructional improvement. Do not use for individual evaluation or surveillance.
          </AlertDescription>
        </Alert>

        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold font-serif text-primary">Learning Intelligence</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
              <div className="text-2xl font-bold text-foreground">{stats.avgConfidenceScore.toFixed(1)} / 5.0</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between space-y-0 pb-2">
                <p className="text-sm font-medium text-muted-foreground">Top Concern Topic</p>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="text-xl font-bold text-foreground truncate">{stats.highestConcernTopic || "None"}</div>
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
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Signal Distribution</CardTitle>
              <CardDescription>Classified learning signals across all reflections</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.signalDistribution} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="signal" tick={{fontSize: 12}} stroke="hsl(var(--muted-foreground))" />
                  <YAxis tick={{fontSize: 12}} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}
                    itemStyle={{ color: 'hsl(var(--foreground))' }}
                  />
                  <Bar dataKey="count" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
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
                  <YAxis domain={[0, 5]} tick={{fontSize: 12}} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}
                  />
                  <Line type="monotone" dataKey="avgConfidence" stroke="hsl(var(--chart-2))" strokeWidth={3} dot={{r: 4}} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Topic Confusion Heatmap</CardTitle>
              <CardDescription>Topics ordered by highest confusion severity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-muted text-muted-foreground">
                    <tr>
                      <th className="px-4 py-3 font-medium rounded-tl-md">Topic</th>
                      <th className="px-4 py-3 font-medium">Reflections</th>
                      <th className="px-4 py-3 font-medium">Avg Severity (0-10)</th>
                      <th className="px-4 py-3 font-medium rounded-tr-md">Dominant Signal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {stats.topicConfusion.map((item, i) => (
                      <tr key={i} className="hover:bg-muted/50 transition-colors">
                        <td className="px-4 py-3 font-medium text-foreground">{item.topic}</td>
                        <td className="px-4 py-3">{item.count}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <span className="w-8">{item.avgSeverity.toFixed(1)}</span>
                            <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-destructive" 
                                style={{ width: `${(item.avgSeverity / 10) * 100}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-secondary/10 text-secondary-foreground border border-secondary/20">
                            {item.mostCommonSignal}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {stats.topicConfusion.length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">No data available yet</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </FacultyLayout>
  );
}
