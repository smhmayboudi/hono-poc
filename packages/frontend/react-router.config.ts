import type { Config } from "@react-router/dev/config";

export default {
  // future: {
  //   unstable_middleware: true,
  //   unstable_optimizeDeps: true,
  //   unstable_splitRouteModules: "enforce",
  // },
  prerender: async () => ["/about"],
  ssr: true,
} satisfies Config;
