/// <reference types="cypress" />
import { mount } from 'cypress/react';

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to check all external links on the page.
       * @param excludedDomains Array of domain strings to skip
       * @param selector CSS selector for links (defaults to 'a')
       */
      checkExternalLinks(
        excludedDomains?: string[],
        selector?: string,
      ): Chainable<void>;

      checkH1(expectedText: string): Chainable<void>;

      scrollToSection(sectionText: string): Chainable<void>;

      validateAllImages(): Chainable<void>;

      uxcgTestSearchBehavior(
        validWord: string,
        invalidWord: string,
      ): Chainable<void>;

      checkSocialMediaLink(title: string, domain: string): Chainable<void>;

      showCopiedTooltip(): Chainable<void>;

      clickArrowWhenReady(
        direction: 'next' | 'prev',
        expectedUrlPart: string,
      ): Chainable<void>;

      showMoreAndLess(): Chainable<void>;

      uxcoreSearchBehavior: (
        validWord: string,
        invalidWord: string,
      ) => Chainable<void>;

      playAudio(): Chainable<void>;

      checkPyramidChange(
        bluePyramidId: string,
        orangePyramidId: string,
        purplePyramidId: string,
      ): Chainable<void>;

      checkSwiperSlide(prevUrl, nextUrl): Chainable<void>;

      uxcpSearchBehavior(
        validWord: string,
        invalidWord: string,
      ): Chainable<void>;

      uxcpAddBiases: () => Chainable<void>;
      checkAllLinks: (routes) => Chainable<void>;
      openLoginModalByButtonClick: (buttonLabel: string) => Chainable<void>;
      loginBySession: () => Chainable<void>;
    }
  }
}
