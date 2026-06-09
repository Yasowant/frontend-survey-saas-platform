// import { createFileRoute } from "@tanstack/react-router";
// import { useSurveyAnalytics } from "@/features/analytics/hooks/useSurveyAnalytics";

// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";

// import { Users, LayoutGrid, FileQuestion, TrendingUp, BarChart3, Share2 } from "lucide-react";

// export const Route = createFileRoute("/_app/surveys/$surveyId/analytics")({
//   component: SurveyAnalytics,
// });

// function StatCard({
//   title,
//   value,
//   icon: Icon,
// }: {
//   title: string;
//   value: number | string;
//   icon: React.ElementType;
// }) {
//   return (
//     <Card className="transition-all hover:shadow-md">
//       <CardContent className="p-6">
//         <div className="flex items-center justify-between">
//           <div>
//             <p className="text-sm text-muted-foreground">{title}</p>

//             <h2 className="mt-2 text-3xl font-bold tracking-tight">{value}</h2>
//           </div>

//           <div className="rounded-xl bg-primary/10 p-3">
//             <Icon className="h-6 w-6 text-primary" />
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   );
// }

// function SurveyAnalytics() {
//   const { surveyId } = Route.useParams();

//   const { data, isLoading } = useSurveyAnalytics(surveyId);

//   const analytics = data?.data;

//   if (isLoading) {
//     return (
//       <div className="flex h-[500px] items-center justify-center">
//         <div className="space-y-3 text-center">
//           <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
//           <p className="text-muted-foreground">Loading analytics...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!analytics) {
//     return <div className="flex h-[500px] items-center justify-center">Analytics not found</div>;
//   }

//   const hasResponses = analytics.totalResponses > 0;

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <Card className="border-none bg-gradient-to-r from-primary/10 via-primary/5 to-background shadow-sm">
//         <CardContent className="p-8">
//           <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
//             <div>
//               <h1 className="text-3xl font-bold tracking-tight">{analytics.surveyTitle}</h1>

//               <p className="mt-2 text-muted-foreground">
//                 Monitor survey performance and response insights in real time.
//               </p>
//             </div>

//             <Badge variant="secondary" className="w-fit px-4 py-2">
//               Analytics Dashboard
//             </Badge>
//           </div>
//         </CardContent>
//       </Card>

//       {/* KPI Cards */}
//       <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
//         <StatCard title="Total Responses" value={analytics.totalResponses} icon={Users} />

//         <StatCard title="Sections" value={analytics.totalSections} icon={LayoutGrid} />

//         <StatCard title="Questions" value={analytics.totalQuestions} icon={FileQuestion} />

//         <StatCard
//           title="Completion Rate"
//           value={analytics.totalResponses > 0 ? "100%" : "0%"}
//           icon={TrendingUp}
//         />
//       </div>

//       {/* Analytics Content */}
//       {hasResponses ? (
//         <>
//           {/* Charts Placeholder */}
//           <div className="grid gap-6 lg:grid-cols-2">
//             <Card>
//               <CardHeader>
//                 <CardTitle>Response Activity</CardTitle>
//               </CardHeader>

//               <CardContent>
//                 <div className="flex h-[300px] items-center justify-center rounded-lg border border-dashed">
//                   <div className="text-center">
//                     <BarChart3 className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
//                     <p className="text-muted-foreground">Response trend chart goes here</p>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>

//             <Card>
//               <CardHeader>
//                 <CardTitle>Survey Performance</CardTitle>
//               </CardHeader>

//               <CardContent>
//                 <div className="flex h-[300px] items-center justify-center rounded-lg border border-dashed">
//                   <div className="text-center">
//                     <TrendingUp className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
//                     <p className="text-muted-foreground">Analytics chart goes here</p>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>

//           {/* Responses Table */}
//           <Card>
//             <CardHeader>
//               <CardTitle>Recent Responses</CardTitle>
//             </CardHeader>

//             <CardContent>
//               <div className="flex h-[250px] items-center justify-center rounded-lg border border-dashed">
//                 <p className="text-muted-foreground">Responses table goes here</p>
//               </div>
//             </CardContent>
//           </Card>
//         </>
//       ) : (
//         <Card>
//           <CardContent className="flex flex-col items-center py-20">
//             <div className="rounded-full bg-primary/10 p-6">
//               <BarChart3 className="h-12 w-12 text-primary" />
//             </div>

//             <h2 className="mt-6 text-2xl font-semibold">No responses yet</h2>

//             <p className="mt-3 max-w-md text-center text-muted-foreground">
//               Your survey is ready to collect feedback. Share it with your audience and analytics
//               will appear here automatically.
//             </p>

//             <Button className="mt-8 gap-2">
//               <Share2 className="h-4 w-4" />
//               Share Survey
//             </Button>
//           </CardContent>
//         </Card>
//       )}
//     </div>
//   );
// }
import { createFileRoute } from "@tanstack/react-router";
import { useSurveyAnalytics } from "@/features/analytics/hooks/useSurveyAnalytics";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

import { Users, LayoutGrid, FileQuestion, TrendingUp, Calendar, User } from "lucide-react";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export const Route = createFileRoute("/_app/surveys/$surveyId/analytics")({
  component: SurveyAnalytics,
});

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"];

function StatCard({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value: string | number;
  icon: React.ElementType;
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>

            <h2 className="mt-2 text-3xl font-bold">{value}</h2>
          </div>

          <div className="rounded-xl bg-primary/10 p-3">
            <Icon className="h-6 w-6 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function SurveyAnalytics() {
  const { surveyId } = Route.useParams();

  const { data, isLoading } = useSurveyAnalytics(surveyId);

  const analytics = data?.data;

  if (isLoading) {
    return (
      <div className="flex h-[500px] items-center justify-center">
        <div className="space-y-3 text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p>Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return <div className="flex h-[500px] items-center justify-center">Analytics not found</div>;
  }

  const questionTypeData = Object.entries(analytics.questionTypeStats).map(([name, value]) => ({
    name,
    value,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-none bg-gradient-to-r from-primary/10 via-primary/5 to-background">
        <CardContent className="p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold">{analytics.surveyTitle}</h1>

              <p className="mt-2 text-muted-foreground">{analytics.surveyDescription}</p>
            </div>

            <Badge className="w-fit">{analytics.status}</Badge>
          </div>
        </CardContent>
      </Card>

      {/* KPI */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total Responses" value={analytics.totalResponses} icon={Users} />

        <StatCard title="Sections" value={analytics.totalSections} icon={LayoutGrid} />

        <StatCard title="Questions" value={analytics.totalQuestions} icon={FileQuestion} />

        <StatCard
          title="Completion Rate"
          value={`${analytics.completionRate}%`}
          icon={TrendingUp}
        />
      </div>

      {/* Survey Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Survey Overview</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <div>
            <div className="mb-2 flex justify-between">
              <span className="text-sm font-medium">Completion Rate</span>

              <span className="text-sm text-muted-foreground">{analytics.completionRate}%</span>
            </div>

            <Progress value={analytics.completionRate} />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm text-muted-foreground">Created At</p>

              <p className="font-medium">{new Date(analytics.createdAt).toLocaleDateString()}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Last Updated</p>

              <p className="font-medium">{new Date(analytics.updatedAt).toLocaleDateString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Response Trend</CardTitle>
          </CardHeader>

          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analytics.responseTrend}>
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey="date" />

                <YAxis />

                <Tooltip />

                <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Question Type Distribution</CardTitle>
          </CardHeader>

          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={questionTypeData} dataKey="value" nameKey="name" outerRadius={100} label>
                  {questionTypeData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>

                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Responses */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Responses</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            {analytics.recentResponses.map((response: any) => (
              <div
                key={response.id}
                className="flex items-center justify-between rounded-xl border p-4 transition hover:bg-muted/50"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <User className="h-6 w-6 text-primary" />
                  </div>

                  <div>
                    <div className="font-semibold">{response.respondentName}</div>

                    <div className="text-sm text-muted-foreground">{response.respondentEmail}</div>

                    <div className="mt-1 text-xs text-muted-foreground">
                      Response #{response.responseNumber}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <Badge variant="secondary">Completed</Badge>

                  <div className="mt-2 text-sm text-muted-foreground">
                    {new Date(response.submittedAt).toLocaleDateString()}
                  </div>

                  <div className="text-xs text-muted-foreground">
                    {new Date(response.submittedAt).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default SurveyAnalytics;
