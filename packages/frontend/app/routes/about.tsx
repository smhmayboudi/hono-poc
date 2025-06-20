import { href } from "react-router";

import { Link } from "~/components/ui/link";

import type { Route } from "./+types/about";

// export const meta = ({}: Route.MetaArgs) => [
//   { title: "About" },
//   { content: "About | description", name: "description" },
// ];

// export const Layout = () => (
//   <div>
//     <h1>about</h1>
//     <Link to={href("/")}>BACK TO WEBSITE</Link>
//   </div>
// );

// export const meta = ({}: Route.MetaArgs) => [
//   { title: "Dashboard" },
//   { content: "Dashboard | description", name: "description" },
// ];

export default ({}: Route.ComponentProps) => (
  <div>
    <h1>About</h1>
    <p>About Description</p>
    <br />
    <Link to={href("/")}>BACK TO HOME</Link>
  </div>
);
