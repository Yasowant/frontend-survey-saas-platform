import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { invoicesRepo } from "@/lib/storage";
import type { Invoice } from "@/lib/types";

export const Route = createFileRoute("/_app/billing")({ component: Billing });

function Billing() {
  const [items, setItems] = useState<Invoice[]>([]);
  const [open, setOpen] = useState<Invoice | null>(null);
  useEffect(() => setItems(invoicesRepo.list()), []);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Billing history</h1>
        <p className="text-sm text-muted-foreground">All your past invoices</p>
      </div>
      <Card><CardContent className="p-0">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left"><tr>
            <th className="px-4 py-2 font-medium">Invoice</th>
            <th className="px-4 py-2 font-medium">Date</th>
            <th className="px-4 py-2 font-medium">Method</th>
            <th className="px-4 py-2 font-medium">Amount</th>
            <th className="px-4 py-2 font-medium">Status</th>
            <th className="px-4 py-2 font-medium text-right">Action</th>
          </tr></thead>
          <tbody>
            {items.map((i) => (
              <tr key={i.id} className="border-t">
                <td className="px-4 py-2 font-medium">{i.number}</td>
                <td className="px-4 py-2 text-muted-foreground">{new Date(i.date).toLocaleDateString()}</td>
                <td className="px-4 py-2 text-muted-foreground">{i.method}</td>
                <td className="px-4 py-2">${i.amount}</td>
                <td className="px-4 py-2">
                  <Badge variant={i.status === "paid" ? "default" : i.status === "pending" ? "secondary" : "destructive"}>{i.status}</Badge>
                </td>
                <td className="px-4 py-2 text-right">
                  <Button variant="outline" size="sm" onClick={() => setOpen(i)}>View</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent></Card>

      <Dialog open={!!open} onOpenChange={() => setOpen(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Invoice {open?.number}</DialogTitle></DialogHeader>
          {open && (
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Date</span><span>{new Date(open.date).toLocaleDateString()}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Plan</span><span className="capitalize">{open.plan}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Method</span><span>{open.method}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Status</span><Badge>{open.status}</Badge></div>
              <div className="border-t pt-3 flex justify-between text-base font-semibold"><span>Total</span><span>${open.amount}</span></div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
