import { Outlet } from "react-router";

// import type { Route } from "./+types/dashboard";

// export const meta = ({}: Route.MetaArgs) => [
//   { title: "Dashboard" },
//   { content: "Dashboard | description", name: "description" },
// ];

export default () => (
  <div>
    <h1>Dashboard</h1>
    <Outlet />
  </div>
);
