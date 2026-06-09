import { Bell, Moon, Search, LogOut, User2, Settings } from "lucide-react";

import { Link, useNavigate } from "@tanstack/react-router";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import { Badge } from "@/components/ui/badge";

import { useState } from "react";
import { authService } from "@/features/auth/services/auth.service";

export function Topbar() {
  const navigate = useNavigate();

  const [unread] = useState(0);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const initials = `${user?.firstName ?? ""} ${user?.lastName ?? ""}`
    .trim()
    .split(" ")
    .filter(Boolean)
    .map((v: string) => v[0])
    .join("")
    .toUpperCase();

  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");

      if (refreshToken) {
        await authService.logout(refreshToken);
      }
    } catch (error) {
      console.error(error);
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      navigate({
        to: "/login",
      });
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b bg-background/80 px-3 backdrop-blur md:px-4">
      <SidebarTrigger />

      <div className="relative hidden flex-1 max-w-md md:block">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

        <Input placeholder="Search surveys, responses, users…" className="pl-9 h-9" />
      </div>

      <div className="ml-auto flex items-center gap-1">
        <Button variant="ghost" size="icon" disabled aria-label="Theme">
          <Moon className="h-4 w-4" />
        </Button>

        <Button variant="ghost" size="icon" asChild className="relative">
          <Link to="/notifications" aria-label="Notifications">
            <Bell className="h-4 w-4" />

            {unread > 0 && (
              <Badge className="absolute -right-1 -top-1 h-5 min-w-5 justify-center rounded-full p-0 text-[10px]">
                {unread}
              </Badge>
            )}
          </Link>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="text-sm font-medium">
                {`${user?.firstName ?? ""} ${user?.lastName ?? ""}`}
              </div>

              <div className="text-xs text-muted-foreground">{user?.email ?? ""}</div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={() =>
                navigate({
                  to: "/profile",
                })
              }
            >
              <User2 className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() =>
                navigate({
                  to: "/settings",
                })
              }
            >
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
