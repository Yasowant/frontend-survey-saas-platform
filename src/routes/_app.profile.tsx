import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import { toast } from "sonner";

import { useProfile } from "@/features/auth/hooks/userProfile";
import { uploadAvatar } from "@/features/users/api/user.api";

export const Route = createFileRoute("/_app/profile")({
  component: Profile,
});

function Profile() {
  const { data, isLoading } = useProfile();
  console.log("FULL RESPONSE", data);

  const profile = data?.data?.data;

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const avatarMutation = useMutation({
    mutationFn: uploadAvatar,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });

      // keep topbar avatar in sync
      const stored = JSON.parse(localStorage.getItem("user") || "{}");
      const avatarUrl = res?.data?.avatarUrl;
      if (avatarUrl) {
        localStorage.setItem("user", JSON.stringify({ ...stored, avatarUrl }));
      }

      toast.success("Profile picture updated");
    },
    onError: () => toast.error("Failed to upload profile picture"),
  });

  const handleAvatarFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      return toast.error("Please select an image file");
    }

    if (file.size > 5 * 1024 * 1024) {
      return toast.error("Image must be under 5MB");
    }

    const reader = new FileReader();
    reader.onload = () => avatarMutation.mutate(reader.result as string);
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (!profile) return;

    setFirstName(profile.firstName || "");
    setLastName(profile.lastName || "");
    setEmail(profile.email || "");
  }, [profile]);

  const initials = `${profile?.firstName || ""} ${profile?.lastName || ""}`
    .trim()
    .split(" ")
    .filter(Boolean)
    .map((name) => name[0])
    .join("")
    .toUpperCase();

  const formatDate = (date?: string | null) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const handleSave = () => {
    toast.info("Update Profile API Pending");
  };

  const handlePasswordChange = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      return toast.error("Please fill all fields");
    }

    if (newPassword !== confirmPassword) {
      return toast.error("Passwords do not match");
    }

    toast.info("Change Password API Pending");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-muted-foreground">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-1">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>

        <p className="text-muted-foreground">
          Manage your account information and security settings.
        </p>
      </div>

      {/* Profile Summary */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-6 md:flex-row md:items-center">
            <Avatar className="h-24 w-24">
              {profile?.avatarUrl && (
                <AvatarImage src={profile.avatarUrl} alt="Profile picture" />
              )}
              <AvatarFallback className="text-2xl font-bold">{initials}</AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <h2 className="text-2xl font-semibold">
                {profile?.firstName} {profile?.lastName}
              </h2>

              <p className="text-muted-foreground">{profile?.email}</p>

              <div className="mt-3 flex flex-wrap gap-2">
                <Badge>{profile?.isEmailVerified ? "Email Verified" : "Email Not Verified"}</Badge>

                <Badge variant={profile?.isActive ? "default" : "destructive"}>
                  {profile?.isActive ? "Active Account" : "Inactive Account"}
                </Badge>
              </div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleAvatarFile(file);
                e.target.value = "";
              }}
            />

            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={avatarMutation.isPending}
            >
              {avatarMutation.isPending ? "Uploading…" : "Upload Avatar"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Section */}
        <div className="space-y-6 lg:col-span-2">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>

                  <Input
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>

                  <Input
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="email">Email Address</Label>

                  <Input id="email" value={email} disabled />
                </div>
              </div>

              <Button onClick={handleSave}>Save Changes</Button>
            </CardContent>
          </Card>

          {/* Account Information */}
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
            </CardHeader>

            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <p className="text-sm text-muted-foreground">User ID</p>

                  <p className="font-medium break-all">{profile?._id}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Role</p>

                  <p className="font-medium">
                    {profile?.roleIds?.length ? profile.roleIds.join(", ") : "User"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Created At</p>

                  <p className="font-medium">{formatDate(profile?.createdAt)}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Updated At</p>

                  <p className="font-medium">{formatDate(profile?.updatedAt)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Section */}
        <div className="space-y-6">
          {/* Status */}
          <Card>
            <CardHeader>
              <CardTitle>Account Status</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Email Verification</p>

                <p className="font-medium">{profile?.isEmailVerified ? "Verified" : "Pending"}</p>
              </div>

              <Separator />

              <div>
                <p className="text-sm text-muted-foreground">Account Status</p>

                <p className="font-medium">{profile?.isActive ? "Active" : "Inactive"}</p>
              </div>

              <Separator />

              <div>
                <p className="text-sm text-muted-foreground">Last Login</p>

                <p className="font-medium">
                  {profile?.lastLoginAt
                    ? new Date(profile.lastLoginAt).toLocaleString()
                    : "Never Logged In"}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Change Password */}
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Current Password</Label>

                <Input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>New Password</Label>

                <Input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Confirm Password</Label>

                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              <Button className="w-full" onClick={handlePasswordChange}>
                Update Password
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
