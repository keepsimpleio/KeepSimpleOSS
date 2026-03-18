// ACTIVITY_LEVELS (from src/constants/longevity.ts):
// index 0 → Novice  : totalMinutesPerWeek=240, minutesPerSession=65
// index 4 → Elite   : totalMinutesPerWeek=90,  minutesPerSession=30
//
// STOPS (WeeklyWorkout): [0, 75, 150, 225, 300]
// BRAIN_AGE_TABLE baselines: [20, 32, 45, 55, 67, 78, 90]
//   index 1 (default) → baseline=32: active=29, sedentary=37
//   index 2           → baseline=45: active=40, sedentary=53

const PAGE = '/tools/longevity-protocol/habits/workout';

describe('Workout – /tools/longevity-protocol/habits/workout', () => {
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

    // 5. WeeklyWorkout – ProgressBar fill & thumb exist; interacting with the bar
    //    changes the active image and the summary content
    it('WeeklyWorkout: ProgressBar fill and thumb exist; dragging bar changes active image and summary', () => {
      cy.get('[data-cy="weekly-workout"]').scrollIntoView();

      // ProgressBar fill and thumb are rendered
      cy.get('[data-cy="weekly-workout"]').within(() => {
        cy.get('[data-cy="progress-bar-fill"]')
          .should('exist')
          .and('have.attr', 'style');
        cy.get('[data-cy="progress-bar-thumb"]').should('exist');
      });

      // Initial state: image 0 is active
      cy.get('[data-cy="weekly-workout-image"][data-active="true"]').should(
        'have.attr',
        'data-id',
        '0',
      );

      // Capture initial summary risk value
      cy.get('[data-cy="weekly-workout-summary"]')
        .invoke('attr', 'data-risk')
        .then(initialRisk => {
          // Click the right end of the ProgressBar → jumps to last stop (index 4, 300 min)
          cy.get('[data-cy="weekly-workout"]').within(() => {
            cy.get('[data-cy="progress-bar-container"]').click('right');
          });

          cy.wait(300);

          // Image at index 4 should now be active
          cy.get('[data-cy="weekly-workout-image"][data-active="true"]').should(
            'have.attr',
            'data-id',
            '4',
          );

          // Summary content (risk value) should have changed
          cy.get('[data-cy="weekly-workout-summary"]')
            .invoke('attr', 'data-risk')
            .should('not.equal', initialRisk);
        });
    });

    // 6. BrainAgeActivity – clicking the second age button makes it active;
    //    passive (sedentary) and active brain-age values update accordingly
    it('BrainAgeActivity: clicking second age button activates it and updates passive/active content', () => {
      cy.get('[data-cy="brain-age-activity"]').scrollIntoView();
      cy.wait(300);

      // First, click the third button (baseline=45) to move away from the default (baseline=32)
      cy.get('[data-cy="age-button"][data-baseline="45"]')
        .scrollIntoView()
        .click();
      cy.get('[data-cy="age-button"][data-baseline="45"]').should(
        'have.attr',
        'data-active',
        'true',
      );

      // Capture current result values (baseline=45 → sedentary=53, active=40)
      cy.get('[data-cy="brain-age-result"]')
        .invoke('attr', 'data-sedentary')
        .then(sedentaryBefore => {
          // Click the second button (baseline=32)
          cy.get('[data-cy="age-button"][data-baseline="32"]')
            .scrollIntoView()
            .click();

          // Second button (baseline=32) becomes active, third (baseline=45) becomes inactive
          cy.get('[data-cy="age-button"][data-baseline="32"]').should(
            'have.attr',
            'data-active',
            'true',
          );
          cy.get('[data-cy="age-button"][data-baseline="45"]').should(
            'have.attr',
            'data-active',
            'false',
          );

          // Result data attributes reflect baseline=32 (sedentary=37, active=29)
          cy.get('[data-cy="brain-age-result"]')
            .should('have.attr', 'data-sedentary', '37')
            .and('have.attr', 'data-active-age', '29');

          // Values are different from baseline=45 (which had sedentary=53)
          cy.get('[data-cy="brain-age-result"]')
            .invoke('attr', 'data-sedentary')
            .should('not.equal', sedentaryBefore);
        });
    });

    // 7. StrengthAndTimeCompression – clicking the progress bar to +1 stop
    //    updates totalMins and minutesPerSession (quantity)
    it('StrengthAndTimeCompression: advancing progress bar changes totalMins and per-session quantity', () => {
      cy.get('[data-cy="strength-section"]').scrollIntoView();

      // Initial state: Novice (index 0) → totalMinutesPerWeek=240, minutesPerSession=65
      cy.get('[data-cy="strength-total-mins"]').should('contain', '240');
      cy.get('[data-cy="strength-per-session-qty"]').should(
        'have.attr',
        'data-value',
        '65',
      );

      // Click the right end of the ProgressBar → Elite (index 4)
      //   totalMinutesPerWeek=90, minutesPerSession=30
      cy.get('[data-cy="strength-section"]').within(() => {
        cy.get('[data-cy="progress-bar-container"]').click('right');
      });

      cy.wait(300);

      // totalMins should now show 90
      cy.get('[data-cy="strength-total-mins"]').should('contain', '90');

      // Per-session quantity data-value should now be 30
      cy.get('[data-cy="strength-per-session-qty"]').should(
        'have.attr',
        'data-value',
        '30',
      );
    });
  });
});

export {};
