/**
 * MobileNavigation – tests for the "Next" button (BorderedPill) and the
 * getNextNavItem / buildNavOrder ordering logic.
 *
 * buildNavOrder expands the "Habits" entry into its six sub-pages, skips the
 * external AI-Assistant link, and produces this sequence:
 *
 *   about-project → lifestyle → study → diet → workout →
 *   sleep → supplements → environment → results → (wraps to about-project)
 */

const BASE = '/tools/longevity-protocol';

/** Full ordered sequence that buildNavOrder builds */
const NAV_ORDER = [
  { path: `${BASE}/about-project`, name: 'About Project' },
  { path: `${BASE}/habits/lifestyle`, name: 'Lifestyle' },
  { path: `${BASE}/habits/study`, name: 'Study' },
  { path: `${BASE}/habits/diet`, name: 'Diet' },
  { path: `${BASE}/habits/workout`, name: 'Workout' },
  { path: `${BASE}/habits/sleep`, name: 'Sleep' },
  { path: `${BASE}/habits/supplements`, name: 'Supplements' },
  { path: `${BASE}/environment`, name: 'Environment' },
  { path: `${BASE}/results`, name: 'Results' },
];

describe('MobileNavigation', () => {
  beforeEach(() => {
    // Mobile viewport – MobileNavigation is only rendered on small screens
    cy.viewport(390, 844);
  });

  // ─── Next button: appearance ──────────────────────────────────────────────

  describe('Next button appearance (lines 246-253)', () => {
    it('is visible on about-project', () => {
      cy.visit(`${BASE}/about-project`);
      cy.get('[data-cy="mobile-next-button"]').should('be.visible');
    });

    it('shows the "Next:" prefix text', () => {
      cy.visit(`${BASE}/about-project`);
      cy.get('[data-cy="mobile-next-button"]').should('contain.text', 'Next:');
    });

    it('shows "Lifestyle" as the next page from about-project', () => {
      cy.visit(`${BASE}/about-project`);
      cy.get('[data-cy="mobile-next-button"]').should(
        'contain.text',
        'Lifestyle',
      );
    });

    it('shows "About Project" as the next page from results (wrap-around)', () => {
      cy.visit(`${BASE}/results`);
      cy.get('[data-cy="mobile-next-button"]').should(
        'contain.text',
        'About Project',
      );
    });
  });

  // ─── getNextNavItem: full navigation order (lines 130-145) ────────────────

  describe('getNextNavItem navigation order (lines 130-145)', () => {
    NAV_ORDER.forEach((current, idx) => {
      const next = NAV_ORDER[(idx + 1) % NAV_ORDER.length];

      it(`${current.name} → next button shows "${next.name}"`, () => {
        cy.visit(current.path);
        cy.get('[data-cy="mobile-next-button"]').should(
          'contain.text',
          next.name,
        );
      });
    });
  });

  // ─── Next button: click navigates to correct URL ──────────────────────────

  describe('Next button click navigation (lines 246-253)', () => {
    it('navigates from about-project to lifestyle on click', () => {
      cy.visit(`${BASE}/about-project`);
      cy.get('[data-cy="mobile-next-button"]').click();
      cy.url({ timeout: 10000 }).should('include', '/habits/lifestyle');
    });

    it('navigates from lifestyle to study on click', () => {
      cy.visit(`${BASE}/habits/lifestyle`);
      cy.get('[data-cy="mobile-next-button"]').click();
      cy.url({ timeout: 10000 }).should('include', '/habits/study');
    });

    it('navigates from study to diet on click', () => {
      cy.visit(`${BASE}/habits/study`);
      cy.get('[data-cy="mobile-next-button"]').click();
      cy.url({ timeout: 10000 }).should('include', '/habits/diet');
    });

    it('navigates from diet to workout on click', () => {
      cy.visit(`${BASE}/habits/diet`);
      cy.get('[data-cy="mobile-next-button"]').click();
      cy.url({ timeout: 10000 }).should('include', '/habits/workout');
    });

    it('navigates from workout to sleep on click', () => {
      cy.visit(`${BASE}/habits/workout`);
      cy.get('[data-cy="mobile-next-button"]').click();
      cy.url({ timeout: 10000 }).should('include', '/habits/sleep');
    });

    it('navigates from sleep to supplements on click', () => {
      cy.visit(`${BASE}/habits/sleep`);
      cy.get('[data-cy="mobile-next-button"]').click();
      cy.url({ timeout: 10000 }).should('include', '/habits/supplements');
    });

    it('navigates from supplements to environment on click', () => {
      cy.visit(`${BASE}/habits/supplements`);
      cy.get('[data-cy="mobile-next-button"]').click();
      cy.url({ timeout: 10000 }).should('include', '/environment');
    });

    it('navigates from environment to results on click', () => {
      cy.visit(`${BASE}/environment`);
      cy.get('[data-cy="mobile-next-button"]').click();
      cy.url({ timeout: 10000 }).should('include', '/results');
    });

    it('wraps from results back to about-project on click', () => {
      cy.visit(`${BASE}/results`);
      cy.get('[data-cy="mobile-next-button"]').click();
      cy.url({ timeout: 10000 }).should('include', '/about-project');
    });
  });

  // ─── Nav dropdown + Habits sub-menu flow ─────────────────────────────────

  describe('Nav dropdown → Habits sub-menu → Lifestyle route', () => {
    it('opens the nav, expands Habits, clicks Lifestyle and lands on the correct route', () => {
      cy.visit(`${BASE}/about-project`);

      // 1. Click the active-page toggle to open the nav dropdown
      cy.get('[data-cy="mobile-nav-toggle"]').click();

      // Nav list should now be open (contains the Habits item)
      cy.get('[data-cy="mobile-habits-toggle"]').should('be.visible');

      // 2. Click the Habits item to expand its sub-menu
      cy.get('[data-cy="mobile-habits-toggle"]').click();

      // Sub-nav dropdown should now be visible with all habit pages
      cy.get('[data-cy="mobile-subnav"]').should('be.visible');

      // 3. Click the first sub-nav item (Lifestyle)
      cy.get('[data-cy="mobile-subnav"]').find('a').first().click();

      // 4. URL should change to the Lifestyle page
      cy.url({ timeout: 10000 }).should(
        'include',
        '/tools/longevity-protocol/habits/lifestyle',
      );
    });
  });
});

export {};
