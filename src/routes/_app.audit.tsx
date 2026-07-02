import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { getAuditLogs, type ApiAuditLog } from "@/features/audit/api/audit.api";

export const Route = createFileRoute("/_app/audit")({ component: Audit });

const userName = (log: ApiAuditLog) => {
  const u = log.userId;
  if (!u) return "System";
  const name = [u.firstName, u.lastName].filter(Boolean).join(" ");
  return name || u.email || "Unknown";
};

function Audit() {
  const [q, setQ] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["audit-logs"],
    queryFn: getAuditLogs,
  });

  const items: ApiAuditLog[] = data?.data ?? [];

  const filtered = useMemo(
    () =>
      items.filter((i) =>
        [userName(i), i.action, i.entityType].some((s) =>
          (s || "").toLowerCase().includes(q.toLowerCase()),
        ),
      ),
    [items, q],
  );

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Audit logs</h1>
        <p className="text-sm text-muted-foreground">{filtered.length} events</p>
      </div>
      <Card>
        <CardContent className="p-4">
          <Input
            placeholder="Search user, action, module…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="max-w-xs"
          />
          <div className="mt-4 overflow-hidden rounded-md border">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-left">
                <tr>
                  <th className="px-4 py-2 font-medium">User</th>
                  <th className="px-4 py-2 font-medium">Action</th>
                  <th className="px-4 py-2 font-medium">Module</th>
                  <th className="px-4 py-2 font-medium">Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {isLoading && (
                  <tr>
                    <td colSpan={4} className="px-4 py-12 text-center text-muted-foreground">
                      Loading…
                    </td>
                  </tr>
                )}
                {!isLoading && filtered.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-12 text-center text-muted-foreground">
                      No audit logs
                    </td>
                  </tr>
                )}
                {filtered.slice(0, 100).map((i) => (
                  <tr key={i._id} className="border-t">
                    <td className="px-4 py-2 font-medium">{userName(i)}</td>
                    <td className="px-4 py-2">{i.action}</td>
                    <td className="px-4 py-2">
                      <Badge variant="outline">{i.entityType}</Badge>
                    </td>
                    <td className="px-4 py-2 text-muted-foreground">
                      {new Date(i.createdAt).toLocaleString()}
                    </td>
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
