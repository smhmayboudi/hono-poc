import type { SVGProps } from "react";

import type { IconName } from "~/utils/icons";

export default ({
  name,
  ...props
}: SVGProps<SVGSVGElement> & { name: IconName }) => (
  <svg {...props}>
    <use href={`/icon.svg#${name}`} />
  </svg>
);
