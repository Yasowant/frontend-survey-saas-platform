import { Link } from "@tanstack/react-router";
import { Shield, Eye, Users, KeyRound, Activity, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useRoles } from "../hooks/useRoles";
import { useUsers } from "@/features/users/hooks/userUsers";
import { useCreateRole } from "../hooks/useCreateRole";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { usePermissions } from "@/features/permissions/hooks/usePermissions";
import { useState } from "react";

export function RolesPage() {
  const [open, setOpen] = useState(false);
  const [roleName, setRoleName] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const { data: rolesData, isLoading: rolesLoading } = useRoles();
  const { data: usersData, isLoading: usersLoading } = useUsers();
  const { mutate: createRole, isPending } = useCreateRole();

  const { data: permissionsData } = usePermissions();

  const permissions = permissionsData?.data || [];
  const handelCreateRole = () => {
    if (!roleName.trim()) {
      return;
    }
    createRole(
      {
        name: roleName,
        permissions: selectedPermissions,
      },
      {
        onSuccess: () => {
          setOpen(false);
          setRoleName("");
          setSelectedPermissions([]);
        },
        onError: (error) => {
          console.error("Failed to Create role", error);
        },
      },
    );
  };

  const handlePermissionSelect = (permissionId: string) => {
    if (selectedPermissions.includes(permissionId)) {
      setSelectedPermissions(selectedPermissions.filter((id) => id !== permissionId));
    } else {
      setSelectedPermissions([...selectedPermissions, permissionId]);
    }
  };

  const roles = rolesData?.data || [];
  const users = usersData?.data || [];

  const getUserCount = (roleId: string) => {
    return users.filter((user: any) => user.roleIds?.includes(roleId)).length;
  };

  if (rolesLoading || usersLoading) {
    return (
      <div className="flex h-[500px] items-center justify-center">
        <div className="space-y-3 text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />

          <p className="text-muted-foreground">Loading roles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-slate-900 via-indigo-900 to-violet-900 shadow-2xl">
        <div className="absolute inset-0 bg-black/10" />

        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-3xl" />

        <div className="absolute -bottom-20 left-10 h-48 w-48 rounded-full bg-white/10 blur-3xl" />

        <CardContent className="relative z-10 p-8">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-5">
              <div className="rounded-3xl border border-white/20 bg-white/10 p-5 backdrop-blur-md">
                <Shield className="h-10 w-10 text-white" />
              </div>

              <div>
                <h1 className="text-4xl font-bold text-white">Roles</h1>

                <p className="mt-2 text-white/70">
                  Manage system roles, permissions and access control.
                </p>
              </div>
            </div>

            <Button
              size="lg"
              className="gap-2 bg-white text-black hover:bg-white"
              onClick={() => setOpen(true)}
            >
              <Plus className="h-4 w-4" />
              Create Role
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm text-muted-foreground">Total Roles</p>

              <h2 className="mt-2 text-3xl font-bold">{roles.length}</h2>
            </div>

            <Shield className="h-8 w-8 text-primary" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm text-muted-foreground">Total Users</p>

              <h2 className="mt-2 text-3xl font-bold">{users.length}</h2>
            </div>

            <Users className="h-8 w-8 text-blue-500" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm text-muted-foreground">Active Roles</p>

              <h2 className="mt-2 text-3xl font-bold">{roles.length}</h2>
            </div>

            <Activity className="h-8 w-8 text-green-500" />
          </CardContent>
        </Card>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Create New Role</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Role Name */}
            <div>
              <label className="mb-2 block text-sm font-medium">Role Name</label>

              <Input
                placeholder="Enter role name"
                value={roleName}
                onChange={(e) => setRoleName(e.target.value)}
              />
            </div>

            {/* Permissions Dropdown */}
            <div>
              <label className="mb-2 block text-sm font-medium">Permissions</label>

              <Select onValueChange={(value) => handlePermissionSelect(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select permission" />
                </SelectTrigger>

                <SelectContent>
                  {permissions.map((permission: any) => (
                    <SelectItem key={permission._id} value={permission._id}>
                      {permission.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Selected Permissions */}
            <div className="flex flex-wrap gap-2">
              {selectedPermissions.map((permissionId) => {
                const permission = permissions.find((p: any) => p._id === permissionId);

                return (
                  <Badge key={permissionId} variant="secondary">
                    {permission?.name}
                  </Badge>
                );
              })}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>

            <Button onClick={handelCreateRole} disabled={isPending || !roleName.trim()}>
              {isPending ? "Creating..." : "Create Role"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Roles Table */}
      <Card className="border-0 shadow-md">
        <CardContent className="p-0">
          {/* Header */}
          <div className="flex flex-col gap-4 border-b p-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-semibold">Roles Directory</h2>

              <p className="text-sm text-muted-foreground">
                Browse and manage all available roles.
              </p>
            </div>

            <Badge variant="secondary" className="rounded-full px-4 py-2">
              {roles.length} Roles
            </Badge>
          </div>

          {/* Table */}
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30">
                <TableHead>Role</TableHead>
                <TableHead>Permissions</TableHead>
                <TableHead>Users</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="w-[120px]">Action</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {roles.map((role: any) => (
                <TableRow key={role._id} className="transition-all hover:bg-primary/5">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-primary/10 p-2">
                        <Shield className="h-4 w-4 text-primary" />
                      </div>

                      <div>
                        <p className="font-medium">{role.name}</p>
                        <p className="text-xs text-muted-foreground">System Role</p>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <Badge variant="secondary" className="rounded-full">
                      <KeyRound className="mr-1 h-3 w-3" />
                      {role.permissions?.length || 0}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <Badge variant="outline" className="rounded-full">
                      <Users className="mr-1 h-3 w-3" />
                      {getUserCount(role._id)}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {new Date(role.createdAt).toLocaleDateString()}
                    </span>
                  </TableCell>

                  <TableCell>
                    <Button asChild size="sm" className="gap-2">
                      <Link
                        to="/roles/$id"
                        params={{
                          id: role._id,
                        }}
                      >
                        <Eye className="h-4 w-4" />
                        View
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}

              {roles.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="rounded-full bg-muted p-4">
                        <Shield className="h-8 w-8 text-muted-foreground" />
                      </div>

                      <h3 className="font-semibold">No Roles Found</h3>

                      <p className="text-sm text-muted-foreground">
                        Roles will appear here once created.
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
