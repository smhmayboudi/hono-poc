import { cva, VariantProps } from "class-variance-authority";

import { twc } from "~/utils/css";

const button = cva("button", {
  variants: {
    intent: {
      primary: ["bg-blue-500", "border-transparent", "text-white"],
      secondary: ["bg-white", "border-gray-400", "text-gray-800"],
    },
    size: {
      small: ["px-2", "py-1", "text-sm"],
      medium: ["px-4", "py-2", "text-base"],
    },
    disabled: {
      false: [],
      true: ["cursor-not-allowed", "opacity-50"],
    },
  },
  compoundVariants: [
    {
      class: "hover:bg-blue-600",
      disabled: false,
      intent: "primary",
    },
    {
      class: "hover:bg-gray-100",
      disabled: false,
      intent: "secondary",
    },
    {
      class: "uppercase",
      intent: "primary",
      size: "medium",
    },
  ],
  defaultVariants: {
    disabled: false,
    intent: "primary",
    size: "medium",
  },
});

export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "disabled">,
    VariantProps<typeof button> {}

export default ({
  className,
  disabled,
  intent,
  size,
  ...props
}: ButtonProps) => (
  <button
    className={twc(button({ intent, size, disabled, className }))}
    disabled={disabled || undefined}
    {...props}
  />
);
