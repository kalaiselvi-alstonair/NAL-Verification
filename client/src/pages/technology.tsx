import { Card, CardContent } from "@/components/ui/card";
import FeatureCard from "@/components/ui/feature-card";
import StatsCard from "@/components/ui/stats-card";
import { 
  Bot, 
  Globe, 
  Shield, 
  Cloud, 
  Database, 
  Smartphone,
  Code,
  Palette,
  TrendingUp,
  Server,
  Zap,
  Brain
} from "lucide-react";

export default function Technology() {
  const technologies = [
    {
      icon: Bot,
      title: "AI & Machine Learning",
      description: "Advanced AI models for document analysis and pattern recognition.",
      features: ["OCR Processing", "NLP Entity Extraction", "Trust Score Algorithms", "Risk Assessment Models"]
    },
    {
      icon: Globe,
      title: "Browser Automation",
      description: "Sophisticated automation for seamless government portal integration.",
      features: ["Selenium WebDriver", "Puppeteer Headless", "CAPTCHA Solving", "Session Management"]
    },
    {
      icon: Shield,
      title: "Security & Compliance",
      description: "Enterprise-grade security ensuring data protection and compliance.",
      features: ["End-to-end encryption", "GDPR compliance", "Secure credential management", "Audit trails"]
    },
    {
      icon: Cloud,
      title: "Cloud Infrastructure",
      description: "Scalable cloud architecture for reliable service delivery.",
      features: ["AWS/Azure integration", "Auto-scaling", "Load balancing", "99.9% uptime"]
    },
    {
      icon: Database,
      title: "Data Management",
      description: "Advanced data processing and storage solutions.",
      features: ["PostgreSQL database", "MongoDB document store", "S3 file storage", "Data versioning"]
    },
    {
      icon: Smartphone,
      title: "Mobile Integration",
      description: "Cross-platform compatibility and mobile app automation.",
      features: ["Appium automation", "Responsive design", "Mobile APIs", "Progressive Web App"]
    }
  ];

  const frontendTech = [
    { icon: Code, title: "React.js", description: "Modern, responsive user interface" },
    { icon: Palette, title: "Tailwind CSS", description: "Utility-first CSS framework" },
    { icon: TrendingUp, title: "D3.js", description: "Data visualization and charts" }
  ];

  const backendTech = [
    { icon: Server, title: "Node.js", description: "Scalable server-side runtime" },
    { icon: Zap, title: "FastAPI", description: "High-performance API framework" },
    { icon: Brain, title: "Python AI/ML", description: "Machine learning and NLP" }
  ];

  const portalIntegrations = [
    {
      state: "Karnataka",
      portals: ["Bhoomi Portal", "KAVERI System", "Dishank GIS", "BBMP Portal", "BDA CDP Maps"]
    },
    {
      state: "Tamil Nadu",
      portals: ["TNREGINET", "Patta/Chitta Portal", "eServices TN", "Village Revenue", "Municipal Services"]
    },
    {
      state: "Telangana & AP",
      portals: ["Dharani Portal", "IGRS System", "HMDA Portal", "Webland Records", "Municipal Portals"]
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Technology Header */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">Our Technology</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Cutting-edge technology stack powering India's most comprehensive property verification platform.
            </p>
          </div>
          
          {/* Technology Stack */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {technologies.map((tech, index) => (
              <FeatureCard
                key={index}
                icon={tech.icon}
                title={tech.title}
                description={tech.description}
                features={tech.features}
                className="bg-accent"
              />
            ))}
          </div>
          
          {/* Government Portal Integrations */}
          <div className="gradient-primary text-white p-12 rounded-xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Government Portal Integrations</h2>
              <p className="text-xl text-blue-100">Seamless integration with 15+ government portals across India</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {portalIntegrations.map((integration, index) => (
                <div key={index} className="text-center">
                  <h3 className="text-xl font-semibold mb-4">{integration.state}</h3>
                  <ul className="space-y-2 text-blue-100">
                    {integration.portals.map((portal, portalIndex) => (
                      <li key={portalIndex}>• {portal}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      
      {/* Technical Architecture */}
      <section className="py-20 bg-accent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Technical Architecture</h2>
            <p className="text-xl text-gray-600">Built for scale, designed for reliability</p>
          </div>
          <Card className="shadow-lg">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-12">
                <div>
                  <h3 className="text-2xl font-semibold text-primary mb-6">Frontend Technologies</h3>
                  <div className="space-y-4">
                    {frontendTech.map((tech, index) => (
                      <div key={index} className="flex items-center">
                        <div className="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center mr-4">
                          <tech.icon className="h-4 w-4" />
                        </div>
                        <div>
                          <h4 className="font-semibold">{tech.title}</h4>
                          <p className="text-gray-600">{tech.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-primary mb-6">Backend Technologies</h3>
                  <div className="space-y-4">
                    {backendTech.map((tech, index) => (
                      <div key={index} className="flex items-center">
                        <div className="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center mr-4">
                          <tech.icon className="h-4 w-4" />
                        </div>
                        <div>
                          <h4 className="font-semibold">{tech.title}</h4>
                          <p className="text-gray-600">{tech.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
      
      {/* Performance Metrics */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Performance Metrics</h2>
            <p className="text-xl text-gray-600">Real-time performance statistics that matter</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <StatsCard value="99.9%" label="System Uptime" className="bg-accent" />
            <StatsCard value="< 20min" label="Average Processing Time" className="bg-accent" />
            <StatsCard value="98.5%" label="Document Fetch Success Rate" className="bg-accent" />
            <StatsCard value="95%" label="OCR Accuracy" className="bg-accent" />
          </div>
        </div>
      </section>
    </div>
  );
}
