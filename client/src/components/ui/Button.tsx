import { forwardRef, type ButtonHTMLAttributes, type AnchorHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-200 ease-out focus-visible:outline-none disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap";

const variants: Record<Variant, string> = {
  primary:
    "bg-sage-700 text-cream hover:bg-sage-800 active:scale-[0.98] shadow-[0_1px_0_rgba(255,255,255,0.08)_inset,0_4px_16px_-4px_rgba(35,54,42,0.35)]",
  secondary:
    "bg-white text-ink-900 border border-ink-200 hover:border-sage-400 hover:text-sage-800 active:scale-[0.98]",
  ghost:
    "bg-transparent text-ink-700 hover:text-sage-800 hover:bg-sage-50",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-base",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
};

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & CommonProps & { as?: "button" };
type AnchorProps = AnchorHTMLAttributes<HTMLAnchorElement> & CommonProps & { as: "a" };

type Props = ButtonProps | AnchorProps;

export const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, Props>(
  ({ variant = "primary", size = "md", className, ...props }, ref) => {
    const classes = cn(base, variants[variant], sizes[size], className);

    if (props.as === "a") {
      const { as: _as, ...rest } = props;
      return (
        <a
          ref={ref as React.Ref<HTMLAnchorElement>}
          className={classes}
          {...rest}
        />
      );
    }

    const { as: _as, ...rest } = props as ButtonProps;
    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        className={classes}
        {...rest}
      />
    );
  }
);

Button.displayName = "Button";
