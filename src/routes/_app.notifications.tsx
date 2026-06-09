import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, CheckCheck, FileText, Sparkles, DollarSign, CreditCard } from "lucide-react";
import { notifRepo } from "@/lib/storage";
import type { Notification } from "@/lib/types";

export const Route = createFileRoute("/_app/notifications")({ component: Notifications });

const ICONS = {
  survey_created: FileText,
  survey_published: Sparkles,
  subscription_updated: CreditCard,
  payment_success: DollarSign,
};

function Notifications() {
  const [items, setItems] = useState<Notification[]>([]);
  const reload = () => setItems(notifRepo.list());
  useEffect(reload, []);

  const markRead = (id: string) => {
    notifRepo.set(items.map((n) => (n.id === id ? { ...n, read: true } : n)));
    reload();
  };
  const markAll = () => { notifRepo.set(items.map((n) => ({ ...n, read: true }))); reload(); };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Notifications</h1>
          <p className="text-sm text-muted-foreground">{items.filter((n) => !n.read).length} unread</p>
        </div>
        <Button variant="outline" size="sm" onClick={markAll}><CheckCheck className="mr-1 h-4 w-4" /> Mark all read</Button>
      </div>
      <Card><CardContent className="p-0">
        <ul className="divide-y">
          {items.length === 0 && <li className="p-12 text-center text-sm text-muted-foreground"><Bell className="mx-auto mb-2 h-6 w-6" />No notifications</li>}
          {items.map((n) => {
            const Icon = ICONS[n.type];
            return (
              <li key={n.id} className={`flex items-start gap-3 p-4 ${!n.read ? "bg-primary/5" : ""}`}>
                <div className="rounded-md bg-primary/10 p-2 text-primary"><Icon className="h-4 w-4" /></div>
                <div className="flex-1">
                  <div className="text-sm font-medium">{n.title}</div>
                  <div className="text-sm text-muted-foreground">{n.message}</div>
                  <div className="mt-1 text-xs text-muted-foreground">{new Date(n.createdAt).toLocaleString()}</div>
                </div>
                {!n.read && <Button variant="ghost" size="sm" onClick={() => markRead(n.id)}>Mark read</Button>}
              </li>
            );
          })}
        </ul>
      </CardContent></Card>
    </div>
  );
}
