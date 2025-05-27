import { cva, VariantProps } from "class-variance-authority";

import { twc } from "~/utils/css";

const loading = cva("loading", {
  variants: {
    c_size: {
      xs: "loading-xs",
      sm: "loading-sm",
      md: "loading-md",
      lg: "loading-lg",
      xl: "loading-xl",
    },
    c_style: {
      ball: "loading-ball",
      bars: "loading-bars",
      dots: "loading-dots",
      infinity: "loading-infinity",
      ring: "loading-ring",
      spinner: "loading-spinner",
    },
  },
  compoundVariants: [],
  defaultVariants: {
    c_size: "md",
    c_style: "spinner",
  },
});

export interface LoadingProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof loading> {}

export default ({ c_size, c_style, className }: LoadingProps) => (
  <span className={twc(loading({ c_size, c_style }), className)} />
);
