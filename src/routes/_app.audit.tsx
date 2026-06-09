import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { auditRepo } from "@/lib/storage";
import type { AuditLog } from "@/lib/types";

export const Route = createFileRoute("/_app/audit")({ component: Audit });

function Audit() {
  const [items, setItems] = useState<AuditLog[]>([]);
  const [q, setQ] = useState("");
  useEffect(() => setItems(auditRepo.list()), []);
  const filtered = useMemo(() => items.filter((i) =>
    [i.user, i.action, i.module].some((s) => s.toLowerCase().includes(q.toLowerCase()))
  ), [items, q]);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Audit logs</h1>
        <p className="text-sm text-muted-foreground">{filtered.length} events</p>
      </div>
      <Card><CardContent className="p-4">
        <Input placeholder="Search user, action, module…" value={q} onChange={(e) => setQ(e.target.value)} className="max-w-xs" />
        <div className="mt-4 overflow-hidden rounded-md border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left"><tr>
              <th className="px-4 py-2 font-medium">User</th>
              <th className="px-4 py-2 font-medium">Action</th>
              <th className="px-4 py-2 font-medium">Module</th>
              <th className="px-4 py-2 font-medium">Timestamp</th>
            </tr></thead>
            <tbody>
              {filtered.slice(0, 100).map((i) => (
                <tr key={i.id} className="border-t">
                  <td className="px-4 py-2 font-medium">{i.user}</td>
                  <td className="px-4 py-2">{i.action}</td>
                  <td className="px-4 py-2"><Badge variant="outline">{i.module}</Badge></td>
                  <td className="px-4 py-2 text-muted-foreground">{new Date(i.timestamp).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent></Card>
    </div>
  );
}
