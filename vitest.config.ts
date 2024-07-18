import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    coverage: {
      provider: "istanbul",
      exclude: ["src/*/examples/**"],
      reporter: ["text", "html", "clover", "json", "json-summary"],
    },
  },
});
