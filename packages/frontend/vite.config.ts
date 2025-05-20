import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import serverAdapter from "hono-react-router-adapter/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

import { getLoadContext } from "./server/app.node.load-context";

export default defineConfig({
  plugins: [
    tailwindcss(),
    reactRouter(),
    serverAdapter({
      getLoadContext,
      entry: "./server/app.ts",
    }),
    tsconfigPaths(),
  ],
});
