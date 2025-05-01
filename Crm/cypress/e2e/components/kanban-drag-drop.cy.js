describe('Kanban Drag and Drop', () => {
  beforeEach(() => {
    // Login before each test
    cy.visit('/login');
    cy.findByLabelText(/email/i).type('test@test.pl');
    cy.findByLabelText(/password/i).type('blaeritipol');
    cy.findByRole('button', { name: /sign in/i }).click();
    
    // Navigate to service orders page
    cy.visit('/service-orders');
  });

  it('should drag a card from New to In Progress', () => {
    // Wait for the kanban board to load
    cy.get('.kanban-board').should('be.visible');
    
    // Get the first card in the "New" column
    cy.get('.kanban-column:contains("Nowe") .service-order-card').first().as('newCard');
    
    // Get the "In Progress" column
    cy.get('.kanban-column:contains("W trakcie")').as('inProgressColumn');
    
    // Get the card ID before dragging
    cy.get('@newCard').invoke('attr', 'data-id').then((cardId) => {
      // Perform drag and drop
      cy.get('@newCard').drag('@inProgressColumn');
      
      // Wait for the backend to update
      cy.wait(1000);
      
      // Verify the card is now in the "In Progress" column
      cy.get(`.kanban-column:contains("W trakcie") .service-order-card[data-id="${cardId}"]`).should('be.visible');
    });
  });

  it('should drag a card from In Progress to Completed', () => {
    // Wait for the kanban board to load
    cy.get('.kanban-board').should('be.visible');
    
    // Get the first card in the "In Progress" column
    cy.get('.kanban-column:contains("W trakcie") .service-order-card').first().as('inProgressCard');
    
    // Get the "Completed" column
    cy.get('.kanban-column:contains("Zakończone")').as('completedColumn');
    
    // Get the card ID before dragging
    cy.get('@inProgressCard').invoke('attr', 'data-id').then((cardId) => {
      // Perform drag and drop
      cy.get('@inProgressCard').drag('@completedColumn');
      
      // Wait for the backend to update
      cy.wait(1000);
      
      // Verify the card is now in the "Completed" column
      cy.get(`.kanban-column:contains("Zakończone") .service-order-card[data-id="${cardId}"]`).should('be.visible');
    });
  });
});
