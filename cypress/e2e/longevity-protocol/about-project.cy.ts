export {};
const PAGE = '/tools/longevity-protocol/about-project';
const DEFAULT_DNA_SRC = '/keepsimple_/assets/longevity/dna/default.mp4';

describe('About Project – /tools/longevity-protocol/about-project', () => {
  beforeEach(() => {
    cy.viewport(1920, 900);
    cy.visit(PAGE);
  });

  // 1. H1 existence
  it('has a visible H1', () => {
    cy.checkH1();
  });

  // 2. DNA canvas: default.mp4 is present, autoplaying and looping
  it('renders the default DNA video with autoplay and loop', () => {
    cy.get(`video[src="${DEFAULT_DNA_SRC}"]`)
      .should('exist')
      .should($video => {
        expect($video).to.have.attr('autoplay');
        expect($video).to.have.attr('loop');
      });
  });

  // 3. All images load without undefined or broken src paths
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

  // 4. Basic stats section contains all 5 stats with non-empty values
  it('shows all basic stats with non-empty values', () => {
    cy.get('[data-cy="basic-stats"]').should('exist');
    cy.get('[data-cy="stat-item"]').should('have.length', 5);

    cy.get('[data-cy="stat-value"]').each($span => {
      const text = $span.text().trim();
      expect(text, 'Stat value should not be empty').to.not.be.empty;
      expect(text, 'Stat value should not contain "undefined"').to.not.include(
        'undefined',
      );
    });
  });

  // 5. All internal and external links are valid (reuses checkPageLinks command)
  it('has no broken internal or external links', () => {
    cy.checkPageLinks();
  });
});
