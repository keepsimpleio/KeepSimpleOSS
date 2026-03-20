const PAGE = '/tools/longevity-protocol/habits/lifestyle';
const RED_DNA_SRC = '/keepsimple_/assets/longevity/dna/red.mp4';
describe('Lifestyle – /tools/longevity-protocol/habits/lifestyle', () => {
  // 1–4, 6–7: desktop viewport
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

    // 3. DNA layer: red.mp4 is loaded for habits pages and has autoplay + loop
    it('renders the red DNA video with autoplay and loop', () => {
      cy.get(`video[src="${RED_DNA_SRC}"]`)
        .should('exist')
        .should($video => {
          expect($video).to.have.attr('autoplay');
          expect($video).to.have.attr('loop');
        });
    });

    // 4. "Why do this" tooltip appears on desktop.
    // react-tooltip v5 lazy-renders children; the content only exists after hover.
    // it('shows why-do-this tooltip with content on hover (desktop)', () => {
    //   cy.visit(PAGE);

    //   cy.get('[data-cy="why-do-this-trigger"]')
    //     .first()
    //     .should('be.visible')
    //     .scrollIntoView()
    //     .trigger('mouseenter', { force: true })
    //     .trigger('mouseover', { force: true });
    //   cy.wait(10000);

    //   cy.get('[data-cy="why-do-this-content"]', { timeout: 10000 }).should(
    //     'be.visible',
    //   );
    // });
    // // 5. All internal and external links are valid
    // it('has no broken internal or external links', () => {
    //   cy.checkPageLinks();
    // });

    // 6. All images load without undefined or broken src paths
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

  // 7. "Why do this" modal opens and closes on mobile
  describe('Mobile (390x844)', () => {
    beforeEach(() => {
      cy.viewport(390, 844);
      cy.visit(PAGE);
    });

    it('opens and closes the Why do this modal on mobile', () => {
      cy.scrollTo(0, 400);
      cy.get('[data-cy="why-do-this-trigger"]').first().click({ force: true });
      cy.wait(3000);

      cy.get('[data-cy="why-do-this-content"]').should('be.visible');

      cy.get('[data-cy="cookie-box-accept"]').click();
      cy.get('[data-cy="why-do-this-modal-close"]').click();

      cy.get('[data-cy="why-do-this-modal"]').should('not.exist');
    });
  });
});

export {};
