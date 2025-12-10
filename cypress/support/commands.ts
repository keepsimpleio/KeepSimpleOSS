// 1. Check all external links on the page
Cypress.Commands.add('checkExternalLinks', (excludedDomains = []) => {
  cy.get('a').each($link => {
    const href = $link.prop('href');

    const isExternal =
      href &&
      href.startsWith('http') &&
      !href.includes('localhost') &&
      !excludedDomains.some(domain => href.includes(domain));

    if (isExternal) {
      // URL format validation
      expect(href).to.match(
        /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w\- ./?%&=]*)?$/,
      );

      // Request to validate link is reachable
      cy.request({
        url: href,
        failOnStatusCode: false,
      }).then(response => {
        expect(response.status).to.be.oneOf([200, 301, 302, 403]);
      });
    }
  });
});

// 2. VERY REUSABLE - Check if the H1 element contains the expected text
Cypress.Commands.add('checkH1', expectedText => {
  cy.get('h1').should('have.text', expectedText);
});

// 3. Scroll to a specific section by clicking a button and checking scroll position
Cypress.Commands.add('scrollToSection', sectionText => {
  cy.get('button').contains('Project Management').click();
  cy.window().then(win => {
    expect(win.scrollY).to.be.greaterThan(100);
  });
});

// 4. Validate Images
Cypress.Commands.add('validateAllImages', () => {
  cy.get('img').each($img => {
    const imgSrc = $img.attr('src');

    if (imgSrc) {
      cy.request({
        url: imgSrc,
        failOnStatusCode: false,
      }).then(response => {
        expect(response.status).to.be.oneOf([200, 301, 302]);
      });
    }
  });
});

// 5. UXCG Search Field
Cypress.Commands.add(
  'uxcgTestSearchBehavior',
  (validWord: string, invalidWord: string) => {
    cy.get('[data-cy="Search Input"]').type(validWord);
    cy.wait(500);
    cy.get('[data-cy="open-question"]').should('be.visible');
    cy.get('[data-cy="No Results Found"]').should('not.exist');

    cy.get('[data-cy="Search Input"]').clear().type(invalidWord);
    cy.wait(500);
    cy.get('[data-cy="open-question"]').should('not.exist');
    cy.get('[data-cy="No Results Found"]').should('be.visible');
  },
);

// 6. UXCP Search Field
Cypress.Commands.add(
  'uxcpSearchBehavior',
  (validWord: string, invalidWord: string) => {
    cy.get('[data-cy="input-field"]').eq(1).type(validWord);

    cy.wait(500);

    cy.get('[data-cy="uxcp-bias-action-cell"]').should('be.visible');
    cy.get('[data-cy="input-field"]').eq(1).type(invalidWord);

    cy.wait(500);
    cy.get('[data-cy="uxcp-bias-action-cell"]').should('not.exist');
  },
);

// 7.Check Social Media Links
Cypress.Commands.add(
  'checkSocialMediaLink',
  (title: string, domain: string) => {
    cy.get(`a[title="${title}"]`)
      .should('have.attr', 'href')
      .and('include', domain)
      .and('match', /^https?:\/\//)
      .and('not.include', 'undefined');

    cy.get(`a[title="${title}"]`).should('have.attr', 'target', '_blank');
  },
);

// 8.  Shows tooltip Copy and Copied
Cypress.Commands.add('showCopiedTooltip', () => {
  cy.get('[data-cy="copy-container"]').click();
  cy.get('[data-cy="copy-tooltip"]').should('contain', 'Copied!');
  cy.wait(2500);

  cy.get('[data-cy="copy-tooltip"]').should('not.have.class', 'visible');
});

// 9. Clicks the arrow and checks if the URL contains the expected part
Cypress.Commands.add(
  'clickArrowWhenReady',
  (direction: 'next' | 'prev', expectedUrlPart: string) => {
    const selector = `[data-cy="arrow-${direction}"]`;

    cy.get(selector)
      .invoke('attr', 'class')
      .should('not.include', 'Disabled')
      .then(() => {
        cy.get(selector).click();
      });

    if (expectedUrlPart) {
      cy.url({ timeout: 10000 }).should('include', expectedUrlPart);
    }
  },
);

// 10. UX Core Search Behavior
Cypress.Commands.add(
  'uxcoreSearchBehavior',
  (validWord: string, invalidWord) => {
    cy.get('[data-cy="uxcore-search-input"]')
      .clear()
      .type(validWord, { delay: 100 });

    cy.get('[data-cy="search-result-item"][data-state="hovered"]', {
      timeout: 5000,
    }).should('exist');
  },
);

// 11. Show more and less button (UX Core)
Cypress.Commands.add('showMoreAndLess', () => {
  cy.get('[data-cy="show-more-button"]').should('be.visible').click();

  cy.wait(500);

  cy.get('[data-cy="show-less-button"]').should('be.visible').click();
});

// 12. Play Audio
Cypress.Commands.add('playAudio', () => {
  cy.get('[data-cy="pyramid-play-icon"]').click({ force: true });
  cy.get('[data-cy="audio-player"]')
    .invoke('attr', 'class')
    .should('contain', 'playing');
  cy.get('[data-cy="pause-icon"]').click({ force: true });
  cy.wait(500);

  cy.get('[data-cy="audio-player"]')
    .invoke('attr', 'class')
    .should('contain', 'paused');
});

// 13. Check Pyramid Change
Cypress.Commands.add(
  'checkPyramidChange',
  (bluePyramidId: string, orangePyramidId: string, purplePyramidId: string) => {
    cy.get(`[data-id="${bluePyramidId}"]`).click();
    cy.get('[data-cy="orange-pyramid"]', { timeout: 4000 }).should(
      'be.visible',
    );

    cy.get(`[data-id="${orangePyramidId}"]`).click();
    cy.get('[data-cy="purple-pyramid"]', { timeout: 4000 }).should(
      'be.visible',
    );

    cy.get(`[data-id="${purplePyramidId}"]`).click();
    cy.get('[data-cy="blue-pyramid"]', { timeout: 4000 }).should('be.visible');
  },
);

// 14. Checks swiper slide
Cypress.Commands.add('checkSwiperSlide', (prevUrl: string, nextUrl: string) => {
  cy.get('[data-cy="slide-move-right"]').first().click({ force: true });
  cy.wait(1000);
  cy.url().should('include', nextUrl);

  cy.get('[data-cy="slide-move-left"]').eq(1).click({ force: true });
  cy.wait(1000);
  cy.url().should('include', prevUrl);
});

// 15. UXCP Adding BIases
Cypress.Commands.add('uxcpAddBiases', () => {
  cy.get('[data-cy="add-bias"]').first().click();
  cy.get('[data-cy="added-bias-item"]').first().should('be.visible');
  cy.wait(1000);

  cy.get('[data-cy="add-bias"]').eq(1).click();
  cy.get('[data-cy="added-bias-item"]').eq(1).should('be.visible');
  cy.wait(1000);

  cy.get('[data-cy="add-bias"]').eq(2).click();
  cy.get('[data-cy="added-bias-item"]').eq(2).should('be.visible');

  cy.get('[data-cy="remove-bias"]').eq(2).click();
  cy.get('[data-cy="added-bias-item"]').eq(2).should('not.be.visible');
});

// 16. Check all links on the page
Cypress.Commands.add('checkAllLinks', (routes: []) => {
  routes.forEach(route => {
    cy.visit(route);

    cy.get('a').each($a => {
      const message = $a.text();
      const href = $a.prop('href');

      expect($a, message)
        .to.have.attr('href')
        .and.not.match(/undefined|null|^$/);

      if (
        href &&
        href.startsWith('http') &&
        !href.includes('http//localhost:3005') &&
        !href.includes('linkedin.com') &&
        !href.includes('facebook.com')
      ) {
        cy.request({
          url: href,
          failOnStatusCode: false,
        }).then(response => {
          cy.log(
            `Checking external link: ${href} - Status: ${response.status}`,
          );
          expect(response.status).to.be.oneOf([200, 301, 302, 403]);
        });
      }
    });
  });
});
