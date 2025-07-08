import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  features?: string[];
  className?: string;
}

export default function FeatureCard({ 
  icon: Icon, 
  title, 
  description, 
  features = [], 
  className = "" 
}: FeatureCardProps) {
  return (
    <Card className={`hover:shadow-lg transition-shadow ${className}`}>
      <CardContent className="p-8">
        <div className="bg-primary text-white w-16 h-16 rounded-full flex items-center justify-center mb-6">
          <Icon className="h-8 w-8" />
        </div>
        <h3 className="text-xl font-semibold text-primary mb-4">{title}</h3>
        <p className="text-gray-600 mb-4">{description}</p>
        {features.length > 0 && (
          <ul className="space-y-2 text-gray-600">
            {features.map((feature, index) => (
              <li key={index} className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                {feature}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
