import { href } from "react-router";

import { Link } from "~/components/ui/link";
import { images } from "~/routes/image.gallery";

import type { Route } from "./+types/image.details.$id";

export default ({ params }: Route.ComponentProps) => (
  <div className="image-detail">
    <h1>Image Number {params.id}</h1>
    <Link to={href("/image/gallery")} viewTransition>
      Back
    </Link>
    <img alt="" src={images[Number(params.id)]} />
  </div>
);
