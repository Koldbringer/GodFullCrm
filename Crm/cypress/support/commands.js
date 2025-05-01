// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

// Import Testing Library commands
import '@testing-library/cypress/add-commands';
// Import drag and drop plugin
import '@4tw/cypress-drag-drop';

// Custom command for logging in
Cypress.Commands.add('login', (email = 'test@test.pl', password = 'blaeritipol') => {
  cy.visit('/login');
  cy.findByLabelText(/email/i).type(email);
  cy.findByLabelText(/password/i).type(password);
  cy.findByRole('button', { name: /sign in/i }).click();
  cy.url().should('match', /\/dashboard|\/$/);
});

// Custom command for drag and drop (for kanban board)
Cypress.Commands.add('dragAndDrop', (subject, target) => {
  cy.wrap(subject).trigger('mousedown', { which: 1 });
  cy.wrap(target).trigger('mousemove').trigger('mouseup', { force: true });
});
