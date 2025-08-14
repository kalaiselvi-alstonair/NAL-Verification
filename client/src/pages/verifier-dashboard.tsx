import React, { useState } from "react";
import VerifierSidebar from "@/components/layout/VerifierSidebar";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { ChevronDown, Search, CheckCircle, Clock, RefreshCw, AlertTriangle, MoreVertical, Bell, Settings, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "wouter";
import { useEffect } from "react";
import { getAvatarUrl, getGenderFromName } from '@/lib/utils';
import { Dialog } from '@radix-ui/react-dialog';

const STATUS_COLORS = {
  completed: "bg-[#00C853] text-white", // Green
  waiting: "bg-[#FF9100] text-white", // Orange
  inprogress: "bg-[#0052CC] text-white", // Blue
  flagged: "bg-[#D32F2F] text-white", // Red
};

const STATUS_LABELS = {
  completed: { label: "Completed", icon: <CheckCircle className="inline h-4 w-4 mr-1" /> },
  waiting: { label: "Waiting for Data", icon: <Clock className="inline h-4 w-4 mr-1" /> },
  inprogress: { label: "In Progress", icon: <RefreshCw className="inline h-4 w-4 mr-1 animate-spin-slow" /> },
  flagged: { label: "Flagged", icon: <AlertTriangle className="inline h-4 w-4 mr-1" /> },
};

const mockVerifications = [
  {
    id: "P-1001",
    propertyName: "Plot 45, Whitefield",
    address: "Whitefield, Bengaluru, Karnataka",
    owner: "Ravi Kumar",
    status: "inprogress",
    progress: 60,
    updated: "2 hours ago",
  },
  {
    id: "P-1002",
    propertyName: "Flat 12B, Green Acres",
    address: "Indiranagar, Bengaluru, Karnataka",
    owner: "Priya Singh",
    status: "waiting",
    progress: 30,
    updated: "1 hour ago",
  },
  {
    id: "P-1003",
    propertyName: "Plot 78, Koramangala",
    address: "Koramangala, Bengaluru, Karnataka",
    owner: "Amit Patel",
    status: "completed",
    progress: 100,
    updated: "10 minutes ago",
  },
  {
    id: "P-1004",
    propertyName: "Flat 22C, Lakeview",
    address: "HSR Layout, Bengaluru, Karnataka",
    owner: "Sunita Rao",
    status: "flagged",
    progress: 45,
    updated: "5 minutes ago",
  },
];

type VerificationStatus = 'completed' | 'waiting' | 'inprogress' | 'flagged';

const STATUS: Record<VerificationStatus, { color: string; label: string; icon: string }> = {
  completed: { color: 'bg-[#00C853]', label: 'Completed', icon: '✅' },
  waiting: { color: 'bg-[#FF9100]', label: 'Waiting for Data', icon: '⏳' },
  inprogress: { color: 'bg-[#0052CC]', label: 'In Progress', icon: '🔄' },
  flagged: { color: 'bg-[#D32F2F]', label: 'Flagged', icon: '⚠️' },
};

function OngoingVerifications() {
  // Example mock data
  const verifications: Array<{
    id: string;
    propertyName: string;
    address: string;
    owner: string;
    status: VerificationStatus;
    progress: number;
    updated: string;
  }> = [
    {
      id: 'P-1001',
      propertyName: 'Flat 22C, Lakeview',
      address: 'HSR Layout, Bengaluru, Karnataka',
      owner: 'Sunita Rao',
      status: 'flagged',
      progress: 45,
      updated: '5 minutes ago',
    },
    {
      id: 'P-1002',
      propertyName: 'Plot 78, Koramangala',
      address: 'Koramangala, Bengaluru, Karnataka',
      owner: 'Amit Patel',
      status: 'completed',
      progress: 100,
      updated: '10 minutes ago',
    },
    {
      id: 'P-1003',
      propertyName: 'Flat 12B, Green Acres',
      address: 'Indiranagar, Bengaluru, Karnataka',
      owner: 'Priya Singh',
      status: 'waiting',
      progress: 30,
      updated: '1 hour ago',
    },
    {
      id: 'P-1004',
      propertyName: 'Plot 45, Whitefield',
      address: 'Whitefield, Bengaluru, Karnataka',
      owner: 'Ravi Kumar',
      status: 'inprogress',
      progress: 60,
      updated: '2 hours ago',
    },
  ];

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 3;

  const filtered = verifications.filter(v =>
    v.propertyName.toLowerCase().includes(search.toLowerCase()) ||
    v.address.toLowerCase().includes(search.toLowerCase()) ||
    v.owner.toLowerCase().includes(search.toLowerCase()) ||
    v.id.toLowerCase().includes(search.toLowerCase())
  );
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);
  const totalPages = Math.ceil(filtered.length / perPage);

  return (
    <div className="flex-1 w-full py-6">
      {/* Header and Search */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4 px-4 md:px-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#0052CC] mb-1">Ongoing Verifications</h1>
          <p className="text-gray-500 text-base">Track the progress of your property verifications in real time</p>
        </div>
        <input
          className="rounded-lg border border-gray-300 px-3 py-2 w-64 focus:border-[#0052CC] focus:ring-2 focus:ring-[#0052CC]/20"
          placeholder="Search property, address, owner, or ID..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>
      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 w-full px-4 md:px-8">
        {paginated.map((v) => (
          <div
            key={v.id}
            className="bg-white rounded-xl shadow-md border border-gray-200 p-6 flex flex-col justify-between gap-4 transition hover:shadow-lg h-full w-full"
          >
            <div className="flex-1 min-w-0">
              <div className="font-bold text-lg text-gray-900 mb-1 truncate flex items-center gap-2">
                <span className="text-xl">📍</span> {v.propertyName}
              </div>
              <div className="text-gray-500 text-sm truncate mb-1">{v.address}</div>
              <div className="text-gray-500 text-xs mb-1 flex items-center gap-2">
                <span className="text-base">👤</span> Owner: <span className="font-medium text-gray-700">{v.owner}</span>
              </div>
              <div className="text-gray-400 text-xs">🆔 {v.id}</div>
            </div>
            <div className="flex flex-col items-start gap-2 min-w-[160px]">
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${STATUS[v.status].color} text-white`}>
                <span className="mr-1">{STATUS[v.status].icon}</span> {STATUS[v.status].label}
              </span>
              <div className="w-full min-w-[120px] max-w-[180px]">
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${STATUS[v.status].color}`}
                      style={{ width: `${v.progress}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-500 ml-2">{v.progress}%</span>
                </div>
              </div>
              <span className="text-xs text-gray-400 mt-1">🕒 Updated {v.updated}</span>
            </div>
            <div className="flex flex-col items-end gap-2 min-w-[160px]">
              <div className="flex gap-2">
                <button className="px-4 py-2 rounded-lg bg-[#0052CC] text-white font-semibold shadow hover:bg-[#003d99] transition">View Details</button>
                {v.status === 'flagged' && (
                  <button className="px-4 py-2 rounded-lg bg-[#D32F2F] text-white font-semibold shadow hover:bg-[#a62828] transition">Resolve Issue</button>
                )}
              </div>
            </div>
          </div>
        ))}
        {paginated.length === 0 && (
          <div className="p-8 text-center text-gray-400 bg-white rounded-xl border border-gray-200 col-span-full">No verifications found.</div>
        )}
      </div>
      {/* Pagination */}
      <div className="flex justify-between items-center mt-8 w-full px-4 md:px-8">
        <button
          className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 font-semibold border border-gray-200 shadow-sm hover:bg-gray-200 transition"
          disabled={page === 1}
          onClick={() => setPage(p => Math.max(1, p - 1))}
        >
          Previous
        </button>
        <span className="text-gray-600 text-sm">Page {page} of {totalPages}</span>
        <button
          className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 font-semibold border border-gray-200 shadow-sm hover:bg-gray-200 transition"
          disabled={page === totalPages}
          onClick={() => setPage(p => Math.min(totalPages, p + 1))}
        >
          Next
        </button>
      </div>
    </div>
  );
}
function VerifiedProperties() {
  return (
    <Card className="p-6"><h2 className="text-2xl font-semibold mb-4">Verified Properties</h2><p>Table or cards showing successfully verified properties, downloadable Trust Reports, and Trust Score badges.</p></Card>
  );
}
function ActionCenter() {
  return (
    <Card className="p-6"><h2 className="text-2xl font-semibold mb-4">Action Center</h2><p>Issues flagged during verification and suggested actions for users.</p></Card>
  );
}
function MyReports() {
  return (
    <Card className="p-6"><h2 className="text-2xl font-semibold mb-4">My Reports</h2><p>History of all verification requests with filters and re-initiate option.</p></Card>
  );
}
function ConsentLogs() {
  return (
    <Card className="p-6"><h2 className="text-2xl font-semibold mb-4">Consent Logs</h2><p>View user consent history and legal disclaimers acknowledged by users.</p></Card>
  );
}
function VerificationInsights() {
  return (
    <Card className="p-6"><h2 className="text-2xl font-semibold mb-4">Property Verification Insights</h2><p>Trust Score details, ownership match summary, legal & compliance checks, and AI recommendations.</p></Card>
  );
}
function AnalyticsMonitoring() {
  return (
    <Card className="p-6"><h2 className="text-2xl font-semibold mb-4">Analytics & Monitoring (For Admins)</h2><p>Verification logs, document fetch monitoring, platform usage analytics, user role management, and access history.</p></Card>
  );
}

function VerifierHome() {
  const [properties, setProperties] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [, setLocation] = useLocation();

  React.useEffect(() => {
    setLoading(true);
    fetch("http://localhost/ProfessionalWebPortal/server/php/get_verifications.php")
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 'success') {
          setProperties(data.data);
        } else {
          setError(data.message || "Failed to fetch verifications");
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch verifications");
        setLoading(false);
      });
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 w-full max-w-4xl mx-auto overflow-y-auto" style={{ maxHeight: 600 }}>
      <h2 className="text-2xl font-bold mb-4 text-main">Properties to Verify</h2>
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-500">{error}</div>}
      {!loading && !error && properties.length === 0 && (
        <div className="text-gray-500">No properties to verify.</div>
      )}
      <div className="divide-y">
        {properties.map((prop) => (
          <div key={prop.id} className="py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <div>
              <div className="font-semibold text-main">{prop.owner_name}</div>
              <div className="text-sm text-muted-foreground">District: {prop.district} | Taluk: {prop.taluk} | State: {prop.state}</div>
              <div className="text-xs text-gray-400">Submitted: {prop.created_at}</div>
            </div>
            <button
              className="px-4 py-2 rounded-lg bg-accent-blue text-white font-semibold shadow hover:bg-accent-blue/90 transition"
              onClick={() => setLocation(`/ongoing-verifications?id=${prop.id}`)}
            >
              Verify Documents
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

const sectionComponents: Record<string, React.ReactNode> = {
  home: <VerifierHome />,
  ongoing: <OngoingVerifications />,
  verified: <VerifiedProperties />,
  action: <ActionCenter />,
  reports: <MyReports />,
  consent: <ConsentLogs />,
  insights: <VerificationInsights />,
  analytics: <AnalyticsMonitoring />,
};

function VerifierTopbar() {
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();
  const handleLogout = () => {
    logout();
    setLocation("/");
  };
  const gender = getGenderFromName(user?.username || user?.email || '');
  let avatarSrc = '';
  if (gender === 'female') {
    avatarSrc = '/indian-female-avatar.png';
  } else if (gender === 'male') {
    avatarSrc = '/indian-male-avatar.png';
  } else {
    avatarSrc = `https://api.dicebear.com/7.x/adventurer/svg?seed=${user?.username || user?.email || 'verifier'}&backgroundColor=ffe0b2,ffcc80`;
  }
  return (
    <header className="flex items-center justify-between px-8 py-4 bg-white border-b shadow-sm sticky top-0 z-30">
      {/* Left: NAL Logo and Name */}
      <div className="flex items-center gap-3">
        <img src="/logo_1751954314114.jpg" alt="NAL Logo" className="h-10 w-10 rounded-lg border-2 border-accent-blue/30 shadow-md" />
        <span className="text-2xl font-bold text-main">NAL India</span>
      </div>
      {/* Right: Notifications, Verifier Name, Email, Logout */}
      <div className="flex items-center gap-4 relative">
        <button className="relative p-2 rounded-full hover:bg-gray-100 transition">
          <Bell className="h-6 w-6 text-gray-600" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">2</span>
        </button>
        <Avatar className="h-10 w-10">
          <AvatarImage src={avatarSrc} alt="avatar" />
          <AvatarFallback>{user?.username?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'V'}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col items-start justify-center">
          <span className="font-semibold text-gray-800">{user?.username || user?.email?.charAt(0).toUpperCase() || 'Verifier'}</span>
          <span className="text-xs text-gray-500">{user?.email}</span>
        </div>
        <button
          className="ml-4 px-6 py-2 rounded bg-[#ede3cb] text-gray-800 font-semibold hover:bg-[#e2d6b8] border border-[#ded3c4] transition"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </header>
  );
}

export default function VerifierDashboard() {
  const [selectedMenu, setSelectedMenu] = useState("home");
  return (
    <div className="flex min-h-screen bg-[#F7F9FB] flex-col">
      <VerifierTopbar />
      <div className="flex flex-1 min-h-0">
        <div className="hidden md:block" style={{ marginTop: '32px' }}>
          <VerifierSidebar onMenuSelect={setSelectedMenu} selectedKey={selectedMenu} />
        </div>
        <div className="flex-1 flex flex-col min-w-0">
          <main className="flex-1 p-8">
            {sectionComponents[selectedMenu]}
          </main>
        </div>
      </div>
    </div>
  );
} 