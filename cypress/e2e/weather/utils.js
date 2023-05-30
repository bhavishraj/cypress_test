global.crd = {};
function success(pos) {
  global.crd = pos.coords;

  cy.log('Your current position is:');
  cy.log(`Latitude : ${global.crd.latitude}`);
  cy.log(`Longitude: ${global.crd.longitude}`);
  cy.log(`More or less ${global.crd.accuracy} meters.`);
}
function getLocation() {
  navigator.geolocation.getCurrentPosition(success);
}
function getTime(unixEpochTime) {
  const dateTime = new Date(unixEpochTime * 1000);
  const dateTimeLocaleString = dateTime.toLocaleString();
  return dateTimeLocaleString.split(' ').splice(1).join(' ');
}
function backToDashboard() {
  cy.intercept('GET', '**/data/2.5/weather**').as('requests');
  cy.get('.has-text-centered > a').contains('Back to Dashboard').click();
  cy.wait(500);
  cy.wait('@requests');
}
function navigateToSettings() {
  cy.get('.mt-5 > a').contains('Settings').click();
  cy.url().should('be.equal', 'http://localhost:3000/weather/settings');
}

function addLocation(name, countOfLocation) {
  cy.window().then((win) => {
    cy.stub(win, 'prompt').returns(name);
  });
  cy.get('.section')
    .first()
    .find('.button')
    .should('be.visible')
    .and('contain.text', `Add new location`)
    .click();
  cy.get('.mb-3').should('have.length', countOfLocation);
  cy.get('.mb-3').last().find('.is-size-4').should('contain.text', name);
}

function deleteLocation(name, countOfLocation) {
  cy.get('.mb-3').last().find('.is-size-4').should('contain.text', name);
  cy.get(`[aria-label="Remove ${name}"]`).should('be.visible').click();
  cy.get('.mb-3').should('have.length', countOfLocation);
}

function assertDeletedLocation(name, countOfLocation) {
  cy.get('[data-testid="weather-card"]').should('have.length', countOfLocation);
  cy.get('[data-testid="weather-card"]').last().should('not.contain.text', name);
  cy.get(`[aria-label="See weather for ${name}"]`).should('not.exist');
}

function interceptMockedEndpoints() {
  cy.intercept('GET', '**/geo/1.0/direct?q=Delhi**', {
    fixture: './uiMockResponse/location.json',
  });
  cy.intercept('GET', '**/data/2.5/weather?lat=28.6517178&lon=77.2219388**', {
    fixture: './uiMockResponse/weather.json',
  });
}

module.exports = {
  getLocation,
  getTime,
  backToDashboard,
  addLocation,
  deleteLocation,
  assertDeletedLocation,
  navigateToSettings,
  interceptMockedEndpoints,
};
