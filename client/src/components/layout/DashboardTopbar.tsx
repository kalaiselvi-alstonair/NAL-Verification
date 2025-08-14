import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { Bell } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "wouter";
import { getAvatarUrl } from "@/lib/utils";
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { LogOut } from 'lucide-react';

const mockNotifications = [
  {
    id: 1,
    title: "Verification Completed",
    message: "Property at Plot No. 45, Whitefield has been verified.",
    time: "2 hours ago",
    type: "success",
  },
  {
    id: 2,
    title: "Verification In Progress",
    message: "Flat 12B, Green Acres is under verification.",
    time: "4 hours ago",
    type: "info",
  },
];

export default function DashboardTopbar() {
  const { user, logout } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [, setLocation] = useLocation();
  const bellRef = useRef<HTMLButtonElement>(null);
  const [dropdownPos, setDropdownPos] = useState<{ top: number; left: number } | null>(null);

  // Calculate dropdown position when opening
  useEffect(() => {
    if (showNotifications && bellRef.current) {
      const rect = bellRef.current.getBoundingClientRect();
      setDropdownPos({
        top: rect.bottom + 8 + window.scrollY,
        left: rect.right - 320 + window.scrollX, // 320px is dropdown width
      });
    }
  }, [showNotifications]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (showNotifications) {
        const dropdown = document.getElementById("notif-dropdown");
        if (dropdown && !dropdown.contains(e.target as Node) && bellRef.current && !bellRef.current.contains(e.target as Node)) {
          setShowNotifications(false);
        }
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showNotifications]);

  const handleLogout = () => {
    logout();
    setLocation("/");
  };

  return (
    <header className="flex items-center justify-between px-8 py-4 bg-white border-b shadow-sm sticky top-0 z-30">
      {/* Left: NAL Logo and Name */}
      <div className="flex items-center gap-3">
        <img src="/logo_1751954314114.jpg" alt="NAL Logo" className="h-10 w-10 rounded-lg border-2 border-accent-blue/30 shadow-md" />
        <span className="text-2xl font-bold text-main">NAL India</span>
      </div>
      {/* Right: Notifications, User, Logout */}
      <div className="flex items-center gap-4 relative">
        <button
          ref={bellRef}
          className="relative p-2 rounded-full hover:bg-gray-100 transition"
          onClick={() => setShowNotifications((v) => !v)}
        >
          <Bell className="h-6 w-6 text-gray-600" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
            {mockNotifications.length}
          </span>
        </button>
        {showNotifications && dropdownPos && createPortal(
          <>
            {/* Backdrop */}
            <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
            {/* Dropdown */}
            <div
              id="notif-dropdown"
              className="fixed z-50 min-w-[320px] w-80 bg-white border rounded-xl shadow-lg"
              style={{ top: dropdownPos.top, left: dropdownPos.left }}
            >
              <div className="p-4 border-b font-semibold text-gray-800">Notifications</div>
              <ul className="max-h-72 overflow-y-auto divide-y">
                {mockNotifications.length === 0 ? (
                  <li className="p-4 text-gray-500 text-center">No notifications</li>
                ) : (
                  mockNotifications.map((n) => (
                    <li key={n.id} className="p-4 hover:bg-gray-50 transition">
                      <div className="font-medium text-gray-800">{n.title}</div>
                      <div className="text-sm text-gray-600">{n.message}</div>
                      <div className="text-xs text-gray-400 mt-1">{n.time}</div>
                    </li>
                  ))
                )}
              </ul>
            </div>
          </>,
          document.body
        )}
        <img
          src={getAvatarUrl(user?.username || user?.email || "user")}
          alt="avatar"
          className="h-10 w-10 rounded-full bg-gray-100 border"
        />
        <div className="flex flex-col items-start justify-center">
          <span className="font-semibold text-gray-800">{user?.email}</span>
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