
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  className?: string;
  iconClassName?: string;
}

const FeatureCard = ({
  icon: Icon,
  title,
  description,
  className,
  iconClassName,
}: FeatureCardProps) => {
  return (
    <div className={cn(
      "glass-effect glass-effect-hover rounded-2xl p-6 transition-all duration-300",
      className
    )}>
      <div className={cn(
        "flex items-center justify-center w-12 h-12 rounded-lg bg-blue-100 text-blue-600 mb-4",
        iconClassName
      )}>
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};

export default FeatureCard;
