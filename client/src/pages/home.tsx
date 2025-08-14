import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import FeatureCard from "@/components/ui/feature-card";
import TestimonialCard from "@/components/ui/testimonial-card";
import StatsCard from "@/components/ui/stats-card";
import { Shield, Brain, Clock, CheckCircle, Zap, FileSearch, Play } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-white pt-12 pb-16 lg:pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <div className="mb-8">
              <span className="inline-flex items-center px-4 py-2 rounded-full bg-accent-blue text-white text-sm font-medium mb-6">
                <Zap className="h-4 w-4 mr-2" />
                AI-Powered Property Verification
              </span>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Secure Your Property
              <span className="block text-primary">Investment</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
              India's most trusted property verification platform. Get comprehensive property reports in minutes, not months.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link href="/services">
                <Button size="lg" className="bg-primary hover:bg-secondary text-white px-8 py-4 text-lg">
                  <FileSearch className="mr-2 h-5 w-5" />
                  Start Verification
                </Button>
              </Link>
              <Link href="/how-it-works">
                <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white px-8 py-4 text-lg">
                  <Play className="mr-2 h-5 w-5" />
                  Watch Demo
                </Button>
              </Link>
            </div>
            
            {/* Trust Indicators */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
              <div className="flex flex-col items-center text-center bg-mint-light rounded-xl p-4">
                <div className="w-12 h-12 bg-accent-mint rounded-full flex items-center justify-center mb-3">
                  <CheckCircle className="h-6 w-6 text-accent-mint" />
                </div>
                <div className="text-2xl font-bold text-main mb-1">10,000+</div>
                <div className="text-muted-foreground">Verified Properties</div>
              </div>
              <div className="flex flex-col items-center text-center bg-blue-light rounded-xl p-4">
                <div className="w-12 h-12 bg-accent-blue rounded-full flex items-center justify-center mb-3">
                  <Shield className="h-6 w-6 text-accent-blue" />
                </div>
                <div className="text-2xl font-bold text-main mb-1">100%</div>
                <div className="text-muted-foreground">Secure & Confidential</div>
              </div>
              <div className="flex flex-col items-center text-center bg-purple-light rounded-xl p-4">
                <div className="w-12 h-12 bg-accent-purple rounded-full flex items-center justify-center mb-3">
                  <Clock className="h-6 w-6 text-accent-purple" />
                </div>
                <div className="text-2xl font-bold text-main mb-1">5 Min</div>
                <div className="text-muted-foreground">Average Report Time</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-accent-blue mb-4">Why Choose NAL India?</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Experience the future of property verification with our AI-powered platform that delivers trust and transparency.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={Shield}
              title="100% Automated"
              description="No manual document uploads. We fetch all documents directly from government portals."
              className="bg-blue-light text-main"
            />
            <FeatureCard
              icon={Brain}
              title="AI-Powered Analysis"
              description="Advanced NLP and OCR technology ensures accurate document analysis and verification."
              className="bg-mint-light text-main"
            />
            <FeatureCard
              icon={Clock}
              title="Instant Results"
              description="Get comprehensive property verification reports in minutes, not weeks."
              className="bg-purple-light text-main"
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-accent-blue text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">10,000+</div>
              <div className="text-accent-mint">Properties Verified</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">15+</div>
              <div className="text-accent-purple">Government Portals</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">98%</div>
              <div className="text-accent-orange">Accuracy Rate</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-white">Service Availability</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Trusted by Leading Real Estate Companies</h2>
            <p className="text-xl text-gray-600">Join thousands of satisfied customers who trust NAL India for their property verification needs.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <TestimonialCard
              name="Rajesh Kumar"
              role="Real Estate Developer"
              content="NAL India's verification process saved us weeks of manual work. The AI-powered reports are incredibly detailed and accurate."
              className="shadow-lg border border-gray-100"
            />
            <TestimonialCard
              name="Priya Sharma"
              role="Property Consultant"
              content="The automated document fetching from government portals is game-changing. No more running around offices!"
              className="shadow-lg border border-gray-100"
            />
            <TestimonialCard
              name="Amit Patel"
              role="Home Buyer"
              content="Finally, a service that gives me confidence in my property investment. The trust score feature is brilliant!"
              className="shadow-lg border border-gray-100"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-secondary text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Verify Your Property?</h2>
          <p className="text-xl mb-8 text-blue-100">
            Join thousands of satisfied customers who trust NAL India for accurate property verification.
          </p>
          <Link href="/contact">
            <Button size="lg" className="bg-white text-primary hover:bg-gray-100">
              Get Started Today
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
