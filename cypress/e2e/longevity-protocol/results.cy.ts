export {};
const PAGE = '/tools/longevity-protocol/results';
const DEFAULT_DNA_SRC = '/keepsimple_/assets/longevity/dna/red-and-blue.mp4';

describe('Results – /tools/longevity-protocol/results', () => {
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

  // 4. All internal and external links are valid (reuses checkPageLinks command)
  it('has no broken internal or external links', () => {
    cy.checkPageLinks();
  });
});
