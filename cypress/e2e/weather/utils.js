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

module.exports = {
  getLocation,
};
