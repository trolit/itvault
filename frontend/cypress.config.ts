import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    specPattern: "cypress/e2e/**/*.{cy,spec}.{js,jsx,ts,tsx}",
    baseUrl: "http://localhost:3000",
    env: {
      API_PREFIX: "api",
      PASSWORD: "1234",
      SUPER_USER_EMAIL: "head.admin@itvault.dev",
      USER_EMAIL: "member@itvault.dev",
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
