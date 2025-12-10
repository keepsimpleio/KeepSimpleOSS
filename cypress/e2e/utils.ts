export const checkPageLoad = (
  route: string,
  viewport: { width: number; height: number; name: string },
) => {
  cy.viewport(viewport.width, viewport.height);

  cy.on('fail', error => {
    cy.log(`Failed to load ${route}: ${error.message}`);
    throw error;
  });

  cy.visit(route, {
    timeout: 10000,
    retryOnNetworkFailure: true,
  });

  cy.url().should('include', route);

  cy.get('section', { timeout: 10000 }).should('exist').should('be.visible');

  cy.window().then(win => {
    expect(win.document.readyState).to.eq('complete');
  });
};
