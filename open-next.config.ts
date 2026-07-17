import type { OpenNextConfig } from "@opennextjs/cloudflare";

const config: OpenNextConfig = {
  default: {
    minify: true,
  },
  // Ensure we don't bind to any external workers
  external: [],
};

export default config;
