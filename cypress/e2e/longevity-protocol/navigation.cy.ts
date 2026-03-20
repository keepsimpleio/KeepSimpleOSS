export {};
const PAGES = [
  '/tools/longevity-protocol/about-project',
  '/tools/longevity-protocol/habits/lifestyle',
  '/tools/longevity-protocol/habits/study',
  '/tools/longevity-protocol/habits/diet',
  '/tools/longevity-protocol/habits/workout',
  '/tools/longevity-protocol/habits/sleep',
  '/tools/longevity-protocol/habits/supplements',
  '/tools/longevity-protocol/environment',
  '/tools/longevity-protocol/results',
];

describe('Longevity Protocol – Navigation', () => {
  PAGES.forEach(path => {
    it(`loads ${path} without errors`, () => {
      cy.visit(path);
      cy.get('main').should('exist');
      // No uncaught JS errors (Cypress catches these by default)
    });
  });

  it('navigates between habit sub-pages via nav/sidebar', () => {
    cy.visit('/tools/longevity-protocol/habits/lifestyle');
    cy.contains('a', /diet/i).click();
    cy.url().should('include', '/habits/diet');
  });

  it('does not 404 on any protocol page', () => {
    PAGES.forEach(path => {
      cy.request(path).its('status').should('eq', 200);
    });
  });
});
