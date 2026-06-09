import { Link } from "@tanstack/react-router";
import { ArrowLeft, User, Mail, Calendar, ShieldCheck, Activity, CheckCircle2 } from "lucide-react";

import { useUser } from "../hooks/useUser";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Props {
  userId: string;
}

export function UserDetailsPage({ userId }: Props) {
  const { data, isLoading } = useUser(userId);

  const user = data?.data;

  if (isLoading) {
    return (
      <div className="flex min-h-[600px] items-center justify-center">
        <div className="space-y-4 text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-muted-foreground">Loading User Details...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <Card className="border-0 shadow-xl">
        <CardContent className="py-20 text-center">
          <User className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />

          <h2 className="text-2xl font-bold">User Not Found</h2>

          <p className="mt-2 text-muted-foreground">The requested user does not exist.</p>
        </CardContent>
      </Card>
    );
  }

  const initials = `${user.firstName} ${user.lastName}`
    .split(" ")
    .map((name: string) => name[0])
    .join("")
    .toUpperCase();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="mx-auto max-w-7xl space-y-6 p-6">
        {/* Back Button */}
        <Button asChild variant="ghost" className="hover:bg-white hover:shadow-md">
          <Link to="/users">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Users
          </Link>
        </Button>

        {/* HERO SECTION */}
        <Card className="relative overflow-hidden border-0 shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600" />

          <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-white/10 blur-3xl" />

          <div className="absolute -bottom-40 -left-20 h-96 w-96 rounded-full bg-white/10 blur-3xl" />

          <CardContent className="relative z-10 p-10">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-center">
              <Avatar className="h-32 w-32 border-[6px] border-white shadow-2xl">
                <AvatarFallback className="bg-white text-3xl font-bold text-violet-700">
                  {initials}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 text-white">
                <h1 className="text-4xl font-bold">
                  {user.firstName} {user.lastName}
                </h1>

                <div className="mt-3 flex items-center gap-2 text-white/90">
                  <Mail className="h-4 w-4" />
                  {user.email}
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Badge
                    className={
                      user.isActive
                        ? "bg-emerald-500 text-white hover:bg-emerald-500"
                        : "bg-red-500 text-white hover:bg-red-500"
                    }
                  >
                    {user.isActive ? "Active User" : "Inactive User"}
                  </Badge>

                  <Badge className="bg-blue-500 text-white hover:bg-blue-500">
                    {user.isEmailVerified ? "Email Verified" : "Verification Pending"}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* STATS */}
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <StatsCard
            title="Account Status"
            value={user.isActive ? "Active" : "Inactive"}
            icon={<Activity className="h-6 w-6 text-emerald-600" />}
            iconBg="bg-emerald-100"
          />

          <StatsCard
            title="Verification"
            value={user.isEmailVerified ? "Verified" : "Pending"}
            icon={<ShieldCheck className="h-6 w-6 text-blue-600" />}
            iconBg="bg-blue-100"
          />

          <StatsCard
            title="Member Since"
            value={new Date(user.createdAt).toLocaleDateString()}
            icon={<Calendar className="h-6 w-6 text-orange-600" />}
            iconBg="bg-orange-100"
          />

          <StatsCard
            title="Profile"
            value="Completed"
            icon={<CheckCircle2 className="h-6 w-6 text-violet-600" />}
            iconBg="bg-violet-100"
          />
        </div>

        {/* DETAILS */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="border-0 bg-white/80 shadow-xl backdrop-blur-xl">
            <CardContent className="p-6">
              <h2 className="mb-6 text-xl font-bold">Personal Information</h2>

              <div className="space-y-4">
                <InfoRow
                  icon={<User className="h-4 w-4" />}
                  label="First Name"
                  value={user.firstName}
                />

                <InfoRow
                  icon={<User className="h-4 w-4" />}
                  label="Last Name"
                  value={user.lastName}
                />

                <InfoRow
                  icon={<Mail className="h-4 w-4" />}
                  label="Email Address"
                  value={user.email}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-white/80 shadow-xl backdrop-blur-xl">
            <CardContent className="p-6">
              <h2 className="mb-6 text-xl font-bold">Account Information</h2>

              <div className="space-y-4">
                <InfoRow
                  icon={<Activity className="h-4 w-4" />}
                  label="Status"
                  value={user.isActive ? "Active" : "Inactive"}
                />

                <InfoRow
                  icon={<ShieldCheck className="h-4 w-4" />}
                  label="Email Verification"
                  value={user.isEmailVerified ? "Verified" : "Pending"}
                />

                <InfoRow
                  icon={<Calendar className="h-4 w-4" />}
                  label="Created At"
                  value={new Date(user.createdAt).toLocaleString()}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function StatsCard({
  title,
  value,
  icon,
  iconBg,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  iconBg: string;
}) {
  return (
    <Card className="group border-0 bg-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
      <CardContent className="flex items-center justify-between p-6">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>

          <h3 className="mt-2 text-xl font-bold">{value}</h3>
        </div>

        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${iconBg}`}>
          {icon}
        </div>
      </CardContent>
    </Card>
  );
}

function InfoRow({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between rounded-xl border bg-slate-50 p-4 transition-all hover:bg-slate-100">
      <div className="flex items-center gap-3">
        {icon}
        <span className="text-sm text-muted-foreground">{label}</span>
      </div>

      <span className="font-semibold">{value}</span>
    </div>
  );
}
