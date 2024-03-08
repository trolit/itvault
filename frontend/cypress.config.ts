import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    specPattern: "cypress/e2e/**/*.{cy,spec}.{js,jsx,ts,tsx}",
    baseUrl: "http://localhost:3000",
    env: {
      API_PREFIX: "api",
      PASSWORD: "1234",
      USER_WITH_ALL_PERMISSIONS: "head.admin@itvault.dev",
      USER_WITHOUT_ANY_PERMISSIONS: "member@itvault.dev",
    },
    experimentalSessionAndOrigin: true,
  },
  component: {
    specPattern: "src/**/__tests__/*.{cy,spec}.{js,ts,jsx,tsx}",
    devServer: {
      framework: "vue",
      bundler: "vite",
    },
  },
});
