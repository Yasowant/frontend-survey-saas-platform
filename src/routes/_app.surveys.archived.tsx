import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSurveys } from "@/features/surveys/hooks/useSurveys";
import { updateSurvey } from "@/features/surveys/api/survey.api";
import { toast } from "sonner";
import { ArchiveRestore } from "lucide-react";

export const Route = createFileRoute("/_app/surveys/archived")({ component: Archived });

interface SurveyRow {
  _id: string;
  title: string;
  status: string;
  updatedAt: string;
}

function Archived() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useSurveys();

  const items: SurveyRow[] = (data?.data ?? []).filter(
    (s: SurveyRow) => s.status === "CLOSED",
  );

  const restore = useMutation({
    mutationFn: (id: string) => updateSurvey(id, { status: "DRAFT" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["surveys"] });
      toast.success("Survey restored to drafts");
    },
    onError: () => toast.error("Failed to restore survey"),
  });

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold tracking-tight">Closed surveys</h1>
      <Card>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left">
              <tr>
                <th className="px-4 py-2 font-medium">Name</th>
                <th className="px-4 py-2 font-medium">Closed on</th>
                <th className="px-4 py-2 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr>
                  <td colSpan={3} className="px-4 py-12 text-center text-muted-foreground">
                    Loading…
                  </td>
                </tr>
              )}
              {items.map((s) => (
                <tr key={s._id} className="border-t">
                  <td className="px-4 py-2 font-medium">{s.title}</td>
                  <td className="px-4 py-2 text-muted-foreground">
                    {new Date(s.updatedAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2 text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => restore.mutate(s._id)}
                      disabled={restore.isPending}
                    >
                      <ArchiveRestore className="mr-1 h-4 w-4" /> Restore
                    </Button>
                  </td>
                </tr>
              ))}
              {!isLoading && items.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-4 py-12 text-center text-muted-foreground">
                    No closed surveys
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
