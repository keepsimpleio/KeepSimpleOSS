// Import custom commands
import './commands';

// Suppress Next.js route cancellation errors (thrown during rapid navigation)
Cypress.on('uncaught:exception', err => {
  if (err.message.includes('Cancel rendering route')) {
    return false;
  }
});
