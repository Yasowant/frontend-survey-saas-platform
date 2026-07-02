import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, CheckCheck, FileText, Sparkles, Archive, Info } from "lucide-react";
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  type ApiNotification,
} from "@/features/notifications/api/notification.api";

export const Route = createFileRoute("/_app/notifications")({ component: Notifications });

const ICONS = {
  survey_created: FileText,
  survey_published: Sparkles,
  survey_closed: Archive,
  system: Info,
};

function Notifications() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: getNotifications,
  });

  const items: ApiNotification[] = data?.data ?? [];
  const unread = items.filter((n) => !n.read).length;

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["notifications"] });

  const markRead = useMutation({
    mutationFn: markNotificationRead,
    onSuccess: invalidate,
  });

  const markAll = useMutation({
    mutationFn: markAllNotificationsRead,
    onSuccess: invalidate,
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Notifications</h1>
          <p className="text-sm text-muted-foreground">{unread} unread</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => markAll.mutate()}
          disabled={markAll.isPending || unread === 0}
        >
          <CheckCheck className="mr-1 h-4 w-4" /> Mark all read
        </Button>
      </div>
      <Card>
        <CardContent className="p-0">
          <ul className="divide-y">
            {isLoading && (
              <li className="p-12 text-center text-sm text-muted-foreground">
                Loading…
              </li>
            )}
            {!isLoading && items.length === 0 && (
              <li className="p-12 text-center text-sm text-muted-foreground">
                <Bell className="mx-auto mb-2 h-6 w-6" />
                No notifications
              </li>
            )}
            {items.map((n) => {
              const Icon = ICONS[n.type] ?? Info;
              return (
                <li
                  key={n._id}
                  className={`flex items-start gap-3 p-4 ${!n.read ? "bg-primary/5" : ""}`}
                >
                  <div className="rounded-md bg-primary/10 p-2 text-primary">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">{n.title}</div>
                    <div className="text-sm text-muted-foreground">{n.message}</div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      {new Date(n.createdAt).toLocaleString()}
                    </div>
                  </div>
                  {!n.read && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => markRead.mutate(n._id)}
                      disabled={markRead.isPending}
                    >
                      Mark read
                    </Button>
                  )}
                </li>
              );
            })}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
