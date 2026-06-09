import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { KEYS, read, write } from "@/lib/storage";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/settings")({ component: Settings });

interface S {
  workspaceName: string;
  defaultLanguage: string;
  allowAnonymous: boolean;
  requireEmail: boolean;
  emailNotifs: boolean;
  pushNotifs: boolean;
  twoFactor: boolean;
}
const DEFAULTS: S = {
  workspaceName: "Acme Inc",
  defaultLanguage: "English",
  allowAnonymous: true,
  requireEmail: false,
  emailNotifs: true,
  pushNotifs: false,
  twoFactor: false,
};

function Settings() {
  const [s, setS] = useState<S>(() => read<S>(KEYS.settings, DEFAULTS));
  const save = () => {
    write(KEYS.settings, s);
    toast.success("Settings saved");
  };

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
      <Tabs defaultValue="general">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="surveys">Surveys</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="theme">Theme</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Workspace name</Label>
                <Input
                  value={s.workspaceName}
                  onChange={(e) => setS({ ...s, workspaceName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Default language</Label>
                <Input
                  value={s.defaultLanguage}
                  onChange={(e) => setS({ ...s, defaultLanguage: e.target.value })}
                />
              </div>
              <Button onClick={save}>Save</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="surveys">
          <Card>
            <CardHeader>
              <CardTitle>Survey defaults</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Allow anonymous responses</Label>
                <Switch
                  checked={s.allowAnonymous}
                  onCheckedChange={(v) => setS({ ...s, allowAnonymous: v })}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Require email on response</Label>
                <Switch
                  checked={s.requireEmail}
                  onCheckedChange={(v) => setS({ ...s, requireEmail: v })}
                />
              </div>
              <Button onClick={save}>Save</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Email notifications</Label>
                <Switch
                  checked={s.emailNotifs}
                  onCheckedChange={(v) => setS({ ...s, emailNotifs: v })}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Push notifications</Label>
                <Switch
                  checked={s.pushNotifs}
                  onCheckedChange={(v) => setS({ ...s, pushNotifs: v })}
                />
              </div>
              <Button onClick={save}>Save</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security</CardTitle>
              <CardDescription>Protect your account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Two-factor authentication</Label>
                <Switch
                  checked={s.twoFactor}
                  onCheckedChange={(v) => setS({ ...s, twoFactor: v })}
                />
              </div>
              <Button onClick={save}>Save</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="theme">
          <Card>
            <CardHeader>
              <CardTitle>Theme</CardTitle>
            </CardHeader>
            {/* <CardContent className="space-y-3">
              <div className="flex gap-2">
                <Button
                  variant={theme === "light" ? "default" : "outline"}
                  onClick={() => setTheme("light")}
                >
                  Light
                </Button>
                <Button
                  variant={theme === "dark" ? "default" : "outline"}
                  onClick={() => setTheme("dark")}
                >
                  Dark
                </Button>
              </div>
            </CardContent> */}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
