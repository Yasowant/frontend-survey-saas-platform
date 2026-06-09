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

export function PermissionsPage() {
  const { data, isLoading } = usePermissions();

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
      <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 shadow-2xl">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-black/10" />

        <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-white/10 blur-3xl animate-pulse" />

        <div className="absolute -bottom-24 left-10 h-56 w-56 rounded-full bg-white/10 blur-3xl animate-pulse delay-1000" />

        <CardContent className="relative z-10 p-8 lg:p-10">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            {/* Left Content */}
            <div className="flex items-center gap-5">
              <div
                className="
            flex h-20 w-20 items-center justify-center
            rounded-3xl
            border border-white/20
            bg-white/15
            backdrop-blur-md
            shadow-xl
            transition-all duration-300
            hover:scale-105
          "
              >
                <Shield className="h-10 w-10 text-white" />
              </div>

              <div>
                <h1 className="text-4xl font-bold tracking-tight text-white">Permissions</h1>

                <p className="mt-2 max-w-2xl text-white/80">
                  Control access, secure resources, and manage platform permissions across your
                  organization.
                </p>
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-4">
              <div className="rounded-2xl border border-white/20 bg-white/10 px-6 py-4 backdrop-blur-md">
                <p className="text-xs uppercase tracking-wider text-white/70">Total Permissions</p>

                <p className="mt-1 text-3xl font-bold text-white">{permissions.length}</p>
              </div>

              {/* <Button
                disabled
                size="lg"
                className="
            gap-2
            border border-white/20
            bg-white
            text-black
            shadow-lg
            hover:bg-white
            disabled:opacity-70
          "
              >
                <Plus className="h-4 w-4" />
                Create Permission
              </Button> */}
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
