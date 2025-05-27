import type { Config } from "@react-router/dev/config";

export default {
  prerender: async () => ["/about"],
} satisfies Config;
