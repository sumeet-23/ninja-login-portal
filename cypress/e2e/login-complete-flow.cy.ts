describe('Complete Login Flow Integration', () => {
  beforeEach(() => {
    cy.visit('/login')
    cy.clearStorage()
  })

  describe('End-to-End Login Flow', () => {
    it('should complete full login flow with valid credentials', () => {
      // Mock successful API response
      cy.mockLoginApi('success')
      
      // Fill form with valid credentials
      cy.get('#username').type('NC23550')
      cy.get('#password').type('123Ninja@')
      cy.get('#remember').check()
      
      // Verify form is valid and submit button is enabled
      cy.get('button[type="submit"]').should('not.be.disabled')
      
      // Submit form
      cy.get('button[type="submit"]').click()
      
      // Verify loading state
      cy.get('button[type="submit"]').should('contain.text', 'Logging in...')
      cy.get('button[type="submit"] svg').should('have.class', 'animate-spin')
      
      // Wait for API call
      cy.wait('@loginSuccess')
      
      // Verify success message
      cy.get('[role="alert"]')
        .should('be.visible')
        .and('contain.text', 'Login successful! Redirecting...')
        .and('have.class', 'text-primary')
      
      // Verify username is remembered
      cy.window().then((win) => {
        expect(win.localStorage.getItem('rememberedUser')).to.equal('NC23550')
      })
      
      // Verify API call details
      cy.get('@loginSuccess').then((interception) => {
        expect(interception.request.body).to.deep.equal({
          userName: 'NC23550',
          password: '123Ninja@'
        })
        expect(interception.request.headers).to.have.property('Application', 'biFrost')
        expect(interception.request.headers).to.have.property('Authorization', 'Basic')
      })
    })

    it('should handle login flow with validation errors', () => {
      // Try to submit with invalid data
      cy.get('#username').type('ab')
      cy.get('#password').type('123')
      cy.get('button[type="submit"]').click()
      
      // Verify validation errors
      cy.get('#username-error').should('be.visible')
      cy.get('#password-error').should('be.visible')
      cy.get('[role="alert"]').should('contain.text', 'Please fix the errors below')
      
      // Fix validation errors
      cy.get('#username').clear().type('user123')
      cy.get('#password').clear().type('password123')
      
      // Verify errors are cleared
      cy.get('#username-error').should('not.exist')
      cy.get('#password-error').should('not.exist')
      
      // Now submit with valid data
      cy.mockLoginApi('success')
      cy.get('button[type="submit"]').click()
      cy.wait('@loginSuccess')
      cy.get('[role="alert"]').should('contain.text', 'Login successful! Redirecting...')
    })

    it('should handle login flow with API error and retry', () => {
      // First attempt - API error
      cy.mockLoginApi('error')
      cy.get('#username').type('wronguser')
      cy.get('#password').type('wrongpassword')
      cy.get('button[type="submit"]').click()
      
      cy.wait('@loginError')
      cy.get('[role="alert"]').should('contain.text', 'Invalid username or password')
      
      // Retry with correct credentials
      cy.mockLoginApi('success')
      cy.get('#username').clear().type('NC23550')
      cy.get('#password').clear().type('123Ninja@')
      cy.get('button[type="submit"]').click()
      
      cy.wait('@loginSuccess')
      cy.get('[role="alert"]').should('contain.text', 'Login successful! Redirecting...')
    })
  })

  describe('Cross-Browser Compatibility', () => {
    it('should work with different viewport sizes', () => {
      // Test mobile viewport
      cy.viewport(375, 667)
      cy.get('#username').should('be.visible')
      cy.get('#password').should('be.visible')
      cy.get('button[type="submit"]').should('be.visible')
      
      // Test tablet viewport
      cy.viewport(768, 1024)
      cy.get('#username').should('be.visible')
      cy.get('#password').should('be.visible')
      cy.get('button[type="submit"]').should('be.visible')
      
      // Test desktop viewport
      cy.viewport(1280, 720)
      cy.get('#username').should('be.visible')
      cy.get('#password').should('be.visible')
      cy.get('button[type="submit"]').should('be.visible')
    })
  })

  describe('Performance and Timing', () => {
    it('should handle slow API responses gracefully', () => {
      cy.intercept('POST', 'http://direct.ninjacart.in:8080/user/login', {
        delay: 5000,
        statusCode: 200,
        body: { success: true, message: 'Login successful' }
      }).as('slowLogin')
      
      cy.get('#username').type('NC23550')
      cy.get('#password').type('123Ninja@')
      cy.get('button[type="submit"]').click()
      
      // Verify loading state persists during slow response
      cy.get('button[type="submit"]').should('contain.text', 'Logging in...')
      cy.get('button[type="submit"]').should('be.disabled')
      
      cy.wait('@slowLogin')
      cy.get('[role="alert"]').should('contain.text', 'Login successful! Redirecting...')
    })

    it('should handle rapid form submissions', () => {
      cy.mockLoginApi('success')
      
      cy.get('#username').type('NC23550')
      cy.get('#password').type('123Ninja@')
      
      // Rapid clicks should not cause multiple API calls
      cy.get('button[type="submit"]').click()
      cy.get('button[type="submit"]').click()
      cy.get('button[type="submit"]').click()
      
      // Should only make one API call
      cy.wait('@loginSuccess')
      cy.get('@loginSuccess.all').should('have.length', 1)
    })
  })

  describe('Accessibility and UX', () => {
    it('should be keyboard navigable', () => {
      // Tab through form elements
      cy.get('body').tab()
      cy.focused().should('have.attr', 'id', 'username')
      
      cy.focused().tab()
      cy.focused().should('have.attr', 'id', 'password')
      
      cy.focused().tab()
      cy.focused().should('have.attr', 'id', 'remember')
      
      cy.focused().tab()
      cy.focused().should('have.attr', 'type', 'submit')
    })

    it('should have proper focus management', () => {
      cy.get('#username').focus()
      cy.get('#username').should('have.focus')
      
      cy.get('#password').focus()
      cy.get('#password').should('have.focus')
      
      cy.get('button[type="submit"]').focus()
      cy.get('button[type="submit"]').should('have.focus')
    })

    it('should announce errors to screen readers', () => {
      cy.get('#username').type('invalid').blur()
      cy.get('#username-error').should('be.visible')
      cy.get('#username').should('have.attr', 'aria-describedby', 'username-error')
    })
  })
})
