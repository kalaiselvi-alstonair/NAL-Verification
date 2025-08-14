import { Card, CardContent } from "@/components/ui/card";
import { User } from "lucide-react";

interface TestimonialCardProps {
  name: string;
  role: string;
  content: string;
  className?: string;
}

export default function TestimonialCard({ 
  name, 
  role, 
  content, 
  className = "" 
}: TestimonialCardProps) {
  return (
    <Card className={`${className}`}>
      <CardContent className="p-8">
        <div className="flex items-center mb-4">
          <div className="accent-bg w-12 h-12 rounded-full flex items-center justify-center mr-4">
            <User className="h-6 w-6" />
          </div>
          <div>
            <h4 className="font-semibold text-main">{name}</h4>
            <p className="text-sm text-main">{role}</p>
          </div>
        </div>
        <p className="text-main">"{content}"</p>
      </CardContent>
    </Card>
  );
}
