import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowUpRight, Badge, Download, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { BarChart3, Eye, FilePenLine, Trash2, MessageSquare } from "lucide-react";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  LineChart,
  Line,
} from "recharts";

import { useAnalytics } from "@/features/analytics/hooks/useAnalytics";

export const Route = createFileRoute("/_app/analytics")({
  component: Analytics,
});

const COLORS = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
  "var(--color-chart-5)",
];

function Analytics() {
  const navigate = useNavigate();
  const [selectedSurvey, setSelectedSurvey] = useState<any>(null);
  const [open, setOpen] = useState(false);

  const { data, isLoading } = useAnalytics();

  const analytics = data?.data;

  if (isLoading) {
    return <div className="flex h-[500px] items-center justify-center">Loading analytics...</div>;
  }

  const overview = analytics?.overview;

  const responseStats = analytics?.responseStats;

  const surveyStats = analytics?.surveyStats;

  const recentSurveys = analytics?.recentSurveys ?? [];

  console.log(recentSurveys, "Recent Survey");

  const responseTrend = analytics?.responseTrend ?? [];

  const stats = {
    surveys: overview?.totalSurveys ?? 0,
    responses: overview?.totalResponses ?? 0,
    users: overview?.totalUsers ?? 0,
    published: overview?.publishedSurveys ?? 0,
    drafts: overview?.draftSurveys ?? 0,
  };

  const surveyStatusData = [
    {
      name: "Published",
      value: overview?.publishedSurveys ?? 0,
    },
    {
      name: "Draft",
      value: overview?.draftSurveys ?? 0,
    },
  ];

  const platformData = [
    {
      name: "Surveys",
      value: overview?.totalSurveys ?? 0,
    },
    {
      name: "Responses",
      value: overview?.totalResponses ?? 0,
    },
    {
      name: "Users",
      value: overview?.totalUsers ?? 0,
    },
  ];

  const trendData =
    responseTrend.length > 0
      ? responseTrend
      : [
          {
            date: "No Data",
            responses: 0,
          },
        ];

  const exportCsv = () => {
    toast.success("Export feature coming soon");
  };

  return (
    <div className="space-y-6">
      {/* Header */}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Analytics Dashboard</h1>

          <p className="text-muted-foreground">Survey insights and platform statistics</p>
        </div>

        <Button variant="outline" onClick={exportCsv}>
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </div>

      {/* Stats Cards */}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Total Surveys</p>

            <h2 className="mt-2 text-3xl font-bold">{stats.surveys}</h2>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Total Responses</p>

            <h2 className="mt-2 text-3xl font-bold">{stats.responses}</h2>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Total Users</p>

            <h2 className="mt-2 text-3xl font-bold">{stats.users}</h2>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Published Surveys</p>

            <h2 className="mt-2 text-3xl font-bold">{stats.published}</h2>
          </CardContent>
        </Card>
      </div>

      {/* Extra Metrics */}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Responses Today</p>

            <h2 className="mt-2 text-3xl font-bold">{responseStats?.responsesToday ?? 0}</h2>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">This Week</p>

            <h2 className="mt-2 text-3xl font-bold">{responseStats?.responsesThisWeek ?? 0}</h2>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">This Month</p>

            <h2 className="mt-2 text-3xl font-bold">{responseStats?.responsesThisMonth ?? 0}</h2>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Avg Responses / Survey</p>

            <h2 className="mt-2 text-3xl font-bold">
              {surveyStats?.averageResponsesPerSurvey ?? 0}
            </h2>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Platform Distribution</CardTitle>
          </CardHeader>

          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={platformData} dataKey="value" nameKey="name" outerRadius={100} label>
                  {platformData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>

                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Survey Status</CardTitle>
          </CardHeader>

          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={surveyStatusData}>
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey="name" />
                <YAxis />

                <Tooltip />

                <Bar dataKey="value" fill="var(--color-chart-1)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Trend Chart */}

      <Card>
        <CardHeader>
          <CardTitle>Response Trend</CardTitle>
        </CardHeader>

        <CardContent>
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="date" />
              <YAxis />

              <Tooltip />

              <Line
                type="monotone"
                dataKey="responses"
                stroke="var(--color-chart-1)"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Most Popular Survey */}

      <Card>
        <CardHeader>
          <CardTitle>Most Popular Survey</CardTitle>
        </CardHeader>

        <CardContent>
          {surveyStats?.mostPopularSurvey ? (
            <div className="space-y-2">
              <h3 className="font-semibold">{surveyStats.mostPopularSurvey.title}</h3>

              <p className="text-sm text-muted-foreground">
                Total Responses: {surveyStats.mostPopularSurvey.responses}
              </p>
            </div>
          ) : (
            <p className="text-muted-foreground">No survey responses yet</p>
          )}
        </CardContent>
      </Card>

      {/* Recent Surveys */}

      <Card className="border-0 shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-xl">Recent Surveys</CardTitle>

            <CardDescription>Latest surveys created on your platform</CardDescription>
          </div>

          <Button variant="outline" size="sm">
            View All
          </Button>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            {recentSurveys.map((survey: any) => (
              <div
                key={survey.id}
                className="group flex items-center justify-between rounded-xl border bg-background p-4 transition-all hover:shadow-md hover:border-primary/30"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>

                  <div>
                    <h4 className="font-semibold">{survey.title}</h4>

                    <p className="text-sm text-muted-foreground">
                      Created {new Date(survey.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <Badge
                    variant={survey.status === "PUBLISHED" ? "default" : "secondary"}
                    className="capitalize"
                  >
                    {survey.status.toLowerCase()}
                  </Badge>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="opacity-0 transition-opacity group-hover:opacity-100"
                    onClick={() => {
                      setSelectedSurvey(survey);
                      setOpen(true);
                    }}
                  >
                    <ArrowUpRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedSurvey?.title}</DialogTitle>
          </DialogHeader>

          <div className="space-y-2">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => {
                console.log("Selected Survey:", selectedSurvey);

                if (!selectedSurvey?.id) {
                  toast.error("Survey ID not found");
                  return;
                }

                setOpen(false);

                navigate({
                  to: "/surveys/$surveyId/analytics",
                  params: {
                    surveyId: selectedSurvey.id,
                  },
                });
              }}
            >
              <BarChart3 className="mr-2 h-4 w-4" />
              View Analytics
            </Button>

            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => {
                if (!selectedSurvey?.id) {
                  toast.error("Survey ID not found");
                  return;
                }

                setOpen(false);

                navigate({
                  to: "/responses",
                  search: {
                    surveyId: selectedSurvey.id,
                  },
                });
              }}
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              View Responses
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
