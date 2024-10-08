import { configDefaults, coverageConfigDefaults, defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    typecheck: {
      enabled: true,
    },
    exclude: [...configDefaults.exclude, "tests/mangafire/**"],
    coverage: {
      provider: "istanbul",
      exclude: [...coverageConfigDefaults.exclude, "src/examples/**", "docs/**", "tests/**"],
      reporter: ["text", "html", "clover", "json", "json-summary"],
    },
  },
});
