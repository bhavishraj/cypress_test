const apiUrl = `${Cypress.env('apiUrl')}`;
const apiLocationUrl = `${Cypress.env('apiUrl')}/geo/1.0/direct`;
const apiWeatherUrl = `${Cypress.env('apiUrl')}/data/2.5/weather`;
const locationParams = require('./apiParams/locQueryParams')();
const weatherParams = require('./apiParams/weatherQueryParams')();

describe('regression suite with validations for 3-4 cities', () => {
  it('validate locations ', () => {
    cy.log(locationParams);
    locationParams.forEach((queryParam, index) => {
      cy.request({
        method: 'GET',
        url: `${apiLocationUrl}`,
        qs: queryParam,
      }).then((res) => {
        cy.log('Location Response:', JSON.stringify(res.body));
        expect(res.status).to.eq(200);
        const response = res.body[0];
        expect(
          response,
          'Location response should contain properties : name, lat, lon, country'
        ).to.include.keys('name', 'lat', 'lon', 'country');
        expect(response.name, 'Name of the location').to.be.eq(queryParam.q);
        weatherParams[index].lon = response.lon;
        weatherParams[index].lat = response.lat;
        cy.request({
          method: 'GET',
          url: `${apiWeatherUrl}`,
          qs: weatherParams[index],
        }).then((res) => {
          expect(res.status).to.eq(200);
          cy.log('Weather Response:', JSON.stringify(res.body));
        });
      });
    });
  });
});
