import React, { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

export const Input: React.FC<InputProps> = ({
  type = "text",
  placeholder = "Enter text",
  className = "",
  ...props
}) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      className={cn(
        "w-full px-3 py-2 text-sm",
        "bg-[var(--panel-bg)]",
        "border-2 border-[var(--panel-border)]",
        "rounded-[var(--radius-sm)]",
        "text-[var(--text-primary)]",
        "transition-colors duration-200",
        "focus:outline-none focus:border-[var(--accent-primary)]",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        props["aria-invalid"]
          ? "border-[var(--destructive)] text-[var(--destructive)]"
          : "",
        className
      )}
      {...props}
    />
  );
};
