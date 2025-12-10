describe('template spec', () => {
  beforeEach(() => {
    cy.viewport(1920, 900);
    cy.visit(`${Cypress.config().baseUrl}`);
  });

  it('should show a h1', () => {
    cy.checkH1('Wolf Alexanyan');
  });

  it('should check external links and their accessibility', () => {
    cy.checkExternalLinks(['linkedin.com', 'facebook.com']);
  });

  it('should check Our Tools', () => {
    cy.get('[data-test-id="tool"]').click({ multiple: true });
  });

  it('should start Serenity Mode', () => {
    cy.get('[data-test-id="start-serenity"]').click();
    cy.get('audio').should('have.prop', 'paused', false);

    cy.get('[data-test-id="exit-serenity"]').click();
  });

  it('should change theme color', () => {
    cy.get('[data-test-id="theme-toggle"]').click();
    cy.get('body').should('have.class', 'darkTheme keepsimplePagesDark');
  });

  it('should change the language to Russian', () => {
    cy.get('[data-test-id="language-toggle"]', { timeout: 5000 })
      .should('exist')
      .click();
    cy.url().should('include', '/ru');
    cy.checkH1('Вольф Алексанян');
  });
});
