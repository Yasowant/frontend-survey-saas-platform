import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Shield, Users, KeyRound, Activity, Pencil, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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

import { useRole } from "@/features/roles/hooks/useRole";
import { useUsers } from "@/features/users/hooks/userUsers";
import { useDeleteRole } from "@/features/roles/hooks/useDeleteRole";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useUpdateRole } from "@/features/roles/hooks/useUpdateRole";
import { usePermissions } from "@/features/permissions/hooks/usePermissions";
import { useRolePermissions } from "@/hooks/useRolePermissions";
import { useState } from "react";

export const Route = createFileRoute("/_app/roles/$id")({
  component: RoleDetails,
});

function RoleDetails() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const [openUpdate, setOpenUpdate] = useState(false);
  const [roleName, setRoleName] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const { mutate: deleteRole } = useDeleteRole();
  const { mutate: updaeRole, isPending } = useUpdateRole();
  const { data: permissionsData } = usePermissions();
  const { hasPermission } = useRolePermissions();
  console.log(hasPermission, "Has Permisiion");

  const handleOpenUpdate = () => {
    setRoleName(role.name);
    setSelectedPermissions(role.permissions.map((permission: any) => permission._id));
    setOpenUpdate(true);
  };

  const handlePermissionSelect = (permissionId: string) => {
    if (selectedPermissions.includes(permissionId)) {
      setSelectedPermissions(selectedPermissions.filter((id) => id !== permissionId));
    } else {
      setSelectedPermissions([...selectedPermissions, permissionId]);
    }
  };

  const { data, isLoading } = useRole(id);
  const { data: usersData } = useUsers();

  const allUsers = usersData?.data || [];

  const users = allUsers.filter((user: any) => user.roleIds?.includes(id));

  const role = data?.data;
  const permissions = role?.permissions ?? [];
  const handleUpdateRole = () => {
    updaeRole(
      {
        id,
        payload: {
          name: roleName,
          permissions: selectedPermissions,
        },
      },
      {
        onSuccess: () => {
          toast.success("Role updated successfully");

          setOpenUpdate(false);
        },
        onError: (error: any) => {
          toast.error(error?.response?.data?.message || "Failed to update role");
        },
      },
    );
  };
  const handleDeleteRole = () => {
    const confirmed = window.confirm(`Are you sure you want to delete "${role.name}"?`);

    if (!confirmed) return;

    deleteRole(id, {
      onSuccess: () => {
        toast.success("Role deleted successfully");

        navigate({
          to: "/roles",
        });
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message || "Failed to delete role");
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex h-[500px] items-center justify-center">
        <div className="space-y-3 text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-muted-foreground">Loading role details...</p>
        </div>
      </div>
    );
  }

  if (!role) {
    return (
      <div className="space-y-4">
        <Button asChild variant="ghost">
          <Link to="/roles">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Link>
        </Button>

        <Card>
          <CardContent className="py-20 text-center">
            <Shield className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
            <h2 className="text-xl font-semibold">Role not found</h2>
            <p className="mt-2 text-muted-foreground">The requested role does not exist.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button asChild variant="ghost" size="sm">
        <Link to="/roles">
          <ArrowLeft className="mr-2 h-4 w-4" />
          All Roles
        </Link>
      </Button>

      {/* Hero Header */}
      <Card className="overflow-hidden border-0 shadow-lg">
        <div className="h-32 bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600" />

        <CardContent className="relative pb-8">
          <div className="-mt-12 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-24 w-24 items-center justify-center rounded-3xl border-4 border-background bg-background shadow-lg">
                <Shield className="h-10 w-10 text-primary" />
              </div>

              <div className="bg-white px-[20px] py-[14px] rounded-[21px] shadow-[0px 2px 3px #cccc]">
                <h1 className="text-3xl font-bold tracking-tight">{role.name}</h1>

                <p className="mt-1 text-muted-foreground">
                  {role.description || "No description available"}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Badge className="h-fit px-4 py-2 text-sm">Active Role</Badge>

              {hasPermission("ROLE_UPDATE") && (
                <Button variant="outline" size="sm" className="gap-2" onClick={handleOpenUpdate}>
                  <Pencil className="h-4 w-4" />
                  Update Role
                </Button>
              )}

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  {hasPermission("ROLE_DELETE") && (
                    <Button variant="destructive" size="sm">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Role
                    </Button>
                  )}
                </AlertDialogTrigger>

                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Role?</AlertDialogTitle>
                    <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                  </AlertDialogHeader>

                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>

                    <AlertDialogAction onClick={handleDeleteRole}>Delete</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm text-muted-foreground">Permissions</p>

              <h2 className="mt-2 text-3xl font-bold">{permissions.length}</h2>
            </div>

            <KeyRound className="h-8 w-8 text-primary" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm text-muted-foreground">Assigned Users</p>

              <h2 className="mt-2 text-3xl font-bold">{users.length}</h2>
            </div>

            <Users className="h-8 w-8 text-primary" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm text-muted-foreground">Status</p>

              <h2 className="mt-2 text-xl font-bold text-green-600">Active</h2>
            </div>

            <Activity className="h-8 w-8 text-green-600" />
          </CardContent>
        </Card>
      </div>

      <Dialog open={openUpdate} onOpenChange={setOpenUpdate}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Update Role</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium">Role Name</label>

              <Input value={roleName} onChange={(e) => setRoleName(e.target.value)} />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Permissions</label>

              <Select onValueChange={(value) => handlePermissionSelect(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select permission" />
                </SelectTrigger>

                <SelectContent>
                  {permissionsData?.data?.map((permission: any) => (
                    <SelectItem key={permission._id} value={permission._id}>
                      {permission.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-wrap gap-2">
              {selectedPermissions.map((permissionId) => {
                const permission = permissionsData?.data?.find((p: any) => p._id === permissionId);

                return (
                  <Badge key={permissionId} variant="secondary">
                    {permission?.name}
                  </Badge>
                );
              })}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenUpdate(false)}>
              Cancel
            </Button>

            <Button onClick={handleUpdateRole} disabled={isPending}>
              {isPending ? "Updating..." : "Update Role"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Main Section */}
      <div className="grid gap-6 xl:grid-cols-3">
        {/* Permissions */}
        <Card className="xl:col-span-2">
          <CardContent className="p-6">
            <div className="mb-6 flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />

              <h2 className="text-lg font-semibold">Permissions</h2>
            </div>

            {permissions.length > 0 ? (
              <div className="flex flex-wrap gap-3">
                {permissions.map((permission: any) => (
                  <div
                    key={permission._id}
                    className="
                      rounded-full
                      border
                      bg-primary/5
                      px-4
                      py-2
                      text-sm
                      font-medium
                      text-primary
                      transition-all
                      hover:bg-primary/10
                    "
                  >
                    {permission.name}
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed p-10 text-center">
                No permissions assigned
              </div>
            )}
          </CardContent>
        </Card>

        {/* Users */}
        <Card>
          <CardContent className="p-6">
            <div className="mb-6 flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />

              <h2 className="text-lg font-semibold">Assigned Users</h2>
            </div>

            {users.length === 0 ? (
              <div className="rounded-xl border border-dashed p-10 text-center">
                No users assigned
              </div>
            ) : (
              <div className="space-y-3">
                {users.map((user: any) => (
                  <Link
                    key={user._id}
                    to="/users/$id"
                    params={{ id: user._id }}
                    className="
                      flex
                      items-center
                      gap-4
                      rounded-xl
                      border
                      p-4
                      transition-all
                      hover:-translate-y-1
                      hover:shadow-md
                    "
                  >
                    <Avatar className="h-12 w-12">
                      <AvatarFallback>
                        {user.firstName?.[0]}
                        {user.lastName?.[0]}
                      </AvatarFallback>
                    </Avatar>

                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">
                        {user.firstName} {user.lastName}
                      </p>

                      <p className="truncate text-sm text-muted-foreground">{user.email}</p>
                    </div>

                    <Badge>{user.status}</Badge>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
