import { cva, type VariantProps } from "class-variance-authority";
import type { SVGProps } from "react";

import type { IconName } from "~/components/ui/icon-type";
import { twc } from "~/utils/css";

const icon = cva("icon", {
  variants: {
    c_fill: {
      currentColor: "currentColor",
      none: "none",
    },
    c_size: {
      xs: "12",
      sm: "16",
      md: "24",
      lg: "32",
      xl: "40",
    },
    c_stroke: {
      currentColor: "currentColor",
      none: "none",
    },
  },
  compoundVariants: [],
  defaultVariants: {},
});

export interface IconProps
  extends SVGProps<SVGSVGElement>,
    VariantProps<typeof icon> {
  c_name: IconName;
  c_testId?: string;
}

export default ({
  c_fill,
  c_name,
  c_size,
  c_stroke,
  c_testId,
  className,
  ...props
}: IconProps) => {
  const size = c_size ?? "24";
  const fill = c_fill ?? "none";
  const stroke = c_stroke ?? "none";

  return (
    <svg
      className={twc("h-6 shrink-0 stroke-current w-6", icon(), className)}
      data-name={c_name}
      data-testid={c_testId}
      fill={fill}
      height={size}
      stroke={stroke}
      viewBox={`0 0 ${size} ${size}`}
      width={size}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <use href={`/icon.svg#${c_name}`} />
    </svg>
  );
};
