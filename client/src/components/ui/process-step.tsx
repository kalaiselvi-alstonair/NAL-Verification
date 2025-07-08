import { LucideIcon } from "lucide-react";

interface ProcessStepProps {
  step: number;
  title: string;
  description: string;
  features: string[];
  icon: LucideIcon;
  imageUrl: string;
  reverse?: boolean;
}

export default function ProcessStep({
  step,
  title,
  description,
  features,
  icon: Icon,
  imageUrl,
  reverse = false,
}: ProcessStepProps) {
  return (
    <div className={`flex flex-col ${reverse ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center lg:gap-16`}>
      <div className="lg:w-1/2 mb-8 lg:mb-0">
        <div className="flex items-center mb-6">
          <div className="bg-primary text-white w-12 h-12 rounded-full flex items-center justify-center mr-4 text-xl font-bold">
            {step}
          </div>
          <h2 className="text-3xl font-bold text-primary">{title}</h2>
        </div>
        <p className="text-xl text-gray-600 mb-6">{description}</p>
        <ul className="space-y-3 text-gray-600">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              {feature}
            </li>
          ))}
        </ul>
      </div>
      <div className="lg:w-1/2">
        <img
          src={imageUrl}
          alt={title}
          className="rounded-xl shadow-lg w-full h-auto"
        />
      </div>
    </div>
  );
}
