import { Sidebar, SidebarProvider } from "@/components/ui/sidebar";
import { useLocation } from "wouter";
import {
  Home,
  PlusCircle,
  Folder,
  FileText,
  MapPin,
  ShieldCheck,
  Landmark,
  User,
  HelpCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

const menuItems = [
  { key: "dashboard", label: "Dashboard", icon: Home, href: "/dashboard" },
  { key: "new-verification", label: "New Verification", icon: PlusCircle, href: "/dashboard?menu=new-verification" },
  { key: "fetch-docs", label: "Fetch Documents", icon: FileText, href: "/dashboard?menu=fetch-docs" },
  { key: "vault", label: "eProp Vault", icon: Folder, href: "/dashboard?menu=vault" },
  { key: "reports", label: "My Reports", icon: FileText, href: "/dashboard?menu=reports" },
  { key: "map", label: "Property Map", icon: MapPin, href: "/dashboard?menu=map" },
  { key: "legal", label: "Legal Checks", icon: ShieldCheck, href: "/dashboard?menu=legal" },
  { key: "zoning", label: "Zoning Info", icon: Landmark, href: "/dashboard?menu=zoning" },
  { key: "profile", label: "Profile", icon: User, href: "/dashboard?menu=profile" },
  { key: "help", label: "Help & Support", icon: HelpCircle, href: "/dashboard?menu=help" },
];

export default function DashboardSidebar({ onMenuSelect }: { onMenuSelect?: (key: string) => void }) {
  const [location] = useLocation();
  const { user } = useAuth();
  const displayName = user?.username || user?.email || "User";
  return (
    <SidebarProvider>
      <aside className="w-64 bg-white shadow-lg min-h-screen flex flex-col">
        <Sidebar className="h-screen w-64 bg-frosted border-r shadow-sm flex flex-col py-6 px-3">
          <div className="mb-8 px-2">
            <h2 className="text-base font-medium text-main mb-8">Hello, {displayName}!</h2>
          </div>
          <nav className="flex-1 flex flex-col gap-2 overflow-hidden">
            {menuItems.map((item, idx) => {
              const isActive = location.includes(item.key);
              return (
                <a
                  key={item.key}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-5 py-3 text-base font-medium transition-colors group",
                    isActive
                      ? `${idx % 2 === 0 ? 'bg-accent-blue' : 'bg-accent-mint'} text-white rounded-2xl shadow-sm`
                      : "text-main hover:bg-accent-blue/10 hover:text-accent-blue rounded-2xl"
                  )}
                  style={{ minHeight: 48 }}
                  onClick={e => {
                    if (onMenuSelect) {
                      e.preventDefault();
                      onMenuSelect(item.key);
                    }
                  }}
                >
                  <item.icon className={cn("h-5 w-5", isActive ? "text-white" : "text-accent-blue group-hover:text-accent-blue")} />
                  {item.label}
                </a>
              );
            })}
          </nav>
        </Sidebar>
      </aside>
    </SidebarProvider>
  );
} 