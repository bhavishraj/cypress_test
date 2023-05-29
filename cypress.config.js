const { defineConfig } = require("cypress");
const {
  cypressBrowserPermissionsPlugin,
} = require("cypress-browser-permissions");

module.exports = defineConfig({
  e2e: {
    testIsolation: false,
    env: {
      baseUrl: "http://localhost:3000/weather",
      apiUrl: "https://api.openweathermap.org",
      browserPermissions: {
        notifications: "allow",
        geolocation: "allow",
      },
    },
    setupNodeEvents(on, config) {
      // implement node event listeners here
      config = cypressBrowserPermissionsPlugin(on, config);
      return config;
    },
  },
});
