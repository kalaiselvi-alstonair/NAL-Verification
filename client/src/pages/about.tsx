import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import StatsCard from "@/components/ui/stats-card";

export default function About() {
  return (
    <div className="min-h-screen">
      {/* About Hero */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">About NAL India</h1>
              <p className="text-xl text-gray-600 mb-8">
                NAL India is revolutionizing property verification in India through advanced technology and AI-powered solutions. Our mission is to bring trust and transparency to real estate transactions.
              </p>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center mr-4 mt-1">
                    <CheckCircle className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary mb-2">Our Mission</h3>
                    <p className="text-gray-600">To eliminate fraud and uncertainty in property transactions by providing accurate, automated verification services.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center mr-4 mt-1">
                    <CheckCircle className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary mb-2">Our Vision</h3>
                    <p className="text-gray-600">To become India's most trusted property verification platform, enabling confident real estate decisions.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center mr-4 mt-1">
                    <CheckCircle className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary mb-2">Our Values</h3>
                    <p className="text-gray-600">Transparency, accuracy, innovation, and customer-centricity drive everything we do.</p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <img
                src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600"
                alt="Modern office building representing trust and professionalism"
                className="rounded-xl shadow-2xl w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-accent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Our Leadership Team</h2>
            <p className="text-xl text-gray-600">Meet the experts behind NAL India's innovative property verification solutions.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="shadow-lg text-center">
              <CardContent className="p-8">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&h=300"
                  alt="Arjun Mehta - CEO"
                  className="w-32 h-32 rounded-full mx-auto mb-6 object-cover"
                />
                <h3 className="text-xl font-semibold text-primary mb-2">Arjun Mehta</h3>
                <p className="text-gray-600 mb-4">CEO & Founder</p>
                <p className="text-gray-600">Former McKinsey consultant with 15 years of experience in PropTech and government technology.</p>
              </CardContent>
            </Card>
            <Card className="shadow-lg text-center">
              <CardContent className="p-8">
                <img
                  src="https://images.unsplash.com/photo-1494790108755-2616b332e234?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&h=300"
                  alt="Kavya Singh - CTO"
                  className="w-32 h-32 rounded-full mx-auto mb-6 object-cover"
                />
                <h3 className="text-xl font-semibold text-primary mb-2">Kavya Singh</h3>
                <p className="text-gray-600 mb-4">CTO</p>
                <p className="text-gray-600">IIT graduate and AI expert with extensive experience in building scalable automation platforms.</p>
              </CardContent>
            </Card>
            <Card className="shadow-lg text-center">
              <CardContent className="p-8">
                <img
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&h=300"
                  alt="Rohit Gupta - COO"
                  className="w-32 h-32 rounded-full mx-auto mb-6 object-cover"
                />
                <h3 className="text-xl font-semibold text-primary mb-2">Rohit Gupta</h3>
                <p className="text-gray-600 mb-4">COO</p>
                <p className="text-gray-600">Operations specialist with deep knowledge of Indian real estate markets and government processes.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Company Stats */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Our Impact</h2>
            <p className="text-xl text-gray-600">Numbers that showcase our commitment to excellence and customer satisfaction.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <StatsCard value="50+" label="Cities Covered" className="bg-accent" />
            <StatsCard value="15" label="Government Portals" className="bg-accent" />
            <StatsCard value="99.2%" label="Customer Satisfaction" className="bg-accent" />
            <StatsCard value="24/7" label="Support Available" className="bg-accent" />
          </div>
        </div>
      </section>
    </div>
  );
}
