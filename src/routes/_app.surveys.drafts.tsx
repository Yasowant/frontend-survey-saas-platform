import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { surveysRepo } from "@/lib/storage";
import type { Survey } from "@/lib/types";

export const Route = createFileRoute("/_app/surveys/drafts")({ component: Drafts });

function Drafts() {
  const [items, setItems] = useState<Survey[]>([]);
  useEffect(() => setItems(surveysRepo.list().filter((s) => s.status === "draft")), []);
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold tracking-tight">Draft surveys</h1>
      <Card><CardContent className="p-0">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left"><tr>
            <th className="px-4 py-2 font-medium">Name</th><th className="px-4 py-2 font-medium">Category</th><th className="px-4 py-2 font-medium">Updated</th>
          </tr></thead>
          <tbody>
            {items.map((s) => (
              <tr key={s.id} className="border-t hover:bg-muted/30">
                <td className="px-4 py-2"><Link to="/survey/$id" params={{ id: s.id }} className="font-medium hover:underline">{s.name}</Link></td>
                <td className="px-4 py-2 text-muted-foreground">{s.category}</td>
                <td className="px-4 py-2 text-muted-foreground">{new Date(s.updatedAt).toLocaleDateString()}</td>
              </tr>
            ))}
            {items.length === 0 && <tr><td colSpan={3} className="px-4 py-12 text-center text-muted-foreground">No drafts</td></tr>}
          </tbody>
        </table>
      </CardContent></Card>
    </div>
  );
}
