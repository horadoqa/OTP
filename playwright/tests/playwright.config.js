const { defineConfig } = require("@playwright/test");

module.exports = defineConfig({
  testDir: ".",

  use: {
    baseURL: "http://127.0.0.1:8080"
  },

  webServer: {
    command: "npx http-server .. -p 8080 -c-1",
    url: "http://127.0.0.1:8080",
    reuseExistingServer: false
  }
});
