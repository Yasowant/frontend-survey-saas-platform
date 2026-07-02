import { createFileRoute, Link } from "@tanstack/react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PieChart, Pie, Cell } from "recharts";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Activity, DollarSign, FileText, MessageSquare, Users } from "lucide-react";
import { useDashboard } from "@/features/dashboard/hooks/useDashboard";

export const Route = createFileRoute("/_app/dashboard")({
  component: Dashboard,
});

function Dashboard() {
  const { data, isLoading } = useDashboard();

  const dashboard = data?.data;

  const stats = {
    surveys: dashboard?.totalSurveys ?? 0,
    responses: dashboard?.totalResponses ?? 0,
    users: dashboard?.totalUsers ?? 0,
    published: dashboard?.publishedSurveys ?? 0,
    draft: dashboard?.draftSurveys ?? 0,
  };

  const trend =
    dashboard?.responseTrend?.map((item: any) => ({
      name: item.name,
      responses: item.responses,
    })) || [];

  const surveyTrend =
    dashboard?.surveyTrend?.map((item: any) => ({
      name: item.name,
      surveys: item.surveys,
    })) || [];

  const statusData = [
    {
      name: "Published",
      count: stats.published,
    },
    {
      name: "Draft",
      count: stats.draft,
    },
  ];

  const activityData = [
    {
      name: "Responses",
      value: stats.responses,
    },
    {
      name: "Published",
      value: stats.published,
    },
    {
      name: "Draft",
      value: stats.draft,
    },
  ];

  const COLORS = ["var(--color-chart-1)", "var(--color-chart-2)", "var(--color-chart-3)"];
  const recent = dashboard?.recentSurveys || [];

  const activity =
    dashboard?.recentResponses?.map((item: any) => ({
      id: item._id,
      action: `Response submitted for "${item.surveyId?.title}"`,
      createdAt: item.createdAt,
    })) || [];

  const cards = [
    {
      label: "Total Surveys",
      value: stats.surveys,
      icon: FileText,
    },
    {
      label: "Total Responses",
      value: stats.responses,
      icon: MessageSquare,
    },
    {
      label: "Active Users",
      value: stats.users,
      icon: Users,
    },
    {
      label: "Published Surveys",
      value: stats.published,
      icon: Activity,
    },
  ];

  if (isLoading) {
    return <div className="flex h-[400px] items-center justify-center">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>

          <p className="text-sm text-muted-foreground">
            Welcome back. Here's what's happening today.
          </p>
        </div>

        <Button asChild>
          <Link to="/surveys/create">Create Survey</Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Card key={card.label}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">{card.label}</div>

                <div className="rounded-md bg-primary/10 p-2 text-primary">
                  <card.icon className="h-4 w-4" />
                </div>
              </div>

              <div className="mt-3 text-2xl font-bold">{card.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Response Trend</CardTitle>

            <CardDescription>Responses submitted recently</CardDescription>
          </CardHeader>

          <CardContent>
            {trend.length === 0 ? (
              <div className="flex h-[280px] items-center justify-center text-muted-foreground">
                No response data available
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={trend}>
                  <defs>
                    <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--color-chart-1)" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="var(--color-chart-1)" stopOpacity={0} />
                    </linearGradient>
                  </defs>

                  <CartesianGrid strokeDasharray="3 3" />

                  <XAxis dataKey="name" />

                  <YAxis allowDecimals={false} />

                  <Tooltip />

                  <Area dataKey="responses" stroke="var(--color-chart-1)" fill="url(#gradient)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Survey Status</CardTitle>

            <CardDescription>Published vs Draft</CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div>
                <div className="mb-1 flex justify-between text-sm">
                  <span>Published</span>
                  <span>{stats.published}</span>
                </div>

                <div className="h-2 rounded-full bg-muted">
                  <div
                    className="h-2 rounded-full bg-green-500"
                    style={{
                      width: `${(stats.published / stats.surveys) * 100 || 0}%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="mb-1 flex justify-between text-sm">
                  <span>Draft</span>
                  <span>{stats.draft}</span>
                </div>

                <div className="h-2 rounded-full bg-muted">
                  <div
                    className="h-2 rounded-full bg-orange-500"
                    style={{
                      width: `${(stats.draft / stats.surveys) * 100 || 0}%`,
                    }}
                  />
                </div>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={statusData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="var(--color-chart-2)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Statistics + Activity */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* <Card className="lg:col-span-2 overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle>Platform Overview</CardTitle>

            <CardDescription>Surveys, responses and users statistics</CardDescription>
          </CardHeader>

          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart
                data={[
                  {
                    name: "Surveys",
                    count: stats.surveys,
                  },
                  {
                    name: "Responses",
                    count: stats.responses,
                  },
                  {
                    name: "Users",
                    count: stats.users,
                  },
                ]}
                margin={{
                  top: 10,
                  right: 10,
                  left: -20,
                  bottom: 0,
                }}
                barCategoryGap="35%"
              >
                <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.25} />

                <XAxis dataKey="name" tickLine={false} axisLine={false} />

                <YAxis allowDecimals={false} tickLine={false} axisLine={false} />

                <Tooltip
                  cursor={{ opacity: 0.1 }}
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid hsl(var(--border))",
                  }}
                />

                <Bar
                  dataKey="count"
                  radius={[10, 10, 0, 0]}
                  maxBarSize={80}
                  fill="var(--color-chart-1)"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card> */}
        <Card className="lg:col-span-2 overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Platform Overview</CardTitle>
              <CardDescription>Surveys, responses and users statistics</CardDescription>
            </div>

            <Button variant="outline" size="sm">
              View Report
            </Button>
          </CardHeader>

          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart
                data={[
                  {
                    name: "Surveys",
                    count: stats.surveys,
                  },
                  {
                    name: "Responses",
                    count: stats.responses,
                  },
                  {
                    name: "Users",
                    count: stats.users,
                  },
                ]}
                margin={{
                  top: 20,
                  right: 20,
                  left: -20,
                  bottom: 0,
                }}
                barCategoryGap="40%"
              >
                <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.15} />

                <XAxis dataKey="name" tickLine={false} axisLine={false} />

                <YAxis allowDecimals={false} tickLine={false} axisLine={false} domain={[0, 5]} />

                <Tooltip
                  cursor={{ fill: "rgba(0,0,0,0.03)" }}
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid hsl(var(--border))",
                  }}
                />

                <Bar
                  dataKey="count"
                  radius={[12, 12, 0, 0]}
                  maxBarSize={70}
                  fill="var(--color-chart-1)"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Survey Distribution</CardTitle>

            <CardDescription>Overview of platform activity</CardDescription>
          </CardHeader>

          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={activityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {activityData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>

                <Tooltip />
              </PieChart>
            </ResponsiveContainer>

            <div className="mt-4 space-y-2">
              {activityData.map((item, index) => (
                <div key={item.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{
                        backgroundColor: COLORS[index % COLORS.length],
                      }}
                    />

                    <span>{item.name}</span>
                  </div>

                  <span className="font-medium">{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Recent Activity
          </CardTitle>
        </CardHeader>

        <CardContent>
          {activity.length === 0 ? (
            <div className="py-10 text-center text-sm text-muted-foreground">No activity found</div>
          ) : (
            <div className="space-y-5">
              {activity.map((item: { id: string; action: string; createdAt: string }) => (
                <div key={item.id} className="relative border-l-2 border-primary/30 pl-4">
                  <div className="absolute -left-[5px] top-1.5 h-2 w-2 rounded-full bg-primary" />

                  <p className="text-sm font-medium">{item.action}</p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    {new Date(item.createdAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      {/* Recent Surveys */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Surveys</CardTitle>

            <CardDescription>Recently created surveys</CardDescription>
          </div>

          <Button variant="outline" size="sm" asChild>
            <Link to="/surveys">View All</Link>
          </Button>
        </CardHeader>

        <CardContent>
          <div className="overflow-hidden rounded-md border">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left">Survey</th>

                  <th className="px-4 py-3 text-left">Status</th>

                  <th className="px-4 py-3 text-left">Description</th>

                  <th className="px-4 py-3 text-left">Created</th>
                </tr>
              </thead>

              <tbody>
                {recent.map((survey: any) => (
                  <tr key={survey._id} className="border-t">
                    <td className="px-4 py-3 font-medium">{survey.title}</td>

                    <td className="px-4 py-3">
                      <Badge>{survey.status}</Badge>
                    </td>

                    <td className="max-w-xs truncate px-4 py-3">{survey.description}</td>

                    <td className="px-4 py-3">{new Date(survey.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
