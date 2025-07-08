import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, X, LogIn } from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Services", href: "/services" },
  { name: "How It Works", href: "/how-it-works" },
  { name: "Technology", href: "/technology" },
  { name: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location] = useLocation();

  return (
    <nav className="nav-theme shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <img 
                src="/logo_1751954314114.jpg" 
                alt="NAL India Logo" 
                className="h-12 w-12 mr-3 rounded-lg"
              />
              <h1 className="text-2xl font-bold text-white">NAL India</h1>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-baseline space-x-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    location === item.href
                      ? "text-white bg-black bg-opacity-20"
                      : "text-contrast hover-theme text-white hover:bg-opacity-20 hover:bg-black"
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </div>
            <Link href="/login">
              <Button 
                variant="secondary" 
                size="sm" 
                className="ml-4 bg-white text-primary hover:bg-gray-100"
              >
                <LogIn className="h-4 w-4 mr-2" />
                Login
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-black hover:bg-opacity-20"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden nav-theme border-t border-white border-opacity-20">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "block px-3 py-2 rounded-md text-base font-medium text-white",
                  location === item.href
                    ? "bg-black bg-opacity-20"
                    : "hover:bg-black hover:bg-opacity-20"
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <Link href="/login">
              <Button 
                variant="secondary" 
                size="sm" 
                className="w-full mt-3 bg-white text-primary hover:bg-gray-100"
                onClick={() => setMobileMenuOpen(false)}
              >
                <LogIn className="h-4 w-4 mr-2" />
                Login
              </Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
