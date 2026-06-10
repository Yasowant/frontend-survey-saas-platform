import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useSurveys } from "@/features/surveys/hooks/useSurveys";

import { MoreHorizontal, Plus, Eye, Pencil, Share2, Trash2 } from "lucide-react";

import { toast } from "sonner";
import { useDeleteSurvey } from "@/features/surveys/hooks/useDeleteSurvey";

export const Route = createFileRoute("/_app/surveys/")({
  component: SurveyList,
});

function SurveyList() {
  const { data, isLoading } = useSurveys();

  const items = data?.data || [];

  console.log(items, "Data For Survey");
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");

  const filtered = useMemo(() => {
    return items.filter(
      (survey: any) =>
        (status === "all" || survey.status === status) &&
        survey.title.toLowerCase().includes(q.toLowerCase()),
    );
  }, [items, q, status]);
  const deleteSurveyMutation = useDeleteSurvey();

  const handleDelete = (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this survey?\n\nAll related sections, questions and rules will also be deleted.",
    );

    if (!confirmed) return;

    deleteSurveyMutation.mutate(id);
  };

  if (isLoading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">All Surveys</h1>

          <p className="text-sm text-muted-foreground">
            {filtered.length} of {items.length} surveys
          </p>
        </div>

        <Button asChild>
          <Link to="/surveys/create">
            <Plus className="mr-2 h-4 w-4" />
            Create Survey
          </Link>
        </Button>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-3">
            <Input
              placeholder="Search surveys..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="max-w-xs"
            />

            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>

                <SelectItem value="DRAFT">Draft</SelectItem>

                <SelectItem value="PUBLISHED">Published</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="mt-4 overflow-hidden rounded-md border">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-left">
                <tr>
                  <th className="px-4 py-2 font-medium">Survey Name</th>

                  <th className="px-4 py-2 font-medium">Status</th>

                  <th className="px-4 py-2 font-medium">Created By</th>

                  <th className="px-4 py-2 font-medium">Created</th>

                  <th className="px-4 py-2 font-medium text-right">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((survey: any) => (
                  <tr key={survey._id} className="border-t hover:bg-muted/30">
                    <td className="px-4 py-2 font-medium">{survey.title}</td>

                    <td className="px-4 py-2">
                      <Badge variant={survey.status === "PUBLISHED" ? "default" : "secondary"}>
                        {survey.status}
                      </Badge>
                    </td>

                    <td className="px-4 py-2 text-muted-foreground">
                      {survey.createdBy?.firstName} {survey.createdBy?.lastName}
                    </td>

                    <td className="px-4 py-2 text-muted-foreground">
                      {new Date(survey.createdAt).toLocaleDateString()}
                    </td>

                    <td className="px-4 py-2 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link
                              to="/survey/$id"
                              params={{
                                id: survey._id,
                              }}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              View
                            </Link>
                          </DropdownMenuItem>

                          <DropdownMenuItem>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>

                          <DropdownMenuItem onClick={() => handleDelete(survey._id)}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            onClick={() => {
                              navigator.clipboard.writeText(
                                `${window.location.origin}/surveys/${survey._id}`,
                              );

                              toast.success("Link copied");
                            }}
                          >
                            <Share2 className="mr-2 h-4 w-4" />
                            Share
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}

                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-12 text-center text-muted-foreground">
                      No surveys found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
