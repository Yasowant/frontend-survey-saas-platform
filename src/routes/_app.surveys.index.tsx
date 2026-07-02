import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useSurveys } from "@/features/surveys/hooks/useSurveys";
import { useDeleteSurvey } from "@/features/surveys/hooks/useDeleteSurvey";
import { usePublishSurvey } from "@/features/surveys/hooks/usePublishSurvey";
import { useCloseSurvey } from "@/features/surveys/hooks/useCloseSurvey";
import { useUpdateSurvey } from "@/features/surveys/hooks/useUpdateSurvey";
import { useShareSurvey } from "@/features/surveys/hooks/useShareSurvey";
import { useGenerateSurvey } from "@/features/surveys/hooks/useGenerateSurvey";
import { useRolePermissions } from "@/hooks/useRolePermissions";

import {
  MoreHorizontal,
  Plus,
  Eye,
  Pencil,
  Share2,
  Trash2,
  Rocket,
  Lock,
  RotateCcw,
  Copy,
  Mail,
  Sparkles,
} from "lucide-react";

import { toast } from "sonner";

export const Route = createFileRoute("/_app/surveys/")({
  validateSearch: (search: Record<string, unknown>): { ai?: boolean } => ({
    ai: search.ai === true || search.ai === "true" ? true : undefined,
  }),
  component: SurveyList,
});

const statusVariant = (status: string) => {
  if (status === "PUBLISHED") return "default" as const;
  if (status === "CLOSED") return "destructive" as const;
  return "secondary" as const;
};

function SurveyList() {
  const { data, isLoading } = useSurveys();
  const { hasPermission } = useRolePermissions();

  const items = data?.data || [];

  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");

  const [editing, setEditing] = useState<any>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");

  const [sharing, setSharing] = useState<any>(null);
  const [shareEmails, setShareEmails] = useState("");
  const [shareMessage, setShareMessage] = useState("");

  const { ai } = Route.useSearch();
  const navigate = useNavigate();
  const [aiOpen, setAiOpen] = useState(Boolean(ai));
  const [aiPrompt, setAiPrompt] = useState("");

  // Open the AI dialog when arriving via the sidebar "Generate with AI" link.
  useEffect(() => {
    if (ai) setAiOpen(true);
  }, [ai]);

  const closeAi = () => {
    setAiOpen(false);
    if (ai) navigate({ to: "/surveys", search: {} });
  };

  const filtered = useMemo(() => {
    return items.filter(
      (survey: any) =>
        (status === "all" || survey.status === status) &&
        survey.title.toLowerCase().includes(q.toLowerCase()),
    );
  }, [items, q, status]);

  const deleteSurveyMutation = useDeleteSurvey();
  const publishSurveyMutation = usePublishSurvey();
  const closeSurveyMutation = useCloseSurvey();
  const updateSurveyMutation = useUpdateSurvey();
  const shareSurveyMutation = useShareSurvey();
  const generateSurveyMutation = useGenerateSurvey();

  const handleGenerate = () => {
    if (aiPrompt.trim().length < 5) {
      toast.error("Describe the survey you want, e.g. “a hospital management survey”");
      return;
    }
    generateSurveyMutation.mutate(aiPrompt.trim(), {
      onSuccess: () => {
        closeAi();
        setAiPrompt("");
      },
    });
  };

  const handleDelete = (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this survey?\n\nAll related sections, questions and rules will also be deleted.",
    );

    if (!confirmed) return;

    deleteSurveyMutation.mutate(id);
  };

  const openEdit = (survey: any) => {
    setEditing(survey);
    setEditTitle(survey.title);
    setEditDesc(survey.description || "");
  };

  const saveEdit = () => {
    if (!editing) return;
    if (!editTitle.trim()) {
      toast.error("Title is required");
      return;
    }
    updateSurveyMutation.mutate(
      {
        id: editing._id,
        payload: { title: editTitle.trim(), description: editDesc },
      },
      { onSuccess: () => setEditing(null) },
    );
  };

  const shareLink = (survey: any) => `${window.location.origin}/survey/${survey._id}`;

  const copyShareLink = (survey: any) => {
    navigator.clipboard.writeText(shareLink(survey));
    toast.success(
      survey.status === "PUBLISHED"
        ? "Public link copied"
        : "Link copied — note: respondents can only open it once the survey is published",
    );
  };

  const openShare = (survey: any) => {
    setSharing(survey);
    setShareEmails("");
    setShareMessage("");
  };

  const sendInvitations = () => {
    if (!sharing) return;
    const emails = shareEmails
      .split(/[\s,;]+/)
      .map((e) => e.trim())
      .filter(Boolean);
    if (emails.length === 0) {
      toast.error("Enter at least one email address");
      return;
    }
    shareSurveyMutation.mutate(
      {
        id: sharing._id,
        payload: { emails, message: shareMessage.trim() || undefined },
      },
      { onSuccess: () => setSharing(null) },
    );
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

        {hasPermission("SURVEY_CREATE") && (
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setAiOpen(true)}>
              <Sparkles className="mr-2 h-4 w-4 text-primary" />
              Generate with AI
            </Button>
            <Button asChild>
              <Link to="/surveys/create">
                <Plus className="mr-2 h-4 w-4" />
                Create Survey
              </Link>
            </Button>
          </div>
        )}
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

                <SelectItem value="CLOSED">Closed</SelectItem>
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
                      <Badge variant={statusVariant(survey.status)}>{survey.status}</Badge>
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

                          <DropdownMenuItem onClick={() => openEdit(survey)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>

                          <DropdownMenuSeparator />

                          {survey.status === "DRAFT" && (
                            <DropdownMenuItem
                              onClick={() => publishSurveyMutation.mutate(survey._id)}
                            >
                              <Rocket className="mr-2 h-4 w-4" />
                              Publish
                            </DropdownMenuItem>
                          )}

                          {survey.status === "PUBLISHED" && (
                            <DropdownMenuItem
                              onClick={() => closeSurveyMutation.mutate(survey._id)}
                            >
                              <Lock className="mr-2 h-4 w-4" />
                              Close
                            </DropdownMenuItem>
                          )}

                          {survey.status === "CLOSED" && (
                            <DropdownMenuItem
                              onClick={() => publishSurveyMutation.mutate(survey._id)}
                            >
                              <RotateCcw className="mr-2 h-4 w-4" />
                              Reopen
                            </DropdownMenuItem>
                          )}

                          <DropdownMenuItem onClick={() => openShare(survey)}>
                            <Share2 className="mr-2 h-4 w-4" />
                            Share
                          </DropdownMenuItem>

                          <DropdownMenuSeparator />

                          <DropdownMenuItem onClick={() => handleDelete(survey._id)}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
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

      {/* AI generate dialog */}
      <Dialog open={aiOpen} onOpenChange={(open) => (open ? setAiOpen(true) : closeAi())}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              Generate survey with AI
            </DialogTitle>
            <DialogDescription>
              Describe the survey you need. AI builds the sections, questions, and conditional-logic
              rules — saved as a draft you can review and publish.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <Label>What survey do you want?</Label>
            <Textarea
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="e.g. A hospital management survey covering patient experience, staff efficiency, and facility cleanliness"
              rows={4}
              maxLength={1000}
            />
            <p className="text-xs text-muted-foreground">
              Tip: mention the topic, audience, and what you want to learn.
            </p>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={closeAi}>
              Cancel
            </Button>
            <Button onClick={handleGenerate} disabled={generateSurveyMutation.isPending}>
              <Sparkles className="mr-2 h-4 w-4" />
              {generateSurveyMutation.isPending ? "Generating… (takes ~15s)" : "Generate survey"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Share survey dialog */}
      <Dialog open={!!sharing} onOpenChange={(open) => !open && setSharing(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share survey</DialogTitle>
            <DialogDescription>
              {sharing?.status === "PUBLISHED"
                ? "Copy the public link or send email invitations. Emails are delivered in the background."
                : "This survey is not published yet — publish it first so respondents can open the link."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Public link</Label>
              <div className="flex gap-2">
                <Input readOnly value={sharing ? shareLink(sharing) : ""} className="text-xs" />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => sharing && copyShareLink(sharing)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Email invitations</Label>
              <Textarea
                value={shareEmails}
                onChange={(e) => setShareEmails(e.target.value)}
                placeholder={"alex@example.com, sam@example.com\nUp to 20 recipients"}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>Personal message (optional)</Label>
              <Textarea
                value={shareMessage}
                onChange={(e) => setShareMessage(e.target.value)}
                placeholder="Would love your feedback — takes 2 minutes!"
                rows={2}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setSharing(null)}>
              Cancel
            </Button>
            <Button
              onClick={sendInvitations}
              disabled={shareSurveyMutation.isPending || sharing?.status !== "PUBLISHED"}
            >
              <Mail className="mr-2 h-4 w-4" />
              {shareSurveyMutation.isPending ? "Sending..." : "Send invitations"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit survey dialog */}
      <Dialog open={!!editing} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit survey</DialogTitle>
            <DialogDescription>Update the survey title and description.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea value={editDesc} onChange={(e) => setEditDesc(e.target.value)} rows={3} />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditing(null)}>
              Cancel
            </Button>
            <Button onClick={saveEdit} disabled={updateSurveyMutation.isPending}>
              {updateSurveyMutation.isPending ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
