// Import custom commands
import './commands';
import 'cypress-real-events';

// Suppress Next.js route cancellation errors (thrown during rapid navigation)
Cypress.on('uncaught:exception', err => {
  if (err.message.includes('Cancel rendering route')) {
    return false;
  }
});
