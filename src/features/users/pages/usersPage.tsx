import { Link } from "@tanstack/react-router";
import { Eye, Users, Search, UserCheck, ShieldCheck } from "lucide-react";

import { useMemo, useState } from "react";

import { useUsers } from "../hooks/userUsers";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function UsersPage() {
  const { data, isLoading } = useUsers();

  const [search, setSearch] = useState("");

  const users = data?.data || [];

  const filteredUsers = useMemo(() => {
    return users.filter((user: any) => {
      const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();

      return (
        fullName.includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase())
      );
    });
  }, [users, search]);

  const activeUsers = users.filter((user: any) => user.isActive).length;

  const verifiedUsers = users.filter((user: any) => user.isEmailVerified).length;

  if (isLoading) {
    return (
      <div className="flex min-h-[600px] items-center justify-center">
        <div className="space-y-4 text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />

          <p className="text-muted-foreground">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="space-y-6 p-6">
        {/* HERO SECTION */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 p-8 shadow-2xl">
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

          <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

          <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex items-center gap-4">
                <div className="rounded-2xl bg-white/20 p-4 backdrop-blur-xl">
                  <Users className="h-8 w-8 text-white" />
                </div>

                <div>
                  <h1 className="text-4xl font-bold text-white">Users Management</h1>

                  <p className="mt-2 text-white/80">Manage users, permissions and account status</p>
                </div>
              </div>
            </div>

            <Button disabled className="bg-white text-violet-700 hover:bg-white/90">
              Create User
            </Button>
          </div>
        </div>

        {/* STATS */}
        <div className="grid gap-5 md:grid-cols-3">
          <Card className="border-0 bg-white shadow-xl">
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <p className="text-sm text-muted-foreground">Total Users</p>

                <h2 className="mt-2 text-3xl font-bold">{users.length}</h2>
              </div>

              <div className="rounded-2xl bg-violet-100 p-3">
                <Users className="h-6 w-6 text-violet-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-white shadow-xl">
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <p className="text-sm text-muted-foreground">Active Users</p>

                <h2 className="mt-2 text-3xl font-bold">{activeUsers}</h2>
              </div>

              <div className="rounded-2xl bg-emerald-100 p-3">
                <UserCheck className="h-6 w-6 text-emerald-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-white shadow-xl">
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <p className="text-sm text-muted-foreground">Verified Users</p>

                <h2 className="mt-2 text-3xl font-bold">{verifiedUsers}</h2>
              </div>

              <div className="rounded-2xl bg-blue-100 p-3">
                <ShieldCheck className="h-6 w-6 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* TABLE CARD */}
        <Card className="overflow-hidden border-0 bg-white shadow-xl">
          <div className="border-b bg-slate-50/80 p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-xl font-bold">All Users</h2>

                <p className="text-sm text-muted-foreground">View and manage registered users</p>
              </div>

              <div className="flex items-center gap-3">
                <Badge className="bg-violet-100 text-violet-700 hover:bg-violet-100">
                  {filteredUsers.length} Users
                </Badge>

                <div className="relative w-[280px]">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />

                  <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search users..."
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </div>

          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>

                  <TableHead>Email</TableHead>

                  <TableHead>Status</TableHead>

                  <TableHead>Verification</TableHead>

                  <TableHead>Created</TableHead>

                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredUsers.map((user: any) => (
                  <TableRow key={user._id} className="transition-all hover:bg-slate-50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border shadow-sm">
                          <AvatarFallback className="bg-gradient-to-r from-violet-600 to-blue-600 font-semibold text-white">
                            {`${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`}
                          </AvatarFallback>
                        </Avatar>

                        <div>
                          <div className="font-semibold">
                            {user.firstName} {user.lastName}
                          </div>

                          <div className="text-xs text-muted-foreground">User Account</div>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <span className="font-medium">{user.email}</span>
                    </TableCell>

                    <TableCell>
                      <Badge
                        className={
                          user.isActive
                            ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
                            : "bg-red-100 text-red-700 hover:bg-red-100"
                        }
                      >
                        {user.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <Badge
                        className={
                          user.isEmailVerified
                            ? "bg-blue-100 text-blue-700 hover:bg-blue-100"
                            : "bg-orange-100 text-orange-700 hover:bg-orange-100"
                        }
                      >
                        {user.isEmailVerified ? "Verified" : "Pending"}
                      </Badge>
                    </TableCell>

                    <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>

                    <TableCell className="text-right">
                      <Button asChild size="sm" className="bg-violet-600 hover:bg-violet-700">
                        <Link
                          to="/users/$id"
                          params={{
                            id: user._id,
                          }}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}

                {filteredUsers.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="py-20 text-center">
                      <Users className="mx-auto mb-4 h-10 w-10 text-muted-foreground" />

                      <p className="font-medium">No users found</p>

                      <p className="text-sm text-muted-foreground">Try adjusting your search</p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
