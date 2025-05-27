import { href, Link } from "react-router";

// import type { Route } from "./+types/about";

// export const meta = ({}: Route.MetaArgs) => [
//   { title: "About" },
//   { content: "About | description", name: "description" },
// ];

export default () => (
  <div>
    <h1>about</h1>
    <Link to={href("/")}>BACK TO WEBSITE</Link>
  </div>
);
