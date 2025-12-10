describe('template spec', () => {
  beforeEach(() => {
    cy.viewport(1920, 900);
    cy.visit(`${Cypress.config().baseUrl}/articles/what-is-ux-core`);
  });

  it('Should show a h1', () => {
    cy.checkH1(
      'Reintroduction to UX Core - the world’s largest open-source library of nudging strategies and cognitive biases.',
    );
  });

  it('verifies all image src URLs are valid', () => {
    cy.validateAllImages();
  });

  it('zooms in on the first image and zooms out on second click', () => {
    cy.get('[data-cy="zoom-trigger"]').first().click();
    cy.get('[data-cy="zoomed-image"]:visible').should('exist');
    cy.get('[data-cy="zoomed-image"]:visible').click();
    cy.get('[data-cy="zoomed-image"]:visible').should('not.exist');
  });
});
