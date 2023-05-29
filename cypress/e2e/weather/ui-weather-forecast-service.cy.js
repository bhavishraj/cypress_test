import { isPermissionAllowed } from 'cypress-browser-permissions';
const uiUtils = require('./utils');
const apiWeatherUrl = `${Cypress.env('apiUrl')}/data/2.5/weather`;
// const crd = {};

describe('load home page', () => {
  it('location should be enabled', () => {
    expect(isPermissionAllowed('notifications')).to.be.true;
  });
  it('should load home page', () => {
    cy.intercept('GET', '**/data/2.5/weather**').as('getusers');
    cy.visit('/');
    cy.wait('@getusers');
  });
});

describe('verify static elements', () => {
  it('should verify home page title, settings button and photo author details link', () => {
    cy.get('.title').should('be.visible').and('have.text', `Dashboard`);
    cy.get('.mt-5 > a').should('have.attr', 'href').and('include', 'weather/settings');
    cy.get('.photo-author > a')
      .contains('César Couto')
      .should('have.attr', 'href')
      .and('include', 'unsplash.com');
    cy.get('.photo-author > a')
      .contains('Unsplash')
      .should('have.attr', 'href')
      .and('include', 'unsplash.com');
  });
  it('should verify settings page title, other static elements', () => {
    cy.get('.mt-5 > a').contains('Settings').click();
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
    cy.intercept('GET', '**/data/2.5/weather**').as('requests');
    cy.get('.has-text-centered > a').contains('Back to Dashboard').click();
    cy.wait(500);
    cy.wait('@requests');
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

  it('should fetch current longitude and latitude', () => {
    cy.myproject.getLocation();
  });

  // it('should fetch current location', () => {
  //   const param = {
  //     lat: crd.latitude,
  //     lon: crd.longitude,
  //     units: 'metric',
  //     APPID: '3c82d13c31165dc1e1c9b1a3b6affeff',
  //   };
  //   cy.request({
  //     method: 'GET',
  //     url: `${apiWeatherUrl}`,
  //     qs: param,
  //   }).then((res) => {
  //     expect(res.status).to.eq(200);
  //     cy.log('Weather Response:', JSON.stringify(res.body));
  //   });
  // });
});

describe('Verify that the user can add/remove new geographical locations', () => {
  it('should navigate to settings page', () => {
    cy.get('.mt-5 > a').contains('Settings').click();
    cy.url().should('be.equal', 'http://localhost:3000/weather/settings');
  });

  context('Verify that the user can add new geographical locations', () => {
    it('should add a new location', () => {
      cy.get('.mt-5 > a').contains('Settings').click();
      cy.window().then((win) => {
        cy.stub(win, 'prompt').returns('Oslo');
      });
      cy.get('.section')
        .first()
        .find('.button')
        .should('be.visible')
        .and('contain.text', `Add new location`)
        .click();
      cy.get('.mb-3').should('have.length', 3);
      cy.get('.mb-3').last().find('.is-size-4').should('contain.text', `Oslo`);
    });

    it('should return to Dashboard', () => {
      cy.intercept('GET', '**/data/2.5/weather**').as('requests');
      cy.get('.has-text-centered > a').contains('Back to Dashboard').click();
      cy.wait(500);
      cy.wait('@requests');
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
      cy.contains('Sunrise').should('be.visible');
      cy.contains('Sunset').should('be.visible');
      cy.contains('Humidity').should('be.visible');
      cy.contains('Visibility').should('be.visible');
    });
    it('should return to Dashboard', () => {
      cy.intercept('GET', '**/data/2.5/weather**').as('requests');
      cy.get('.has-text-centered > a').contains('Back to Dashboard').click();
      cy.wait(500);
      cy.wait('@requests');
    });
  });
  context('Verify that the user can remove newly added geographical locations', () => {
    it('should navigate to settings page', () => {
      cy.get('.mt-5 > a').contains('Settings').click();
      cy.url().should('be.equal', 'http://localhost:3000/weather/settings');
    });
    it('should delete the newly added location', () => {
      cy.get('.mb-3').last().find('.is-size-4').should('contain.text', `Oslo`);
      cy.get(`[aria-label="Remove Oslo"]`).should('be.visible').click();
    });
    it('should assert the deleted location is not present in the list', () => {
      cy.get('.mb-3').should('have.length', 2);
    });
    it('should return to Dashboard', () => {
      cy.intercept('GET', '**/data/2.5/weather**').as('requests');
      cy.get('.has-text-centered > a').contains('Back to Dashboard').click();
      cy.wait(500);
      cy.wait('@requests');
    });
    it('should assert that the deleted location is not present in the dashboard', () => {
      cy.get('[data-testid="weather-card"]').should('have.length', 3);
      cy.get('[data-testid="weather-card"]').last().should('not.contain.text', `Oslo`);
      cy.get(`[aria-label="See weather for Oslo"]`).should('not.exist');
    });
  });
});

describe('Verify that the user can switch the preferred units', () => {
  context('Verify that the user can switch the preferred units from Metric to Imperial', () => {
    it('should navigate to settings page', () => {
      cy.get('.mt-5 > a').contains('Settings').click();
      cy.url().should('be.equal', 'http://localhost:3000/weather/settings');
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
      cy.intercept('GET', '**/data/2.5/weather**').as('requests');
      cy.get('.has-text-centered > a').contains('Back to Dashboard').click();
      cy.wait(500);
      cy.wait('@requests');
    });
    it('should assert that the Unit displayed in Dashboard is Imperial', () => {
      cy.get('[data-testid="weather-card-temperature"]').contains('span', '°F', {
        matchCase: false,
      });
    });
  });
  context('Revert the preferred units back to Metric', () => {
    it('should navigate to settings page', () => {
      cy.get('.mt-5 > a').contains('Settings').click();
      cy.url().should('be.equal', 'http://localhost:3000/weather/settings');
    });
    it('should assert that units Metric is selected and switch the units to Imperial', () => {
      cy.get('.section >.buttons > .button').first().and('have.text', `Metric ⬜`).click();
      cy.get('.section >.buttons > .button').last().and('have.text', `Imperial ⬜`);
    });
    it('should return to Dashboard', () => {
      cy.intercept('GET', '**/data/2.5/weather**').as('requests');
      cy.get('.has-text-centered > a').contains('Back to Dashboard').click();
      cy.wait(500);
      cy.wait('@requests');
    });
    it('should assert that the Unit displayed in Dashboard is Imperial', () => {
      cy.get('[data-testid="weather-card-temperature"]').contains('span', '°C', {
        matchCase: false,
      });
    });
  });
});
