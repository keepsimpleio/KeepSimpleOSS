describe('template spec', () => {
  beforeEach(() => {
    cy.viewport(1920, 900);
    cy.visit(`${Cypress.config().baseUrl}/articles`);
  });

  it('Should show a h1', () => {
    cy.checkH1('Articles');
  });

  it("Should click and scroll to 'UX Core' section", () => {
    cy.scrollToSection('UX Core');
  });

  it("Should click and scroll to 'Thoughts' section", () => {
    cy.scrollToSection('Thoughts');
  });

  it("Should click and scroll to 'Project Management' section", () => {
    cy.scrollToSection('Project Management');
  });

  it('Should check all internal links', () => {
    cy.get('a').each($a => {
      const message = $a.text();
      expect($a, message).to.have.attr('href').not.contain('undefined');
    });
  });

  it('Should toggle Show Less Button', () => {
    cy.get('[data-cy="show more-less button"]').click();
  });

  it('Should toggle Show More Button', () => {
    cy.get('[data-cy="show more-less button"]').click();
  });
});
