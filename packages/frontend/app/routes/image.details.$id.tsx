import { href } from "react-router";

import { Link } from "~/components/ui/link";
import { images } from "~/routes/image.gallery";

import type { Route } from "./+types/image.details.$id";

// export const meta = ({ params }: Route.MetaArgs) => [
//   { title: "Image Number {params.id}" },
//   { content: "Image Number {params.id} | description", name: "description" },
// ];

export default ({ params }: Route.ComponentProps) => (
  <div className="image-detail">
    <h1>Image Number {params.id}</h1>
    <Link to={href("/image/gallery")} viewTransition>
      Back
    </Link>
    <img alt="" src={images[Number(params.id)]} />
  </div>
);
