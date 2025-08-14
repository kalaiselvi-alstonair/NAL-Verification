import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import FeatureCard from "@/components/ui/feature-card";
import { 
  Search, 
  FileText, 
  Brain, 
  Shield, 
  MapPin, 
  Gavel, 
  CheckCircle 
} from "lucide-react";

export default function Services() {
  const services = [
    {
      icon: Search,
      title: "Property Verification",
      description: "Complete automated verification of property ownership, legal status, and document authenticity.",
      features: ["Ownership verification", "Legal status check", "Document authenticity"]
    },
    {
      icon: FileText,
      title: "Document Retrieval",
      description: "Automated fetching of official documents from government portals across multiple states.",
      features: ["Encumbrance Certificate", "RTC & Mutation records", "Survey maps"]
    },
    {
      icon: Brain,
      title: "AI Analysis",
      description: "Advanced AI-powered analysis of documents using OCR and NLP technologies.",
      features: ["OCR processing", "NLP entity extraction", "Legal validation"]
    },
    {
      icon: Shield,
      title: "Trust Reports",
      description: "Comprehensive trust reports with AI-generated scores and recommendations.",
      features: ["Trust score calculation", "Risk assessment", "Actionable insights"]
    },
    {
      icon: MapPin,
      title: "GIS & Mapping",
      description: "Detailed mapping and GIS analysis for boundary verification and zoning compliance.",
      features: ["Boundary verification", "Zoning compliance", "CDP validation"]
    },
    {
      icon: Gavel,
      title: "Legal Case Check",
      description: "Comprehensive legal case verification to identify active disputes and litigation.",
      features: ["Court case search", "Dispute identification", "Legal risk assessment"]
    }
  ];

  const packages = [
    {
      name: "Basic",
      price: "₹999",
      features: [
        "Ownership verification",
        "Basic document retrieval",
        "Simple trust report"
      ]
    },
    {
      name: "Professional",
      price: "₹1,999",
      features: [
        "Complete verification",
        "All document types",
        "AI-powered analysis",
        "Legal case check",
        "Detailed trust report"
      ],
      popular: true
    },
    {
      name: "Enterprise",
      price: "₹4,999",
      features: [
        "Everything in Professional",
        "Priority processing",
        "Dedicated support",
        "Custom integrations"
      ]
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Services Header */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-accent-blue mb-6">Our Services</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Comprehensive property verification solutions powered by AI and automated government data retrieval.
            </p>
          </div>
          
          {/* Service Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {services.map((service, index) => (
              <FeatureCard
                key={index}
                icon={service.icon}
                title={service.title}
                description={service.description}
                features={service.features}
                className={
                  index % 3 === 0
                    ? "bg-blue-light text-main"
                    : index % 3 === 1
                    ? "bg-mint-light text-main"
                    : "bg-purple-light text-main"
                }
              />
            ))}
          </div>
        </div>
      </section>

      {/* Service Packages */}
      <section className="py-20 bg-blue-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-main mb-4">Service Packages</h2>
            <p className="text-xl text-accent-mint">Choose the verification package that best fits your needs.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {packages.map((pkg, index) => (
              <Card key={index} className={`shadow-lg bg-white ${pkg.popular ? 'border-2 border-accent-mint relative' : index === 0 ? 'border-l-8 border-accent-purple' : 'border-l-8 border-accent-orange'}`}>
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-accent-mint text-white">Most Popular</Badge>
                  </div>
                )}
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-main mb-4">{pkg.name}</h3>
                  <div className="text-3xl font-bold text-accent-orange mb-6">{pkg.price}</div>
                  <ul className="space-y-3 mb-8">
                    {pkg.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-main">
                        <CheckCircle className="h-5 w-5 text-accent-mint mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className="w-full" 
                    variant={pkg.name === "Enterprise" ? "outline" : "default"}
                  >
                    {pkg.name === "Enterprise" ? "Contact Sales" : "Get Started"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
