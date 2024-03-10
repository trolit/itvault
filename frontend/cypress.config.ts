import { defineConfig } from "cypress";

import {
  SUPER_USER_EMAIL,
  USER_EMAIL,
  PASSWORD,
} from "@shared/constants/tests";

export default defineConfig({
  e2e: {
    specPattern: "cypress/e2e/**/*.{cy,spec}.{js,jsx,ts,tsx}",
    baseUrl: "http://localhost:3000",
    env: {
      API_PREFIX: "api",
      PASSWORD,
      SUPER_USER_EMAIL,
      USER_EMAIL,
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
