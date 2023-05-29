cy.myproject = {
  getLocation: () => {
    // function success(pos) {
    //   crd = pos.coords;

    //   cy.log('Your current position is:');
    //   cy.log(`Latitude : ${crd.latitude}`);
    //   cy.log(`Longitude: ${crd.longitude}`);
    //   cy.log(`More or less ${crd.accuracy} meters.`);
    //   return crd;
    // }
    let crd = {};
    navigator.geolocation.getCurrentPosition((success) => {
      cy.log(`Latitude 111: ${success.coords.latitude}`);
      cy.log(`Longitude: ${success.coords.longitude}`);
      crd = success.coords.latitude;
      //   return success.coords;
    });
    cy.log(crd);
  },
};
