const PAGE = '/tools/longevity-protocol/habits/study';

describe('Study – /tools/longevity-protocol/habits/study', () => {
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

    // 3. StudySection page-switcher click → FlipCard wrapper becomes visible
    it('shows FlipCard after clicking the page-switcher image', () => {
      cy.scrollTo(0, 800);
      cy.get('[data-cy="page-switcher"]').first().click();

      cy.get('[data-cy="flip-card-wrapper"]').first().should('be.visible');
    });

    // 4. All internal and external links are valid (reuses shared checkPageLinks command)
    it('has no broken internal or external links', () => {
      cy.checkPageLinks();
    });

    // 5. All images load – no undefined in src paths
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

  describe('Mobile (390x844)', () => {
    beforeEach(() => {
      cy.viewport(390, 844);
      cy.visit(PAGE);
    });

    // 6. Scroll to second StudySection, expand clamped HTMLClamp via show-more button
    it('expands clamped content via show-more button in second StudySection', () => {
      cy.get('[data-cy="study-section"]').eq(1).scrollIntoView();

      cy.get('[data-cy="study-section"]')
        .eq(1)
        .find('[data-cy="show-more-btn"]')
        .should('be.visible')
        .click();

      cy.get('[data-cy="study-section"]')
        .eq(1)
        .find('[data-cy="html-clamp-content"]')
        .should('have.attr', 'data-expanded', 'true');
    });

    // 7. Scroll to second StudySection, open FlipCard modal via Learn more (BorderedPill),
    //    then close it via the Close BorderedPill inside the modal
    it('opens and closes FlipCard modal via Learn more / Close buttons in second StudySection', () => {
      cy.get('[data-cy="study-section"]').eq(1).scrollIntoView();

      cy.get('[data-cy="study-section"]')
        .eq(1)
        .find('[data-cy="learn-more-btn"]')
        .should('be.visible')
        .click({ force: true });

      cy.get('[data-cy="study-flip-card-modal"]').should('be.visible');
      cy.get('[data-cy="cookie-box-accept"]').click();
      cy.get('[data-cy="study-close-btn"]')
        .should('be.visible')
        .click({ force: true });

      cy.get('[data-cy="study-flip-card-modal"]').should('not.exist');
    });
  });
});

export {};
