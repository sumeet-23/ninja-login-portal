import * as React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface LabelInputProps extends Omit<React.ComponentProps<"input">, "id"> {
  label: string;
  name: string;
  type?: string;
  className?: string;
}

export const LabelInput = React.forwardRef<HTMLInputElement, LabelInputProps>(
  ({ label, name, type = "text", className, ...props }, ref) => {
    return (
      <div className={cn("flex flex-col gap-2", className)}>
        <Label htmlFor={name} className="text-sm font-medium">
          {label}
        </Label>
        <Input
          ref={ref}
          id={name}
          name={name}
          type={type}
          {...props}
        />
      </div>
    );
  }
);

LabelInput.displayName = "LabelInput";
