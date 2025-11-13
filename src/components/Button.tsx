import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import React, { type ButtonHTMLAttributes } from "react";
import { Slot } from "@radix-ui/react-slot";

const buttonVariants = cva(
  "font-head transition-all rounded outline-hidden cursor-pointer duration-200 font-medium flex items-center justify-center",
  {
    variants: {
      variant: {
        default:
          "shadow-md hover:shadow active:shadow-none bg-primary text-primary-foreground border-2 border-black transition hover:translate-y-1 active:translate-y-2 active:translate-x-1 hover:bg-primary-hover",
        secondary:
          "shadow-md hover:shadow active:shadow-none bg-secondary shadow-primary text-secondary-foreground border-2 border-black transition hover:translate-y-1 active:translate-y-2 active:translate-x-1 hover:bg-secondary-hover",
        outline:
          "shadow-md hover:shadow active:shadow-none bg-transparent border-2 border-border transition hover:translate-y-1 active:translate-y-2 active:translate-x-1",
        link: "bg-transparent hover:underline",
      },
      size: {
        sm: "h-8 px-3 text-xs shadow hover:shadow-none",
        md: "h-9 px-4 py-2",
        lg: "h-10 px-8",
        icon: "h-9 w-9 p-0 items-center justify-center",
      },
    },
    defaultVariants: {
      size: "md",
      variant: "default",
    },
  },
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      size = "md",
      className = "",
      variant = "default",
      asChild = false,
      ...props
    },
    forwardedRef,
  ) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={forwardedRef}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      >
        {children}
      </Comp>
    );
  },
);

Button.displayName = "Button";
