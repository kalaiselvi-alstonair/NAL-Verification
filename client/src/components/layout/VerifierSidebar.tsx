import { Sidebar, SidebarProvider } from "@/components/ui/sidebar";
import { useLocation } from "wouter";
import {
  ListChecks,
  BadgeCheck,
  AlertTriangle,
  FileText,
  ClipboardList,
  BarChart2,
  BookOpenCheck,
  UserCheck,
  Home,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

const menuItems = [
  { key: "home", label: "Dashboard", icon: Home },
  { key: "ongoing", label: "Ongoing Verifications", icon: ListChecks },
  { key: "verified", label: "Verified Properties", icon: BadgeCheck },
  { key: "action", label: "Action Center", icon: AlertTriangle },
  { key: "reports", label: "My Reports", icon: FileText },
  { key: "consent", label: "Consent Logs", icon: ClipboardList },
  { key: "insights", label: "Verification Insights", icon: BookOpenCheck },
  { key: "analytics", label: "Analytics & Monitoring", icon: BarChart2 },
];

export default function VerifierSidebar({ onMenuSelect, selectedKey }: { onMenuSelect?: (key: string) => void, selectedKey?: string }) {
  const { user } = useAuth();
  const displayName = user?.username || user?.email || "Verifier";
  return (
    <SidebarProvider>
      <aside className="w-64 bg-white shadow-lg min-h-screen flex flex-col">
        <Sidebar className="h-screen w-64 bg-frosted border-r shadow-sm flex flex-col py-6 px-3 overflow-y-auto">
          <div className="mb-8 px-2">
            <h2 className="text-base font-medium text-main mb-8">Hello, {displayName}!</h2>
          </div>
          <nav className="flex-1 flex flex-col gap-2">
            {menuItems.map((item, idx) => {
              const isActive = selectedKey === item.key;
              return (
                <button
                  key={item.key}
                  className={cn(
                    "flex items-center gap-3 px-5 py-3 text-base font-medium transition-colors group w-full text-left",
                    isActive
                      ? `${idx % 2 === 0 ? 'bg-accent-blue' : 'bg-accent-mint'} text-white rounded-2xl shadow-sm`
                      : "text-main hover:bg-accent-blue/10 hover:text-accent-blue rounded-2xl"
                  )}
                  style={{ minHeight: 48 }}
                  onClick={() => onMenuSelect && onMenuSelect(item.key)}
                >
                  <item.icon className={cn("h-5 w-5", isActive ? "text-white" : "text-accent-blue group-hover:text-accent-blue")} />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </Sidebar>
      </aside>
    </SidebarProvider>
  );
} 