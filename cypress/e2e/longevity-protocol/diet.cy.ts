const PAGE = '/tools/longevity-protocol/habits/diet';

describe('Diet – /tools/longevity-protocol/habits/diet', () => {
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

    // 3. WhatToEatOrAvoid – click second selectable item, checkbox state updates
    it('updates checkbox state when clicking a WhatToEatOrAvoid item', () => {
      // Items with role="checkbox" only exist in the "what to eat" section
      cy.scrollTo(0, 1600);
      cy.get('[data-cy="diet-checkbox"]').eq(0).scrollIntoView();

      // First item starts selected – checkmark is present
      cy.get('[data-cy="diet-checkbox"]')
        .eq(0)
        .find('[data-cy="diet-checkmark"]')
        .should('exist');

      // Click the second selectable item
      cy.get('[data-cy="diet-checkbox"]')
        .eq(1)
        .closest('[data-cy="what-to-eat-or-avoid"]')
        .click({ force: true });

      // Second item is now checked
      cy.get('[data-cy="diet-checkbox"]')
        .eq(1)
        .find('[data-cy="diet-checkmark"]')
        .should('exist');

      // First item is now unchecked
      cy.get('[data-cy="diet-checkbox"]')
        .eq(0)
        .find('[data-cy="diet-checkmark"]')
        .should('not.exist');
    });

    // 4. DietResults – click second item → active states update + YourDiet data changes
    it('activates second DietResults item and updates YourDiet data', () => {
      // Scroll to the DietResults component
      cy.get('[data-cy="diet-results-item"]').first().scrollIntoView();
      cy.wait(300);

      // Dismiss the cookie banner so it does not cover the result items
      cy.get('[data-cy="cookie-box-accept"]').click();

      // Initial state: first item (id=1) is active, second is not
      cy.get('[data-cy="diet-results-item"]')
        .eq(0)
        .should('have.attr', 'data-active', 'true');
      cy.get('[data-cy="diet-results-item"]')
        .eq(1)
        .should('have.attr', 'data-active', 'false');

      // Capture the current YourDiet selected id before the change
      cy.get('[data-cy="your-diet"]')
        .invoke('attr', 'data-selected-id')
        .then(idBefore => {
          // Click the inner img of the second item; the img click bubbles to the
          // parent div's onClick and avoids any ::after overlay that may block the hit
          cy.get('[data-cy="diet-results-item"]')
            .eq(1)
            .find('img')
            .click({ force: true });

          cy.wait(300);

          // Active states have flipped
          cy.get('[data-cy="diet-results-item"]')
            .eq(1)
            .should('have.attr', 'data-active', 'true');
          cy.get('[data-cy="diet-results-item"]')
            .eq(0)
            .should('have.attr', 'data-active', 'false');

          // YourDiet animation was triggered
          cy.get('[data-cy="your-diet"]').should(
            'have.attr',
            'data-active',
            'true',
          );

          // YourDiet is now displaying a different diet entry (data-selected-id changed)
          cy.get('[data-cy="your-diet"]')
            .invoke('attr', 'data-selected-id')
            .should('not.equal', idBefore);
        });
    });
    // 5. All internal and external links are valid (reuses shared checkPageLinks command)
    it('has no broken internal or external links', () => {
      cy.checkPageLinks();
    });

    // 6. All images load – no undefined in src paths
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

    // Mobile modal – tapping the heart image in WhatToEatOrAvoid opens the
    // AboutTheProduct modal; closing via the modal close icon dismisses it
    it('opens and closes the mobile AboutTheProduct modal on heart image tap', () => {
      // Dismiss the cookie banner before any interaction
      cy.get('[data-cy="cookie-box-accept"]').click();

      // Scroll to the first WhatToEatOrAvoid card that has a heart trigger
      cy.get('[data-cy="heart-trigger"]').first().scrollIntoView();

      // Tap the heart image – on mobile this opens the modal instead of a tooltip
      cy.get('[data-cy="heart-trigger"]')
        .first()
        .find('img')
        .click({ force: true });

      // AboutTheProduct content is now visible inside the portal modal
      cy.get('[data-cy="about-product"]').should('be.visible');

      // Close via the modal close icon
      cy.get('[data-cy="modal-close-icon"]').click();

      // Modal and its content are gone
      cy.get('[data-cy="about-product"]').should('not.exist');
    });
  });
});

export {};
