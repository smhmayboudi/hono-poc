import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import serverAdapter from "hono-react-router-adapter/vite";
import { defineConfig } from "vite";
import { iconsSpritesheet } from "vite-plugin-icons-spritesheet";
import tsconfigPaths from "vite-tsconfig-paths";

import { getLoadContext } from "./server/app.node.load-context";

export default defineConfig({
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
    serverAdapter({
      entry: "./server/app.ts",
      getLoadContext,
    }),
    tailwindcss(),
    tsconfigPaths(),
  ],
});
