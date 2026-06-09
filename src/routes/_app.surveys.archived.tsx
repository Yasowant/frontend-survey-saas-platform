import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { surveysRepo } from "@/lib/storage";
import type { Survey } from "@/lib/types";
import { toast } from "sonner";
import { ArchiveRestore } from "lucide-react";

export const Route = createFileRoute("/_app/surveys/archived")({ component: Archived });

function Archived() {
  const [items, setItems] = useState<Survey[]>([]);
  const reload = () => setItems(surveysRepo.list().filter((s) => s.status === "archived"));
  useEffect(reload, []);
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold tracking-tight">Archived surveys</h1>
      <Card><CardContent className="p-0">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left"><tr>
            <th className="px-4 py-2 font-medium">Name</th><th className="px-4 py-2 font-medium">Responses</th><th className="px-4 py-2 font-medium text-right">Actions</th>
          </tr></thead>
          <tbody>
            {items.map((s) => (
              <tr key={s.id} className="border-t">
                <td className="px-4 py-2 font-medium">{s.name}</td>
                <td className="px-4 py-2">{s.responseCount}</td>
                <td className="px-4 py-2 text-right">
                  <Button variant="outline" size="sm" onClick={() => { surveysRepo.save({ ...s, status: "draft" }); reload(); toast.success("Restored"); }}>
                    <ArchiveRestore className="mr-1 h-4 w-4" /> Restore
                  </Button>
                </td>
              </tr>
            ))}
            {items.length === 0 && <tr><td colSpan={3} className="px-4 py-12 text-center text-muted-foreground">No archived surveys</td></tr>}
          </tbody>
        </table>
      </CardContent></Card>
    </div>
  );
}
