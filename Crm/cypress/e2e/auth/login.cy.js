describe('Authentication', () => {
  it('should show login form', () => {
    cy.visit('/login');
    
    // Check if login form elements are present
    cy.findByRole('heading', { name: /login/i }).should('be.visible');
    cy.findByLabelText(/email/i).should('be.visible');
    cy.findByLabelText(/password/i).should('be.visible');
    cy.findByRole('button', { name: /sign in/i }).should('be.visible');
  });

  it('should show error with invalid credentials', () => {
    cy.visit('/login');
    
    // Fill in invalid credentials
    cy.findByLabelText(/email/i).type('invalid@example.com');
    cy.findByLabelText(/password/i).type('wrongpassword');
    
    // Submit the form
    cy.findByRole('button', { name: /sign in/i }).click();
    
    // Check for error message
    cy.findByText(/invalid email or password/i).should('be.visible');
  });

  it('should login with valid credentials', () => {
    cy.visit('/login');
    
    // Fill in valid credentials (use test account)
    cy.findByLabelText(/email/i).type('test@test.pl');
    cy.findByLabelText(/password/i).type('blaeritipol');
    
    // Submit the form
    cy.findByRole('button', { name: /sign in/i }).click();
    
    // Check if redirected to dashboard
    cy.url().should('match', /\/dashboard|\/$/);
    
    // Check if user is logged in (e.g., user menu is visible)
    cy.findByRole('button', { name: /user menu/i }).should('be.visible');
  });
});
