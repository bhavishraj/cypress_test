# cypress_test

## Requirement:

1. Node 20.2

## Steps to run the test:

1. Clone the repo
1. Start the weather app
1. run `npm install` to install required packages
1. Open CLI using command `npm run cypress:open` and run tests:
   - API tests are present in api-weather-forecast-service.cy.js
   - UI tests are present in api-weather-forecast-service.cy.js
1. Command to run UI test headless is `dnpm run cy:run -- --spec "cypress/e2e/weather/ui-weather-forecast-service.cy.js" --config-file "cypress.config.js"`
1. Command to run UI test headless in recording mode `npm run cy:run -- --spec "cypress/e2e/weather/*-weather-forecast-service.cy.js" --config-file "cypress.config.js" --record --key 220be9c2-565e-44fc-843b-86e7764dd69a`
