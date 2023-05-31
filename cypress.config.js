const { defineConfig } = require("cypress");
const {
  cypressBrowserPermissionsPlugin,
} = require("cypress-browser-permissions");

module.exports = defineConfig({
  projectId: "3yc824",
  e2e: {
    baseUrl: "http://localhost:3000/weather",
    env: {
      apiUrl: "https://api.openweathermap.org",
      browserPermissions: {
        notifications: "allow",
        geolocation: "allow",
      },
    },
    testIsolation: false,
    chromeWebSecurity: false,
    setupNodeEvents(on, config) {
      // implement node event listeners here
      config = cypressBrowserPermissionsPlugin(on, config);
      return config;
    },
  },
});
