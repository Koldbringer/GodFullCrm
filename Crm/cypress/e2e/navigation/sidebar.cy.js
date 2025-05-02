describe('Navigation', () => {
  beforeEach(() => {
    // Login before each test
    cy.visit('/login');
    cy.findByLabelText(/email/i).type('test@test.pl');
    cy.findByLabelText(/password/i).type('blaeritipol');
    cy.findByRole('button', { name: /sign in/i }).click();
    
    // Wait for navigation to complete
    cy.url().should('match', /\/dashboard|\/$/);
  });

  it('should navigate to dashboard', () => {
    // Click on dashboard link in sidebar
    cy.findByRole('link', { name: /dashboard/i }).click();
    
    // Check if URL contains dashboard
    cy.url().should('match', /\/dashboard|\/$/);
    
    // Check if dashboard title is visible
    cy.findByRole('heading', { name: /dashboard/i }).should('be.visible');
  });

  it('should navigate to customers page', () => {
    // Click on customers link in sidebar
    cy.findByRole('link', { name: /klienci|customers/i }).click();
    
    // Check if URL contains customers
    cy.url().should('include', '/customers');
    
    // Check if customers title is visible
    cy.findByRole('heading', { name: /klienci|customers/i }).should('be.visible');
  });

  it('should navigate to service orders page', () => {
    // Click on service orders link in sidebar
    cy.findByRole('link', { name: /zlecenia|service orders/i }).click();
    
    // Check if URL contains service-orders
    cy.url().should('include', '/service-orders');
    
    // Check if service orders title is visible
    cy.findByRole('heading', { name: /zlecenia|service orders/i }).should('be.visible');
  });
});
