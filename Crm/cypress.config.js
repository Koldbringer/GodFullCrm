const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseUrl: 'http://localhost:3000', // Zmień na adres URL Twojej aplikacji
  },
  component: {
    devServer: {
      framework: 'next',
      bundler: 'webpack',
    },
  },
});