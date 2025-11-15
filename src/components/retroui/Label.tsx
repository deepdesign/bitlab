import React, { LabelHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  className?: string;
}

export const Label: React.FC<LabelProps> = ({
  className = "",
  children,
  ...props
}) => {
  return (
    <label
      className={cn(
        "field-label",
        className
      )}
      {...props}
    >
      {children}
    </label>
  );
};

