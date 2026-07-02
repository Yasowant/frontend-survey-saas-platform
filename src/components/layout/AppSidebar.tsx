import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  FileText,
  Plus,
  FilePen,
  Archive,
  MessageSquare,
  BarChart3,
  CreditCard,
  Bell,
  ScrollText,
  Settings,
  User2,
  LogOut,
  Sparkles,
  Users,
  Shield,
  KeyRound,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { authService } from "@/features/auth/services/auth.service";

const sections = [
  {
    label: "Overview",
    items: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    label: "Survey Management",
    items: [
      {
        title: "All Surveys",
        url: "/surveys",
        icon: FileText,
      },
      {
        title: "Create Survey",
        url: "/surveys/create",
        icon: Plus,
      },
      {
        title: "Draft Surveys",
        url: "/surveys/drafts",
        icon: FilePen,
      },
      {
        title: "Archived",
        url: "/surveys/archived",
        icon: Archive,
      },
    ],
  },
  {
    label: "Responses",
    items: [
      {
        title: "All Responses",
        url: "/responses",
        icon: MessageSquare,
      },
      {
        title: "Analytics",
        url: "/analytics",
        icon: BarChart3,
      },
    ],
  },
  {
    label: "Access Control",
    items: [
      {
        title: "Users",
        url: "/users",
        icon: Users,
      },
      {
        title: "Roles",
        url: "/roles",
        icon: Shield,
      },
      {
        title: "Permissions",
        url: "/permissions",
        icon: KeyRound,
      },
    ],
  },
  {
    label: "Plan",
    items: [
      {
        title: "Your Plan (Free)",
        url: "/subscription",
        icon: CreditCard,
      },
    ],
  },
  {
    label: "System",
    items: [
      {
        title: "Notifications",
        url: "/notifications",
        icon: Bell,
      },
      {
        title: "Audit Logs",
        url: "/audit",
        icon: ScrollText,
      },
      {
        title: "Settings",
        url: "/settings",
        icon: Settings,
      },
      {
        title: "Profile",
        url: "/profile",
        icon: User2,
      },
    ],
  },
];

export function AppSidebar() {
  const { state } = useSidebar();

  const collapsed = state === "collapsed";

  const pathname = useRouterState({
    select: (r) => r.location.pathname,
  });

  const navigate = useNavigate();

  const isActive = (url: string) =>
    pathname === url || (url !== "/dashboard" && pathname.startsWith(url));

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
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b">
        <div className="flex items-center gap-2 px-2 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Sparkles className="h-4 w-4" />
          </div>

          {!collapsed && (
            <div>
              <div className="text-sm font-semibold">Survesy</div>

              <div className="text-[10px] text-muted-foreground">Enterprise SaaS</div>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        {sections.map((sec) => (
          <SidebarGroup key={sec.label}>
            <SidebarGroupLabel>{sec.label}</SidebarGroupLabel>

            <SidebarGroupContent>
              <SidebarMenu>
                {sec.items.map((item) => (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton asChild isActive={isActive(item.url)}>
                      <Link to={item.url} className="flex items-center gap-2">
                        <item.icon className="h-4 w-4" />

                        {!collapsed && <span>{item.title}</span>}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout}>
              <LogOut className="h-4 w-4" />

              {!collapsed && <span>Logout</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
