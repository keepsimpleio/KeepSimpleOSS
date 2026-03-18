const PAGE = '/tools/longevity-protocol/habits/supplements';

describe('Supplements – /tools/longevity-protocol/habits/supplements', () => {
  describe('Desktop (1920x900)', () => {
    beforeEach(() => {
      cy.viewport(1920, 900);
      cy.visit(PAGE);
    });

    // 1. H1 existence
    it('has a visible H1', () => {
      cy.checkH1();
    });

    // 2. Japanese text existence
    it('has Japanese text rendered', () => {
      cy.checkJapaneseText();
    });

    // 3. All internal and external links are valid (reuses shared checkPageLinks command)
    it('has no broken internal or external links', () => {
      cy.checkPageLinks();
    });

    // 4. All images load – no undefined in src paths
    it('has no images with undefined or broken src paths', () => {
      cy.get('img').each($img => {
        const src = $img.attr('src');

        expect(src, 'img src should be defined').to.not.be.undefined;
        expect(
          src,
          `img src should not contain "undefined": ${src}`,
        ).to.not.include('undefined');

        if (src && src.startsWith('/')) {
          cy.request({ url: src, failOnStatusCode: false }).then(res => {
            expect(res.status, `Image returned ${res.status}: ${src}`).to.be.lt(
              400,
            );
          });
        }
      });
    });
  });

  // 5. Mobile – open chart modal and close via the modal close icon
  describe('Mobile (390x844)', () => {
    beforeEach(() => {
      cy.viewport(390, 844);
      cy.visit(PAGE);
    });

    it('opens the supplements chart modal and closes it via the close icon', () => {
      cy.get('[data-cy="open-chart-btn"]')
        .scrollIntoView()
        .should('be.visible');

      cy.get('[data-cy="open-chart-btn"]').click();

      // Modal opens immediately; html2canvas fills the image asynchronously
      cy.get('[data-cy="supplements-chart-modal"]').should('be.visible');

      // Wait for html2canvas to produce the data-URL
      cy.get('[data-cy="supplements-chart-img"]', { timeout: 15000 })
        .should('have.attr', 'src')
        .and('not.be.empty')
        .and('not.include', 'undefined');

      // Close via the modal's X icon
      cy.get('[data-cy="modal-close-icon"]').click({ force: true });

      cy.get('[data-cy="supplements-chart-modal"]').should('not.exist');
    });
  });
});

export {};
