import { reactRouter } from "@react-router/dev/vite";
import { sentryVitePlugin } from "@sentry/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import serverAdapter from "hono-react-router-adapter/vite";
import { defineConfig } from "vite";
import { iconsSpritesheet } from "vite-plugin-icons-spritesheet";
import tsconfigPaths from "vite-tsconfig-paths";

import { getLoadContext } from "./server/app.node.load-context";

export default defineConfig({
  build: {
    sourcemap: true,
  },
  plugins: [
    iconsSpritesheet({
      cwd: process.cwd(),
      fileName: "./icon.svg",
      formatter: "prettier",
      iconNameTransformer: (iconName) => iconName,
      inputDir: "./resources/icons/",
      outputDir: "./public/",
      typesOutputFile: "./app/utils/icons.ts",
      withTypes: true,
    }),
    reactRouter(),
    sentryVitePlugin({
      authToken: process.env.SENTRY_AUTH_TOKEN,
      org: process.env.SENTRY_ORG,
      project: process.env.SENTRY_PROJECT,
    }),
    serverAdapter({
      entry: "./server/app.ts",
      getLoadContext,
    }),
    tailwindcss(),
    tsconfigPaths(),
  ],
});
