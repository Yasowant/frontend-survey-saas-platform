import { Shield, KeyRound, Search, Activity, Plus } from "lucide-react";

import { usePermissions } from "../hooks/usePermissions";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useCreatePermission } from "../hooks/useCreatePermissions";
import { Dialog, DialogDescription, DialogTitle, DialogTrigger } from "@radix-ui/react-dialog";
import { DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function PermissionsPage() {
  const { data, isLoading } = usePermissions();
  const { mutate: createPermission, isPending } = useCreatePermission();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const permissions = data?.data || [];

  if (isLoading) {
    return (
      <div className="flex h-[500px] items-center justify-center">
        <div className="space-y-3 text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-muted-foreground">Loading permissions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <Card className="relative overflow-hidden border-0 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 shadow-2xl">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.25),transparent_40%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.15),transparent_40%)]" />

        <CardContent className="relative p-8 lg:p-10">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            {/* Left Section */}
            <div className="flex items-start gap-5">
              <div
                className="
            flex h-20 w-20 shrink-0 items-center justify-center
            rounded-3xl
            bg-gradient-to-br from-indigo-500 to-blue-600
            shadow-lg shadow-indigo-500/30
          "
              >
                <Shield className="h-10 w-10 text-white" />
              </div>

              <div>
                <h1 className="text-3xl font-bold tracking-tight text-white lg:text-4xl">
                  Permissions
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-300 lg:text-base">
                  Control user access, secure resources, and manage platform permissions across your
                  organization.
                </p>
              </div>
            </div>

            {/* Right Section */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              {/* Create Permission */}
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button
                    size="lg"
                    className="
                h-14 gap-2 rounded-xl
                bg-white text-slate-900
                shadow-lg
                hover:bg-slate-100
              "
                  >
                    <Plus className="h-4 w-4" />
                    Create Permission
                  </Button>
                </DialogTrigger>

                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Create Permission</DialogTitle>

                    <DialogDescription>Add a new permission to your platform.</DialogDescription>
                  </DialogHeader>

                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Permission Name</Label>

                      <Input
                        placeholder="e.g. USER_CREATE"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Description</Label>

                      <Textarea
                        placeholder="Describe this permission..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      />
                    </div>

                    <Button
                      className="w-full"
                      disabled={isPending}
                      onClick={() =>
                        createPermission(
                          { name, description },
                          {
                            onSuccess: () => {
                              setName("");
                              setDescription("");
                              setOpen(false);
                            },
                          },
                        )
                      }
                    >
                      {isPending ? "Creating..." : "Create Permission"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm text-muted-foreground">Total Permissions</p>

              <h2 className="mt-2 text-3xl font-bold">{permissions.length}</h2>
            </div>

            <KeyRound className="h-8 w-8 text-primary" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm text-muted-foreground">Active Permissions</p>

              <h2 className="mt-2 text-3xl font-bold">{permissions.length}</h2>
            </div>

            <Activity className="h-8 w-8 text-green-500" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm text-muted-foreground">Security Level</p>

              <h2 className="mt-2 text-xl font-bold">High</h2>
            </div>

            <Shield className="h-8 w-8 text-orange-500" />
          </CardContent>
        </Card>
      </div>

      {/* Table Section */}
      <Card className="border-0 shadow-md">
        <CardContent className="p-0">
          {/* Header */}
          <div className="flex flex-col gap-4 border-b p-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-semibold">Permissions Directory</h2>

              <p className="text-sm text-muted-foreground">
                View and manage all system permissions.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="h-9 rounded-full px-4">
                {permissions.length} Permissions
              </Badge>

              <div className="relative w-[280px]">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                <Input placeholder="Search permissions..." className="pl-10" />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30 hover:bg-muted/30">
                  <TableHead className="h-14 font-semibold">Permission</TableHead>

                  <TableHead className="font-semibold">Description</TableHead>

                  <TableHead className="font-semibold">Created Date</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {permissions.map((permission: any) => (
                  <TableRow
                    key={permission._id}
                    className="
                h-16
                transition-all
                hover:bg-primary/5
              "
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-primary/10 p-2">
                          <Shield className="h-4 w-4 text-primary" />
                        </div>

                        <Badge variant="outline" className="rounded-full">
                          {permission.name}
                        </Badge>
                      </div>
                    </TableCell>

                    <TableCell>
                      <span className="text-muted-foreground">{permission.description}</span>
                    </TableCell>

                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {new Date(permission.createdAt).toLocaleDateString()}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}

                {permissions.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} className="py-20 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="rounded-full bg-muted p-4">
                          <Shield className="h-8 w-8 text-muted-foreground" />
                        </div>

                        <h3 className="font-semibold">No Permissions Found</h3>

                        <p className="text-sm text-muted-foreground">
                          Permissions will appear here once created.
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
