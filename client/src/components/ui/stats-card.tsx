import { Card, CardContent } from "@/components/ui/card";

interface StatsCardProps {
  value: string;
  label: string;
  className?: string;
}

export default function StatsCard({ value, label, className = "" }: StatsCardProps) {
  return (
    <Card className={`text-center ${className}`}>
      <CardContent className="p-6">
        <div className="text-3xl font-bold text-accent mb-2">{value}</div>
        <div className="text-main">{label}</div>
      </CardContent>
    </Card>
  );
}
