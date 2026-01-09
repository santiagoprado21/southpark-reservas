import { cn } from "@/lib/utils";

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  showText?: boolean;
  textColor?: string;
}

const Logo = ({ size = "md", className, showText = true, textColor }: LogoProps) => {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-12 w-12",
    lg: "h-16 w-16",
    xl: "h-24 w-24",
  };

  const textSizeClasses = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-3xl",
    xl: "text-4xl",
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <img
        src="/logoSouthPark.png"
        alt="South Park Logo"
        className={cn(sizeClasses[size], "object-contain")}
      />
      {showText && (
        <span 
          className={cn(
            "font-display font-bold tracking-tight",
            textSizeClasses[size],
            textColor || "text-sp-blue"
          )}
        >
          South Park
        </span>
      )}
    </div>
  );
};

export default Logo;

