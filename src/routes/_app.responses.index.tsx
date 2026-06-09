import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Eye,
  Search,
  FileText,
  User,
  Calendar,
  MessageSquare,
  BarChart3,
  TrendingUp,
  Clock,
} from "lucide-react";

// import { Eye, Search, FileText, User, Calendar, MessageSquare } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import { useResponses } from "@/features/surveys/hooks/useResponses";
import { useSurveyResponses } from "@/features/surveys/hooks/useSurveyResponses";

export const Route = createFileRoute("/_app/responses/")({
  component: Responses,
});

function Responses() {
  const { data, isLoading } = useResponses();

  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedSurveyId, setSelectedSurveyId] = useState("");

  const responses = data?.data ?? [];

  const filteredResponses = useMemo(() => {
    return responses.filter(
      (response: any) =>
        response.surveyName?.toLowerCase().includes(search.toLowerCase()) ||
        response.submittedBy?.toLowerCase().includes(search.toLowerCase()),
    );
  }, [responses, search]);

  const { data: responseDetails, isLoading: detailsLoading } = useSurveyResponses(
    selectedSurveyId,
    open,
  );

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <div className="space-y-3 text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
          <p className="text-muted-foreground">Loading responses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Survey Responses</h1>

          <p className="text-muted-foreground mt-1">Manage and review all survey submissions</p>
        </div>

        <Badge variant="secondary" className="w-fit px-4 py-2 text-sm">
          {filteredResponses.length} Responses
        </Badge>
      </div>

      {/* Stats */}
      <div className="grid gap-5 md:grid-cols-3 xl:grid-cols-4">
        <Card className="border-0 bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100">Total Responses</p>
                <h2 className="mt-2 text-4xl font-bold">{responses.length}</h2>
              </div>

              <FileText className="h-12 w-12 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-to-br from-emerald-500 to-green-600 text-white shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100">Respondents</p>

                <h2 className="mt-2 text-4xl font-bold">
                  {new Set(responses.map((r: any) => r.submittedBy)).size}
                </h2>
              </div>

              <User className="h-12 w-12 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-to-br from-purple-500 to-pink-600 text-white shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100">Surveys</p>

                <h2 className="mt-2 text-4xl font-bold">
                  {new Set(responses.map((r: any) => r.surveyId)).size}
                </h2>
              </div>

              <MessageSquare className="h-12 w-12 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-to-br from-orange-500 to-red-500 text-white shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100">Today</p>

                <h2 className="mt-2 text-4xl font-bold">
                  {
                    responses.filter(
                      (r: any) =>
                        new Date(r.submittedAt).toDateString() === new Date().toDateString(),
                    ).length
                  }
                </h2>
              </div>

              <TrendingUp className="h-12 w-12 opacity-80" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card className="sticky top-4 z-20 border-0 bg-background/70 backdrop-blur-xl shadow-sm">
        <CardContent className="p-5">
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-3.5 h-4 w-4 text-muted-foreground" />

              <Input
                placeholder="Search surveys, users..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-11 pl-10"
              />
            </div>

            <Button>
              <BarChart3 className="mr-2 h-4 w-4" />
              Analytics
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Responses Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-hidden rounded-lg">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-6 py-4 text-left">Survey</th>
                  <th className="px-6 py-4 text-left">Submitted By</th>
                  <th className="px-6 py-4 text-left">Date</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredResponses.map((response: any) => (
                  <tr
                    key={response.id}
                    className="group border-b transition-all hover:bg-primary/5"
                  >
                    <td className="px-6 py-5">
                      <div>
                        <h4 className="font-semibold">{response.surveyName}</h4>

                        <p className="text-xs text-muted-foreground mt-1">{response.surveyId}</p>
                      </div>
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 text-white font-semibold shadow">
                          {response.submittedBy?.charAt(0)?.toUpperCase()}
                        </div>

                        <div>
                          <p className="font-medium">{response.submittedBy}</p>

                          <p className="text-xs text-muted-foreground">Survey Participant</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />

                        <span className="text-sm">
                          {new Date(response.submittedAt).toLocaleString()}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-5 text-right">
                      <Button
                        size="sm"
                        className="opacity-0 transition-all group-hover:opacity-100"
                        onClick={() => {
                          setSelectedSurveyId(response.surveyId);
                          setOpen(true);
                        }}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </Button>
                    </td>
                  </tr>
                ))}

                {filteredResponses.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-20 text-center">
                      <FileText className="mx-auto mb-3 h-12 w-12 text-muted-foreground/40" />

                      <h3 className="font-medium">No Responses Found</h3>

                      <p className="text-sm text-muted-foreground">Try adjusting your search.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Details Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] max-w-6xl overflow-y-auto rounded-3xl border-0 p-0 shadow-2xl">
          <DialogHeader className="sticky top-0 z-10 border-b bg-background px-8 py-6">
            <DialogTitle className="text-2xl font-bold">Survey Responses</DialogTitle>
          </DialogHeader>

          {detailsLoading ? (
            <div className="flex h-60 items-center justify-center">
              <div className="space-y-3 text-center">
                <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                <p className="text-sm text-muted-foreground">Loading responses...</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6 p-8">
              {responseDetails?.data?.map((response: any) => (
                <Card key={response.id} className="overflow-hidden border-0 shadow-lg">
                  {/* Top Gradient */}
                  <div className="h-2 bg-gradient-to-r from-violet-500 via-indigo-500 to-blue-500" />

                  <CardContent className="p-6">
                    {/* User Info */}
                    <div className="mb-6 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 text-lg font-bold text-white">
                          {response.submittedBy?.charAt(0)?.toUpperCase()}
                        </div>

                        <div>
                          <h3 className="text-lg font-semibold">{response.submittedBy}</h3>

                          <p className="text-sm text-muted-foreground">
                            {new Date(response.submittedAt).toLocaleString()}
                          </p>
                        </div>
                      </div>

                      <Badge className="rounded-full px-4 py-1">
                        {response.answers?.length} Questions
                      </Badge>
                    </div>

                    {/* Answers */}
                    <div className="grid gap-4">
                      {response.answers?.map((answer: any, index: number) => (
                        <Card
                          key={index}
                          className="border-l-4 border-l-indigo-500 transition-all hover:shadow-md"
                        >
                          <CardContent className="p-5">
                            <div className="mb-3 flex items-center gap-3">
                              <Badge variant="secondary">Q{index + 1}</Badge>

                              <h4 className="font-semibold">{answer.question}</h4>
                            </div>

                            <div className="rounded-xl bg-muted/40 p-4">
                              <p className="leading-relaxed text-muted-foreground">
                                {answer.answer || "No answer provided"}
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}

              {!responseDetails?.data?.length && (
                <div className="py-16 text-center">
                  <FileText className="mx-auto mb-4 h-12 w-12 text-muted-foreground/40" />

                  <h3 className="text-lg font-medium">No Responses Found</h3>

                  <p className="text-sm text-muted-foreground">
                    This survey doesn't have any responses yet.
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
