import { Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DemoFillProps {
  onFill: () => void;
}

export function DemoFillButton({ onFill }: DemoFillProps) {
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={onFill}
      className="gap-2 text-muted-foreground border-dashed hover:text-primary hover:border-primary"
    >
      <Wand2 className="w-3.5 h-3.5" />
      Fill Demo Data
    </Button>
  );
}
