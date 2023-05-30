import { isPermissionAllowed } from 'cypress-browser-permissions';
const uiUtils = require('./utils');
const apiWeatherUrl = `${Cypress.env('apiUrl')}/data/2.5/weather`;
const testContext = {};

describe('load home page', () => {
  it('location should be enabled', () => {
    expect(isPermissionAllowed('notifications')).to.be.true;
  });
  it('should load home page', () => {
    cy.intercept('GET', '**/data/2.5/weather**').as('requests');
    cy.visit('/');
    cy.wait('@requests');
  });
});

describe('verify static elements', () => {
  it('should verify home page title, settings button and photo author details link', () => {
    cy.get('.title').should('be.visible').and('have.text', `Dashboard`);
    cy.get('.mt-5 > a').should('have.attr', 'href').and('include', 'weather/settings');
    cy.get('.photo-author > a')
      .contains('César Couto', {
        matchCase: false,
      })
      .should('have.attr', 'href')
      .and('include', 'unsplash.com');
    cy.get('.photo-author > a')
      .contains('Unsplash', {
        matchCase: false,
      })
      .should('have.attr', 'href')
      .and('include', 'unsplash.com');
  });

  it('should verify settings page title, other static elements', () => {
    cy.get('.mt-5 > a')
      .contains('Settings', {
        matchCase: false,
      })
      .click();
    cy.get('.has-text-centered > .title').should('be.visible').and('have.text', `Settings`);
    cy.get('.container > :nth-child(1) > .title')
      .should('be.visible')
      .and('have.text', `Locations`);
    cy.get('.container > :nth-child(1) > .subtitle')
      .should('be.visible')
      .and('have.text', `Select the locations you want to see`);
    cy.get('.container > :nth-child(2) > .title').should('be.visible').and('have.text', `Units`);
    cy.get('.container > :nth-child(2) > .subtitle')
      .should('be.visible')
      .and('have.text', `Select the unit system of your preference`);
    cy.get('.section')
      .first()
      .find('.button')
      .should('be.visible')
      .and('contain.text', `Add new location`);
    cy.get('.section >.buttons > .button').first().and('have.text', `Metric ✅`);
    cy.get('.section >.buttons > .button').last().and('have.text', `Imperial ⬜`);
  });

  it('should return to Dashboard', () => {
    cy.get('.has-text-centered > a').should('have.attr', 'href').and('include', '/weather');
    uiUtils.backToDashboard();
  });

  it('should assert that the Unit displayed in Dashboard is Metric', () => {
    cy.get('[data-testid="weather-card-temperature"]').contains('span', '°C', {
      matchCase: false,
    });
  });
});
describe('verify application can use the current location', () => {
  it('should verify application can use the current location', () => {
    cy.get('[data-testid="weather-card"]').should('have.length', 3);
  });
});

describe('Verify that the user can add/remove new geographical locations', () => {
  it('should navigate to settings page', () => {
    uiUtils.navigateToSettings();
  });

  context('Verify that the user can add new geographical locations', () => {
    it('should add a new location', () => {
      const locationName = 'Oslo';
      uiUtils.addLocation(locationName, 3);
    });

    it('should return to Dashboard', () => {
      uiUtils.backToDashboard();
    });

    it('should assert the addition of new location', () => {
      cy.get('[data-testid="weather-card"]').should('have.length', 4);
      cy.get('[data-testid="weather-card"]').last().should('contain.text', `Oslo`);
      cy.get(`[aria-label="See weather for Oslo"]`).should('be.visible').click();
    });

    it('should assert the weather forecast details of newly added location', () => {
      cy.url().should('be.equal', 'http://localhost:3000/weather/Oslo');
      cy.get('.title').should('be.visible').and('have.text', `Oslo`);
      cy.get(`[aria-label="Conditions"]`).should('be.visible');
      cy.get(`[aria-label="Current temperature"]`).should('be.visible');
      cy.get(`[aria-label="Highest expected temperature"]`).should('be.visible');
      cy.get(`[aria-label="Lowest expected temperature"]`).should('be.visible');
      cy.contains('Sunrise', {
        matchCase: false,
      }).should('be.visible');
      cy.contains('Sunset', {
        matchCase: false,
      }).should('be.visible');
      cy.contains('Humidity', {
        matchCase: false,
      }).should('be.visible');
      cy.contains('Visibility', {
        matchCase: false,
      }).should('be.visible');
    });
    it('should return to Dashboard', () => {
      uiUtils.backToDashboard();
    });
  });
  context('Verify that the user can remove newly added geographical locations', () => {
    it('should navigate to settings page', () => {
      uiUtils.navigateToSettings();
    });

    it('should delete the newly added location and assert the count of locations in list', () => {
      const locationName = 'Oslo';
      uiUtils.deleteLocation(locationName, 2);
    });

    it('should return to Dashboard', () => {
      uiUtils.backToDashboard();
    });

    it('should assert that the deleted location is not present in the dashboard', () => {
      const locationName = 'Oslo';
      uiUtils.assertDeletedLocation(locationName, 3);
    });
  });
});

describe('Verify that the user can switch the preferred units', () => {
  context('Verify that the user can switch the preferred units from Metric to Imperial', () => {
    it('should navigate to settings page', () => {
      uiUtils.navigateToSettings();
    });

    it('should assert that units Metric is selected and switch the units to Imperial', () => {
      cy.get('.section >.buttons > .button').first().and('have.text', `Metric ✅`);
      cy.get('.section >.buttons > .button').last().and('have.text', `Imperial ⬜`).click();
    });

    it('should assert that units Imperial is selected after switching', () => {
      cy.get('.section >.buttons > .button').first().and('contain.text', `Metric ⬜`);
      cy.get('.section >.buttons > .button').last().and('have.text', `Imperial ✅`);
    });

    it('should return to Dashboard', () => {
      uiUtils.backToDashboard();
    });

    it('should assert that the Unit displayed in Dashboard is Imperial', () => {
      cy.get('[data-testid="weather-card-temperature"]').contains('span', '°F', {
        matchCase: false,
      });
    });
  });
  context('Revert the preferred units back to Metric', () => {
    it('should navigate to settings page', () => {
      uiUtils.navigateToSettings();
    });

    it('should assert that units Metric is selected and switch the units to Imperial', () => {
      cy.get('.section >.buttons > .button').first().and('have.text', `Metric ⬜`).click();
      cy.get('.section >.buttons > .button').last().and('have.text', `Imperial ⬜`);
    });

    it('should return to Dashboard', () => {
      uiUtils.backToDashboard();
    });

    it('should assert that the Unit displayed in Dashboard is Imperial', () => {
      cy.get('[data-testid="weather-card-temperature"]').contains('span', '°C', {
        matchCase: false,
      });
    });
  });
});

describe('Mock a location and validate the current weather, temperature, sunrise, and sunset times', () => {
  it(`Load fixture data to assert mocked location's statistics`, () => {
    cy.log('Loading fixture data from weather.json');
    return cy
      .readFile('cypress/fixtures/uiMockResponse/weather.json')
      .as('fixtureData')
      .then((fixtureData) => {
        Object.assign(testContext, fixtureData);
      });
  });

  it('should navigate to settings page', () => {
    uiUtils.navigateToSettings();
  });

  context('Verify that the user can add new geographical locations', () => {
    it('should add a new location - Delhi', () => {
      const locationName = 'Delhi';
      uiUtils.addLocation(locationName, 3);
    });
  });

  context('Verify the new added location details in Dashboard', () => {
    it(`should invoke cy.intercept to mock a location's weather forecast and return to Dashboard`, () => {
      uiUtils.interceptMockedEndpoints();
      uiUtils.backToDashboard();
    });

    it('should assert the addition of new location', () => {
      cy.get('[data-testid="weather-card"]').should('have.length', 4);
      cy.get('[data-testid="weather-card"]').last().should('contain.text', `Delhi`);
      uiUtils.interceptMockedEndpoints();
      cy.get(`[aria-label="See weather for Delhi"]`).should('be.visible').click();
    });

    it('should assert the weather forecast details of newly added location', () => {
      const sunriseTime = uiUtils.getTime(testContext.sys.sunrise);
      const sunsetTime = uiUtils.getTime(testContext.sys.sunset);
      cy.url().should('be.equal', 'http://localhost:3000/weather/Delhi');
      cy.get('.title').should('be.visible').and('have.text', `Delhi`);
      cy.get(`[aria-label="Conditions"]`).should('be.visible');
      cy.get(`[aria-label="Current temperature"]`)
        .should('be.visible')
        .should('have.text', `${testContext.main.temp} °C`);
      cy.get(`[aria-label="Highest expected temperature"]`)
        .should('be.visible')
        .should('have.text', `H: ${testContext.main.temp_max} °C`);
      cy.get(`[aria-label="Lowest expected temperature"]`)
        .should('be.visible')
        .should('have.text', `L: ${testContext.main.temp_min} °C`);
      cy.contains('Sunrise', {
        matchCase: false,
      })
        .should('be.visible')
        .siblings('.is-size-5')
        .should('have.text', sunriseTime);
      cy.contains('Sunset', {
        matchCase: false,
      })
        .should('be.visible')
        .siblings('.is-size-5')
        .should('have.text', sunsetTime);
      cy.contains('Humidity', {
        matchCase: false,
      })
        .should('be.visible')
        .siblings('.is-size-5')
        .should('have.text', `${testContext.main.humidity}%`);
      cy.contains('Visibility', {
        matchCase: false,
      }).should('be.visible');
    });

    it('should return to Dashboard', () => {
      uiUtils.interceptMockedEndpoints();
      uiUtils.backToDashboard();
    });
  });

  context('Verify that the user can remove newly added geographical locations', () => {
    it('should navigate to settings page', () => {
      uiUtils.navigateToSettings();
    });

    it('should delete the newly added location and assert the count of locations in list', () => {
      const locationName = 'Delhi';
      uiUtils.deleteLocation(locationName, 2);
    });

    it('should return to Dashboard', () => {
      uiUtils.backToDashboard();
    });

    it('should assert that the deleted location is not present in the dashboard', () => {
      const locationName = 'Delhi';
      uiUtils.assertDeletedLocation(locationName, 3);
    });
  });
});
