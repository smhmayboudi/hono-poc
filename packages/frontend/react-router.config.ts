import type { Config } from "@react-router/dev/config";

export default {
  future: {
    // unstable_middleware: true,
    unstable_optimizeDeps: true,
    unstable_splitRouteModules: true,
    // unstable_subResourceIntegrity: true,
    unstable_viteEnvironmentApi: true,
  },
  prerender: async () => ["/about"],
} satisfies Config;
