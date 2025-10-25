import { Card } from "./ui/card";
import { AudioButton } from "./AudioButton";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  icon: LucideIcon;
  title: string;
  value: string | number;
  subtitle?: string;
  audioText: string;
  trend?: "up" | "down" | "stable";
  className?: string;
}

export const MetricCard = ({
  icon: Icon,
  title,
  value,
  subtitle,
  audioText,
  trend,
  className,
}: MetricCardProps) => {
  const trendColors = {
    up: "border-l-4 border-l-success",
    down: "border-l-4 border-l-danger",
    stable: "border-l-4 border-l-warning",
  };

  return (
    <Card className={cn("p-6 shadow-card hover:shadow-card-hover transition-all duration-300 border border-border/50", trend && trendColors[trend], className)}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-secondary">
            <Icon className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">{title}</h3>
            {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
          </div>
        </div>
        <AudioButton text={audioText} />
      </div>
      <div className="mt-4">
        <p className="text-4xl font-bold text-foreground">{value}</p>
      </div>
    </Card>
  );
};
