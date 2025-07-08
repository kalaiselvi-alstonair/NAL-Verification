import { Card, CardContent } from "@/components/ui/card";
import ProcessStep from "@/components/ui/process-step";
import { 
  FormInput, 
  Route, 
  Globe, 
  FileText, 
  Brain, 
  CheckCircle, 
  FileCheck, 
  Lightbulb 
} from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      step: 1,
      title: "Customer Input",
      description: "Simply provide basic property details: Survey Number, Owner Name, Village Name, and Google Pin location.",
      features: [
        "Minimal data required",
        "Smart form validation",
        "Google Maps integration",
        "Consent capture"
      ],
      icon: FormInput,
      imageUrl: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600"
    },
    {
      step: 2,
      title: "State Routing",
      description: "Our system intelligently routes queries to the appropriate state-specific government portals.",
      features: [
        "Automatic state detection",
        "Portal-specific logic",
        "Retry mechanisms",
        "Fallback options"
      ],
      icon: Route,
      imageUrl: "https://images.unsplash.com/photo-1524661135-423995f22d0b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600",
      reverse: true
    },
    {
      step: 3,
      title: "Government Integration",
      description: "Secure integration with multiple government portals including Bhoomi, KAVERI, TNREGINET, and more.",
      features: [
        "15+ government portals",
        "Browser automation",
        "CAPTCHA handling",
        "Secure connections"
      ],
      icon: Globe,
      imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600"
    },
    {
      step: 4,
      title: "Document Fetching",
      description: "Automated bots fetch all relevant documents including ECs, RTCs, survey maps, and mutation records.",
      features: [
        "Automated downloads",
        "Multiple formats",
        "Metadata capture",
        "Secure storage"
      ],
      icon: FileText,
      imageUrl: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600",
      reverse: true
    },
    {
      step: 5,
      title: "AI Processing",
      description: "Advanced OCR and NLP technologies extract key information and validate document consistency.",
      features: [
        "OCR conversion",
        "NLP entity extraction",
        "Legal validation",
        "Cross-verification"
      ],
      icon: Brain,
      imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600"
    },
    {
      step: 6,
      title: "Verification",
      description: "Cross-verification of data against input parameters and legal compliance requirements.",
      features: [
        "Owner matching",
        "Mutation validation",
        "Zoning compliance",
        "Legal case check"
      ],
      icon: CheckCircle,
      imageUrl: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600",
      reverse: true
    },
    {
      step: 7,
      title: "Trust Report",
      description: "Comprehensive trust report with AI-generated scores, verified documents, and legal health summary.",
      features: [
        "Trust score calculation",
        "Document summaries",
        "Legal health report",
        "Visual indicators"
      ],
      icon: FileCheck,
      imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600"
    },
    {
      step: 8,
      title: "AI Recommendations",
      description: "Smart recommendations and actionable insights to help buyers make informed decisions.",
      features: [
        "Risk assessment",
        "Next-step guidance",
        "Approval indicators",
        "Decision support"
      ],
      icon: Lightbulb,
      imageUrl: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600",
      reverse: true
    }
  ];

  return (
    <div className="min-h-screen">
      {/* How It Works Header */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">How It Works</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our 8-step automated verification process ensures comprehensive property validation with minimal customer input.
            </p>
          </div>
          
          {/* Process Steps */}
          <div className="space-y-16">
            {steps.map((step, index) => (
              <ProcessStep
                key={index}
                step={step.step}
                title={step.title}
                description={step.description}
                features={step.features}
                icon={step.icon}
                imageUrl={step.imageUrl}
                reverse={step.reverse}
              />
            ))}
          </div>
        </div>
      </section>
      
      {/* Process Timeline */}
      <section className="py-20 bg-accent">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Typical Timeline</h2>
            <p className="text-xl text-gray-600">From input to final report - our process is designed for speed and accuracy.</p>
          </div>
          <Card className="shadow-lg">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-3 gap-8 text-center">
                <div>
                  <div className="text-3xl font-bold text-primary mb-2">2 minutes</div>
                  <div className="text-gray-600">Customer Input</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary mb-2">10-15 minutes</div>
                  <div className="text-gray-600">Document Processing</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary mb-2">2-3 minutes</div>
                  <div className="text-gray-600">Report Generation</div>
                </div>
              </div>
              <div className="mt-8 text-center">
                <div className="text-2xl font-bold text-primary">Total: 15-20 minutes</div>
                <div className="text-gray-600">Complete property verification</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
