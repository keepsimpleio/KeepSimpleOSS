// Keeping this for the future when we want to implement cross-browser testing
//
// const viewports = [
//   { name: 'Desktop', width: 1920, height: 920 },
//   { name: 'Mobile', width: 375, height: 667 },
// ];
//
// const browsers = ['chrome', 'firefox', 'edge'];
//
// beforeEach(() => {
//   cy.on('uncaught:exception', err => {
//     cy.log(`Uncaught exception: ${err.message}`);
//     return false;
//   });
// });
//
// describe('Route Tests Across Browsers', () => {
//   browsers.forEach(browser => {
//     describe(`Cross-browser tests in ${browser}`, () => {
//       routesToCheck.forEach(route => {
//         describe(`Testing route: ${route}`, () => {
//           viewports.forEach(vp => {
//             it(`should load the route ${route} on ${vp.name} in ${browser}`, () => {
//               Cypress.browser.name = browser;
//
//               cy.viewport(vp.width, vp.height);
//               cy.visit(route);
//               cy.url().should('include', route);
//               cy.visit(route, { timeout: 20000 });
//               cy.get('section').should('exist');
//             });
//           });
//         });
//       });
//     });
//   });
// });
