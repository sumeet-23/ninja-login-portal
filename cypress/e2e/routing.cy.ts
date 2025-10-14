describe('Routing Tests', () => {
  beforeEach(() => {
    cy.clearStorage()
  })

  describe('Route Navigation', () => {
    it('should redirect root path to /login', () => {
      cy.visit('/')
      cy.url().should('include', '/login')
    })

    it('should load login page directly at /login', () => {
      cy.visit('/login')
      cy.url().should('include', '/login')
      cy.get('#username').should('be.visible')
      cy.get('#password').should('be.visible')
      cy.get('button[type="submit"]').should('be.visible')
    })

    it('should show 404 page for unknown routes', () => {
      cy.visit('/unknown-route')
      cy.url().should('include', '/unknown-route')
      // Assuming NotFound component shows some 404 content
      cy.get('body').should('contain.text', '404').or('contain.text', 'Not Found')
    })

    it('should maintain login page state on refresh', () => {
      cy.visit('/login')
      cy.get('#username').type('testuser')
      cy.get('#password').type('testpass')
      
      cy.reload()
      cy.url().should('include', '/login')
      cy.get('#username').should('have.value', '')
      cy.get('#password').should('have.value', '')
    })
  })

  describe('Browser Navigation', () => {
    it('should handle back button navigation', () => {
      cy.visit('/login')
      cy.url().should('include', '/login')
      
      // Navigate to a different page (simulate)
      cy.visit('/unknown-route')
      cy.url().should('include', '/unknown-route')
      
      // Go back to login
      cy.go('back')
      cy.url().should('include', '/login')
    })

    it('should handle forward button navigation', () => {
      cy.visit('/login')
      cy.visit('/unknown-route')
      
      cy.go('back')
      cy.url().should('include', '/login')
      
      cy.go('forward')
      cy.url().should('include', '/unknown-route')
    })
  })
})
