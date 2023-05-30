const { defineConfig } = require("cypress");
const {
  cypressBrowserPermissionsPlugin,
} = require("cypress-browser-permissions");

module.exports = defineConfig({
  projectId: "3yc824",
  env: {
    baseUrl: "http://localhost:3000/weather",
    apiUrl: "https://api.openweathermap.org",
    browserPermissions: {
      notifications: "allow",
      geolocation: "allow",
    },
  },
  e2e: {
    testIsolation: false,
    chromeWebSecurity: false,
    setupNodeEvents(on, config) {
      // implement node event listeners here
      config = cypressBrowserPermissionsPlugin(on, config);
      return config;
    },
  },
});
