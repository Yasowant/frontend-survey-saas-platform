import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getAuditLogs, type ApiAuditLog } from "@/features/audit/api/audit.api";

export const Route = createFileRoute("/_app/audit")({ component: Audit });

const PAGE_SIZE = 20;

const ENTITY_OPTIONS = [
  { value: "all", label: "All Modules" },
  { value: "SURVEY", label: "Surveys" },
  { value: "Role", label: "Roles" },
];

const userName = (log: ApiAuditLog) => {
  const u = log.userId;
  if (!u) return "System";
  const name = [u.firstName, u.lastName].filter(Boolean).join(" ");
  return name || u.email || "Unknown";
};

const initials = (log: ApiAuditLog) => {
  const name = userName(log);
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
};

/** "SURVEY_AI_GENERATED" -> "AI Generated" */
const actionLabel = (action: string) =>
  action
    .replace(/^(SURVEY|ROLE|USER|RESPONSE)_/, "")
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .replace(/\bAi\b/, "AI");

const actionVariant = (action: string): "default" | "secondary" | "destructive" | "outline" => {
  if (action.includes("DELETE")) return "destructive";
  if (action.includes("PUBLISH") || action.includes("CREATE") || action.includes("GENERATED"))
    return "default";
  if (action.includes("CLOSE")) return "outline";
  return "secondary";
};

/** Human-readable one-liner from the logged old/new values. */
const details = (log: ApiAuditLog): string => {
  const nv = log.newValue ?? {};
  const ov = log.oldValue ?? {};
  const parts: string[] = [];

  const title = (nv.title ?? ov.title) as string | undefined;
  if (title) parts.push(`“${title}”`);

  if (ov.status && nv.status && ov.status !== nv.status) {
    parts.push(`${ov.status} → ${nv.status}`);
  }
  if (nv.prompt) parts.push(`prompt: “${String(nv.prompt).slice(0, 60)}…”`);
  if (nv.recipients) parts.push(`${nv.recipients} recipient(s)`);
  if (nv.questions) parts.push(`${nv.questions} questions, ${nv.rules ?? 0} rules`);

  return parts.join(" · ") || "—";
};

const timeAgo = (date: string) => {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(date).toLocaleDateString();
};

function Audit() {
  const [q, setQ] = useState("");
  const [entity, setEntity] = useState("all");
  const [page, setPage] = useState(1);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["audit-logs", page, entity],
    queryFn: () =>
      getAuditLogs({
        page,
        limit: PAGE_SIZE,
        entityType: entity === "all" ? undefined : entity,
      }),
    placeholderData: keepPreviousData,
  });

  const pageData = data?.data;
  const items: ApiAuditLog[] = pageData?.items ?? [];
  const total = pageData?.total ?? 0;
  const totalPages = pageData?.totalPages ?? 1;

  // Text search filters the current page client-side.
  const filtered = useMemo(
    () =>
      items.filter((i) =>
        [userName(i), i.action, i.entityType, details(i)].some((s) =>
          (s || "").toLowerCase().includes(q.toLowerCase()),
        ),
      ),
    [items, q],
  );

  const changeEntity = (value: string) => {
    setEntity(value);
    setPage(1);
  };

  const from = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const to = Math.min(page * PAGE_SIZE, total);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Audit logs</h1>
        <p className="text-sm text-muted-foreground">
          Every action, who did it, and when · {total} events
        </p>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-3">
            <Input
              placeholder="Search this page…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="max-w-xs"
            />
            <Select value={entity} onValueChange={changeEntity}>
              <SelectTrigger className="w-44">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ENTITY_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="mt-4 overflow-hidden rounded-md border">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-left">
                <tr>
                  <th className="px-4 py-2 font-medium">User</th>
                  <th className="px-4 py-2 font-medium">Action</th>
                  <th className="px-4 py-2 font-medium">Module</th>
                  <th className="px-4 py-2 font-medium">Details</th>
                  <th className="px-4 py-2 font-medium text-right">When</th>
                </tr>
              </thead>
              <tbody className={isFetching ? "opacity-60" : ""}>
                {isLoading && (
                  <tr>
                    <td colSpan={5} className="px-4 py-12 text-center text-muted-foreground">
                      Loading…
                    </td>
                  </tr>
                )}
                {!isLoading && filtered.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-12 text-center text-muted-foreground">
                      No audit logs found
                    </td>
                  </tr>
                )}
                {filtered.map((i) => (
                  <tr key={i._id} className="border-t hover:bg-muted/30">
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-semibold text-primary">
                          {initials(i)}
                        </div>
                        <span className="font-medium">{userName(i)}</span>
                      </div>
                    </td>
                    <td className="px-4 py-2.5">
                      <Badge variant={actionVariant(i.action)}>{actionLabel(i.action)}</Badge>
                    </td>
                    <td className="px-4 py-2.5">
                      <Badge variant="outline">{i.entityType}</Badge>
                    </td>
                    <td className="max-w-[320px] truncate px-4 py-2.5 text-muted-foreground">
                      {details(i)}
                    </td>
                    <td
                      className="px-4 py-2.5 text-right text-muted-foreground"
                      title={new Date(i.createdAt).toLocaleString()}
                    >
                      {timeAgo(i.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">
              Showing {from}–{to} of {total}
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1 || isFetching}
              >
                <ChevronLeft className="mr-1 h-4 w-4" />
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages || isFetching}
              >
                Next
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
