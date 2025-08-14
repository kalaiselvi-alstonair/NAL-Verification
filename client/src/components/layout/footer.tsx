import { Link } from "wouter";
import { Facebook, Twitter, Linkedin, Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white/80 backdrop-blur-lg border-t border-card-shadow py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="bg-blue-light rounded-xl p-6 flex flex-col">
            <div className="flex items-center mb-4">
              <img 
                src="/logo_1751954314114.jpg" 
                alt="NAL India Logo" 
                className="h-12 w-12 mr-3 rounded-lg"
              />
              <h3 className="text-2xl font-bold text-main">NAL India</h3>
            </div>
            <p className="text-main mb-4">
              India's most trusted property verification platform, powered by AI and automation.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-accent-blue hover:text-accent-mint transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-accent-blue hover:text-accent-mint transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-accent-blue hover:text-accent-mint transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-accent-blue hover:text-accent-mint transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>
          <div className="bg-mint-light rounded-xl p-6">
            <h4 className="text-lg font-semibold mb-4 text-main">Services</h4>
            <ul className="space-y-2 text-main">
              <li><Link href="/services" className="hover:text-accent-blue transition-colors">Property Verification</Link></li>
              <li><Link href="/services" className="hover:text-accent-blue transition-colors">Document Retrieval</Link></li>
              <li><Link href="/services" className="hover:text-accent-blue transition-colors">AI Analysis</Link></li>
              <li><Link href="/services" className="hover:text-accent-blue transition-colors">Trust Reports</Link></li>
            </ul>
          </div>
          <div className="bg-purple-light rounded-xl p-6">
            <h4 className="text-lg font-semibold mb-4 text-main">Company</h4>
            <ul className="space-y-2 text-main">
              <li><Link href="/about" className="hover:text-accent-blue transition-colors">About Us</Link></li>
              <li><a href="#" className="hover:text-accent-blue transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-accent-blue transition-colors">Press</a></li>
              <li><a href="#" className="hover:text-accent-blue transition-colors">Partners</a></li>
            </ul>
          </div>
          <div className="bg-blue-light rounded-xl p-6">
            <h4 className="text-lg font-semibold mb-4 text-main">Support</h4>
            <ul className="space-y-2 text-main">
              <li><Link href="/contact" className="hover:text-accent-blue transition-colors">Contact Us</Link></li>
              <li><a href="#" className="hover:text-accent-blue transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-accent-blue transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-accent-blue transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-card-shadow mt-12 pt-8 text-center text-main">
          <p>&copy; 2025 NAL India. All rights reserved. Built with ❤️ for Indian real estate.</p>
        </div>
      </div>
    </footer>
  );
}
