import { createFileRoute, Link } from "@tanstack/react-router";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useSurveys } from "@/features/surveys/hooks/useSurveys";

export const Route = createFileRoute("/_app/surveys/drafts")({ component: Drafts });

interface SurveyRow {
  _id: string;
  title: string;
  description?: string;
  status: string;
  updatedAt: string;
}

function Drafts() {
  const { data, isLoading } = useSurveys();
  const items: SurveyRow[] = (data?.data ?? []).filter(
    (s: SurveyRow) => s.status === "DRAFT",
  );

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold tracking-tight">Draft surveys</h1>
      <Card>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left">
              <tr>
                <th className="px-4 py-2 font-medium">Name</th>
                <th className="px-4 py-2 font-medium">Status</th>
                <th className="px-4 py-2 font-medium">Updated</th>
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
                <tr key={s._id} className="border-t hover:bg-muted/30">
                  <td className="px-4 py-2">
                    <Link
                      to="/survey/$id"
                      params={{ id: s._id }}
                      className="font-medium hover:underline"
                    >
                      {s.title}
                    </Link>
                  </td>
                  <td className="px-4 py-2">
                    <Badge variant="outline">Draft</Badge>
                  </td>
                  <td className="px-4 py-2 text-muted-foreground">
                    {new Date(s.updatedAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {!isLoading && items.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-4 py-12 text-center text-muted-foreground">
                    No drafts
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
