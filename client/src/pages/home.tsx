import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import FeatureCard from "@/components/ui/feature-card";
import TestimonialCard from "@/components/ui/testimonial-card";
import StatsCard from "@/components/ui/stats-card";
import { Shield, Brain, Clock, CheckCircle } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="gradient-primary text-white py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8 items-center">
            <div className="mb-8 lg:mb-0">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Automated Property Verification You Can Trust
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-blue-100">
                Verify property ownership and legal status instantly using official government sources. No manual uploads required.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/services">
                  <Button size="lg" className="bg-white text-primary hover:bg-gray-100">
                    Start Verification
                  </Button>
                </Link>
                <Link href="/how-it-works">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600"
                alt="Property verification documents with digital analysis"
                className="rounded-xl shadow-2xl w-full h-auto"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent rounded-xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Why Choose NAL India?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the future of property verification with our AI-powered platform that delivers trust and transparency.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={Shield}
              title="100% Automated"
              description="No manual document uploads. We fetch all documents directly from government portals."
              className="bg-accent"
            />
            <FeatureCard
              icon={Brain}
              title="AI-Powered Analysis"
              description="Advanced NLP and OCR technology ensures accurate document analysis and verification."
              className="bg-accent"
            />
            <FeatureCard
              icon={Clock}
              title="Instant Results"
              description="Get comprehensive property verification reports in minutes, not weeks."
              className="bg-accent"
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">10,000+</div>
              <div className="text-blue-200">Properties Verified</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">15+</div>
              <div className="text-blue-200">Government Portals</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">98%</div>
              <div className="text-blue-200">Accuracy Rate</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-blue-200">Service Availability</div>
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
