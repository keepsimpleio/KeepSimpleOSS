describe('template spec', () => {
  beforeEach(() => {
    cy.viewport(1920, 900);
    cy.visit(`${Cypress.config().baseUrl}/company-management`);
  });

  it('Should show a h1', () => {
    cy.checkH1('Pyramid of Operational Needs');
  });

  it('Should start playing a music', () => {
    cy.playAudio();
  });

  it('should switch pyramids correctly', () => {
    cy.checkPyramidChange('1', '2', '0');
  });

  it('checks external links on a specific page', () => {
    const singleRoute = `${Cypress.config().baseUrl}/company-management`;

    cy.visit(singleRoute);

    cy.get('a').each($a => {
      const href = $a.prop('href');
      const message = $a.text();

      expect($a, message)
        .to.have.attr('href')
        .and.not.match(/undefined|null|^$/);

      if (
        href &&
        href.startsWith('http') &&
        !href.includes('localhost') &&
        !href.includes('linkedin.com') &&
        !href.includes('facebook.com')
      ) {
        cy.request({
          url: href,
          failOnStatusCode: false,
        }).then(response => {
          cy.log(
            `Checking external link: ${href} - Status: ${response.status}`,
          );
          expect(response.status).to.be.oneOf([200, 301, 302, 403]);
        });
      }
    });
  });
});
