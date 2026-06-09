import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Check, Pencil, Trash2, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { plansRepo, uid, auditRepo } from "@/lib/storage";
import type { PlanRecord, PlanDuration, PlanStatus } from "@/lib/types";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/plans/")({ component: PlansPage });

function emptyPlan(): PlanRecord {
  return {
    id: uid(), name: "", price: 0, duration: "monthly", features: [],
    limits: { surveys: 10, responses: 1000, users: 5 }, status: "active",
    createdAt: new Date().toISOString(),
  };
}

function PlansPage() {
  const [plans, setPlans] = useState<PlanRecord[]>(() => plansRepo.list());
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState<PlanRecord | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [featureText, setFeatureText] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const refresh = () => setPlans(plansRepo.list());

  const openCreate = () => { setEditing(emptyPlan()); setFeatureText(""); setIsNew(true); setEditOpen(true); };
  const openEdit = (p: PlanRecord) => { setEditing({ ...p, features: [...p.features], limits: { ...p.limits } }); setFeatureText(""); setIsNew(false); setEditOpen(true); };

  const addFeature = () => {
    if (!editing || !featureText.trim()) return;
    setEditing({ ...editing, features: [...editing.features, featureText.trim()] });
    setFeatureText("");
  };

  const removeFeature = (i: number) => {
    if (!editing) return;
    setEditing({ ...editing, features: editing.features.filter((_, idx) => idx !== i) });
  };

  const save = () => {
    if (!editing) return;
    if (!editing.name) return toast.error("Plan name is required");
    plansRepo.save(editing);
    auditRepo.add({ user: "system", action: isNew ? "Created plan" : "Updated plan", module: "Plans" });
    toast.success(isNew ? "Plan created" : "Plan updated");
    setEditOpen(false); refresh();
  };

  const confirmDelete = () => {
    if (!deleteId) return;
    plansRepo.remove(deleteId);
    auditRepo.add({ user: "system", action: "Deleted plan", module: "Plans" });
    toast.success("Plan deleted");
    setDeleteId(null); refresh();
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Subscription Plans</h1>
          <p className="text-sm text-muted-foreground">Manage your pricing tiers and limits.</p>
        </div>
        <Button onClick={openCreate}><Plus className="mr-2 h-4 w-4" />Create plan</Button>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {plans.map((p) => (
          <Card key={p.id} className="relative overflow-hidden">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xl">{p.name}</CardTitle>
                  <CardDescription className="mt-1">
                    <span className="text-3xl font-semibold text-foreground">${p.price}</span>
                    <span className="text-sm">/{p.duration === "monthly" ? "mo" : "yr"}</span>
                  </CardDescription>
                </div>
                <Badge variant={p.status === "active" ? "default" : "secondary"}>{p.status}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-1.5 text-sm">
                {p.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />{f}</li>
                ))}
              </ul>
              <div className="grid grid-cols-3 gap-2 rounded-md border bg-muted/40 p-3 text-center text-xs">
                <div><div className="font-semibold text-foreground">{p.limits.surveys}</div><div className="text-muted-foreground">Surveys</div></div>
                <div><div className="font-semibold text-foreground">{p.limits.responses.toLocaleString()}</div><div className="text-muted-foreground">Responses</div></div>
                <div><div className="font-semibold text-foreground">{p.limits.users}</div><div className="text-muted-foreground">Users</div></div>
              </div>
              <div className="flex gap-2">
                <Button asChild variant="outline" size="sm" className="flex-1"><Link to="/plans/$id" params={{ id: p.id }}><Eye className="mr-2 h-4 w-4" />Details</Link></Button>
                <Button variant="ghost" size="icon" onClick={() => openEdit(p)}><Pencil className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" onClick={() => setDeleteId(p.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {plans.length === 0 && (
          <Card className="md:col-span-2 xl:col-span-3"><CardContent className="py-10 text-center text-muted-foreground">No plans yet. Create your first plan.</CardContent></Card>
        )}
      </div>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{isNew ? "Create plan" : "Edit plan"}</DialogTitle>
            <DialogDescription>Configure pricing, features, and limits.</DialogDescription>
          </DialogHeader>
          {editing && (
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2"><Label>Name</Label><Input value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} /></div>
                <div className="space-y-2"><Label>Price (USD)</Label><Input type="number" value={editing.price} onChange={(e) => setEditing({ ...editing, price: Number(e.target.value) })} /></div>
                <div className="space-y-2">
                  <Label>Duration</Label>
                  <Select value={editing.duration} onValueChange={(v) => setEditing({ ...editing, duration: v as PlanDuration })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="yearly">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={editing.status} onValueChange={(v) => setEditing({ ...editing, status: v as PlanStatus })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Limits</Label>
                <div className="mt-2 grid gap-3 sm:grid-cols-3">
                  <div className="space-y-1"><Label className="text-xs text-muted-foreground">Surveys</Label><Input type="number" value={editing.limits.surveys} onChange={(e) => setEditing({ ...editing, limits: { ...editing.limits, surveys: Number(e.target.value) } })} /></div>
                  <div className="space-y-1"><Label className="text-xs text-muted-foreground">Responses</Label><Input type="number" value={editing.limits.responses} onChange={(e) => setEditing({ ...editing, limits: { ...editing.limits, responses: Number(e.target.value) } })} /></div>
                  <div className="space-y-1"><Label className="text-xs text-muted-foreground">Users</Label><Input type="number" value={editing.limits.users} onChange={(e) => setEditing({ ...editing, limits: { ...editing.limits, users: Number(e.target.value) } })} /></div>
                </div>
              </div>

              <div>
                <Label>Features</Label>
                <div className="mt-2 flex gap-2">
                  <Input placeholder="Add a feature and press Enter" value={featureText}
                    onChange={(e) => setFeatureText(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addFeature(); } }} />
                  <Button type="button" onClick={addFeature}>Add</Button>
                </div>
                <ul className="mt-3 space-y-1">
                  {editing.features.map((f, i) => (
                    <li key={i} className="flex items-center justify-between rounded-md border p-2 text-sm">
                      <span>{f}</span>
                      <Button variant="ghost" size="icon" onClick={() => removeFeature(i)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button onClick={save}>{isNew ? "Create" : "Save changes"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this plan?</AlertDialogTitle>
            <AlertDialogDescription>Subscribers on this plan will need to migrate.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
