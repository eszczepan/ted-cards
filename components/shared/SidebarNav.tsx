import { Brain, FileText, HelpCircle, Home, LogOut, Send, Settings, GlobeLock } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar";
import { logout } from "@/lib/actions/auth.actions";
import { Button } from "@/components/ui/button";
import { InlineAlert } from "@/components/shared/InlineAlert";
import { createClient } from "@/supabase/supabase.server";

const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "My Flashcards",
    url: "/flashcards",
    icon: Brain,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
];

const helpItems = [
  {
    title: "Support",
    url: "/support",
    icon: HelpCircle,
  },
  {
    title: "Feedback",
    url: "/feedback",
    icon: Send,
  },
  {
    title: "Terms of Service",
    url: "/terms",
    icon: FileText,
  },
  {
    title: "Privacy Policy",
    url: "/privacy",
    icon: GlobeLock,
  },
];

export async function SidebarNav() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isTestAccount = user?.email?.endsWith("@test.com") || false;

  return (
    <Sidebar>
      {isTestAccount && (
        <div className="px-4 pt-3">
          <InlineAlert message="This is a test account, only for demo purposes." variant="info" />
        </div>
      )}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Ted Cards</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarGroup>
          <SidebarGroupLabel>Help</SidebarGroupLabel>
          <SidebarGroupContent>
            {helpItems.map((item) => (
              <SidebarMenu key={item.title}>
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            ))}
          </SidebarGroupContent>
        </SidebarGroup>
        <form action={logout}>
          <Button type="submit" className="mb-6 w-full max-w-xs">
            <LogOut />
            Log out
          </Button>
        </form>
      </SidebarFooter>
    </Sidebar>
  );
}
