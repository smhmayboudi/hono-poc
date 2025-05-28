import { href, Link } from "react-router";

import type { Route } from "./+types/image.details.$id";
import { images } from "./image.gallery";

export default ({ params }: Route.ComponentProps) => (
  <div className="image-detail">
    <Link to={href("/image/gallery")} viewTransition>
      Back
    </Link>
    <h1>Image Number {params.id}</h1>
    <img alt="" src={images[Number(params.id)]} />
  </div>
);
