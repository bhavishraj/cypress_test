
  import { isPermissionAllowed } from 'cypress-browser-permissions';
  describe('load test data', () => {


    it("location should be enabled", () => {
        expect(isPermissionAllowed("notifications")).to.be.true;
    });
    it('should load home page', () => {
      cy.visit('');
    });
});
