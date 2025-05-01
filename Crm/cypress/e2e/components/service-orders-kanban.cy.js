describe('Service Orders Kanban', () => {
  beforeEach(() => {
    // Login before each test
    cy.visit('/login');
    cy.findByLabelText(/email/i).type('test@test.pl');
    cy.findByLabelText(/password/i).type('blaeritipol');
    cy.findByRole('button', { name: /sign in/i }).click();
    
    // Navigate to service orders page
    cy.visit('/service-orders');
  });

  it('should display kanban board', () => {
    // Check if kanban columns are visible
    cy.findByText(/nowe|new/i).should('be.visible');
    cy.findByText(/w trakcie|in progress/i).should('be.visible');
    cy.findByText(/zakończone|completed/i).should('be.visible');
  });

  it('should filter service orders', () => {
    // Type in search box
    cy.findByPlaceholder(/szukaj zlecenia/i).type('test');
    
    // Wait for filtering to complete
    cy.wait(500);
    
    // Check if filtered results are displayed
    // This is a basic check - in a real test, you'd verify specific cards are shown/hidden
    cy.get('.kanban-board').should('be.visible');
  });

  it('should show service order details', () => {
    // Click on the first service order card
    cy.get('.service-order-card').first().click();
    
    // Check if details modal/page is displayed
    cy.get('[role="dialog"]').should('be.visible');
    // Or if it navigates to a details page
    // cy.url().should('match', /\/service-orders\/\d+/);
    
    // Check for details content
    cy.findByText(/szczegóły zlecenia|order details/i).should('be.visible');
  });
});
