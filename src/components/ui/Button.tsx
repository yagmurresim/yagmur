import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-[color,background-color,box-shadow,transform] duration-200 ease-out focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 select-none active:translate-y-px",
  {
    variants: {
      variant: {
        primary:
          "bg-plum text-ivory shadow-[0_1px_0_rgba(42,24,48,0.08),0_8px_20px_rgba(59,22,76,0.12)] hover:bg-violet hover:shadow-[0_10px_28px_rgba(59,22,76,0.18)] hover:-translate-y-px",
        secondary:
          "bg-ivory/80 text-ink ring-1 ring-ink/10 shadow-[0_1px_0_rgba(42,24,48,0.04)] backdrop-blur-sm hover:bg-ivory hover:ring-ink/18 hover:-translate-y-px",
        ghost: "bg-transparent text-ink-muted hover:text-ink hover:bg-ink/5",
        inverse:
          "bg-ivory text-plum shadow-[0_8px_20px_rgba(17,8,15,0.12)] hover:bg-white hover:-translate-y-px",
        outlineIvory:
          "bg-ivory/80 text-ink ring-1 ring-ink/10 backdrop-blur-sm hover:bg-ivory hover:ring-ink/18",
        magenta:
          "bg-plum text-ivory shadow-[0_8px_20px_rgba(59,22,76,0.12)] hover:bg-violet hover:-translate-y-px",
        destructive: "bg-red-600 text-white hover:bg-red-700",
      },
      size: {
        sm: "h-9 px-4 text-sm",
        md: "h-10 px-5 text-sm",
        lg: "h-11 px-6 text-[15px]",
        xl: "h-12 px-7 text-[15px]",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        disabled={disabled || loading}
        aria-disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <>
            <svg
              className="animate-spin -ml-1 h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <span>Gönderiliyor…</span>
          </>
        ) : (
          children
        )}
      </Comp>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
