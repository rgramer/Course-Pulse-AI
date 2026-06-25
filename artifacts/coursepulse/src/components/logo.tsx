import { cn } from "@/lib/utils";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showTagline?: boolean;
}

export function CoursePulseLogo({ size = "md", showTagline = false }: LogoProps) {
  const sizeClasses = {
    sm: { icon: "w-6 h-6", text: "text-base", tagline: "text-[10px]", badge: "text-[9px] px-1.5 py-0.5" },
    md: { icon: "w-8 h-8", text: "text-2xl", tagline: "text-xs", badge: "text-[10px] px-2 py-0.5" },
    lg: { icon: "w-12 h-12", text: "text-4xl", tagline: "text-sm", badge: "text-xs px-2.5 py-1" },
  };

  const { icon, text, tagline, badge } = sizeClasses[size];

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-3">
        <svg 
          viewBox="0 0 40 20" 
          className={cn("text-primary shrink-0", icon)}
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <path d="M0,10 L8,10 L12,2 L16,18 L20,10 L40,10" />
        </svg>
        <span className={cn("font-serif font-bold tracking-tight text-primary leading-none", text)}>
          CoursePulse AI
        </span>
      </div>
      {showTagline && (
        <div className="pl-14 mt-1 flex flex-col gap-1.5">
          <p className={cn("text-muted-foreground font-medium", tagline)}>
            Responsible Learning Intelligence
          </p>
          <span className={cn("self-start rounded-full font-semibold tracking-wide uppercase bg-primary text-primary-foreground leading-none", badge)}>
            NYU SPS
          </span>
        </div>
      )}
    </div>
  );
}
