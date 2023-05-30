const apiUrl = `${Cypress.env('apiUrl')}`;
const apiLocationUrl = `${Cypress.env('apiUrl')}/geo/1.0/direct`;
const apiWeatherUrl = `${Cypress.env('apiUrl')}/data/2.5/weather`;
const locationParams = require('./apiParams/locQueryParams')();
const weatherParams = require('./apiParams/weatherQueryParams')();

/**
 * # api-weather-forecast-service.cy.js
 * ## regression suite with validations for 3-4 cities
 * - fetch locations details (longitude and latitude) for 3 locations present in `apiParams/locQueryParams.js` file
 * - fetch weather details for the fetched locations' lat & lon
 */

describe('regression suite with validations for 3-4 cities', () => {
  it('fetch details of 3 locations and then fetch the weather forecast statics for those locations', () => {
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
          expect(
            res.body,
            'Weather response should contain properties : coord, weather, main, visibility, name, sys'
          ).to.include.keys('coord', 'weather', 'main', 'visibility', 'name', 'sys');
          expect(
            res.body.coord,
            'res.body.coord should contain properties : lon, lat'
          ).to.include.keys('lon', 'lat');
          expect(
            res.body.main,
            'res.body.main should contain properties : temp, temp_min, temp_max, humidity'
          ).to.include.keys('temp', 'temp_min', 'temp_max', 'humidity');
          expect(
            res.body.sys,
            'res.body.sys should contain properties : country, sunrise, sunset'
          ).to.include.keys('country', 'sunrise', 'sunset');
        });
      });
    });
  });
});
