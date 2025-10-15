describe('Login Form Validation', () => {
  // Note: Tests use htmlFor attributes (#username, #password, #remember) instead of text content
  // This ensures tests remain stable even if UI labels change (e.g., "Username" → "Employee ID")
  beforeEach(() => {
    cy.visit('/login')
    cy.clearStorage()
  })

  describe('Username Field Validation', () => {
    it('should show error for empty username', () => {
      cy.get('#username').focus().blur()
      cy.get('#username-error')
        .should('be.visible')
        .and('contain.text', 'Employee ID is required')
    })

    it('should show error for employee ID with special characters', () => {
      cy.get('#username').type('user@123')
      cy.get('#username').blur()
      cy.get('#username-error')
        .should('be.visible')
        .and('contain.text', 'Username must contain only letters and numbers')
    })

    it('should show error for employee ID with spaces', () => {
      cy.get('#username').type('user name')
      cy.get('#username').blur()
      cy.get('#username-error')
        .should('be.visible')
        .and('contain.text', 'Username must contain only letters and numbers')
    })

    it('should show error for employee ID less than 3 characters (without NC)', () => {
      cy.get('#username').type('ab')
      cy.get('#username').blur()
      cy.get('#username-error')
        .should('be.visible')
        .and('contain.text', 'Username must be at least 3 characters long')
    })

    it('should show error for NC employee ID less than 5 characters', () => {
      cy.get('#username').type('NCab')
      cy.get('#username').blur()
      cy.get('#username-error')
        .should('be.visible')
        .and('contain.text', 'Username must be at least 5 characters long (NC + 3 characters)')
    })

    it('should accept valid employee ID without NC prefix', () => {
      cy.get('#username').type('user123')
      cy.get('#username').blur()
      cy.get('#username-error').should('not.exist')
    })

    it('should accept valid employee ID with NC prefix', () => {
      cy.get('#username').type('NCuser123')
      cy.get('#username').blur()
      cy.get('#username-error').should('not.exist')
    })

    it('should accept employee ID with only letters (without NC)', () => {
      cy.get('#username').type('username')
      cy.get('#username').blur()
      cy.get('#username-error').should('not.exist')
    })

    it('should accept employee ID with only numbers (without NC)', () => {
      cy.get('#username').type('123456')
      cy.get('#username').blur()
      cy.get('#username-error').should('not.exist')
    })

    it('should accept mixed case employee ID (without NC)', () => {
      cy.get('#username').type('User123')
      cy.get('#username').blur()
      cy.get('#username-error').should('not.exist')
    })

    it('should accept NC employee ID with mixed case', () => {
      cy.get('#username').type('NCUser123')
      cy.get('#username').blur()
      cy.get('#username-error').should('not.exist')
    })
  })

  describe('Password Field Validation', () => {
    it('should show error for empty password', () => {
      cy.get('#password').focus().blur()
      cy.get('#password-error')
        .should('be.visible')
        .and('contain.text', 'Password is required')
    })

    it('should show error for password less than 6 characters', () => {
      cy.get('#password').type('12345')
      cy.get('#password').blur()
      cy.get('#password-error')
        .should('be.visible')
        .and('contain.text', 'Password must be at least 6 characters')
    })

    it('should accept valid password', () => {
      cy.get('#password').type('password123')
      cy.get('#password').blur()
      cy.get('#password-error').should('not.exist')
    })
  })

  describe('Form Submission Validation', () => {
    it('should disable submit button when form is invalid', () => {
      cy.get('button[type="submit"]').should('be.disabled')
    })

    it('should enable submit button when form is valid', () => {
      cy.get('#username').type('user123')
      cy.get('#password').type('password123')
      cy.get('button[type="submit"]').should('not.be.disabled')
    })

  })

  describe('Password Visibility Toggle', () => {
    it('should toggle password visibility', () => {
      cy.get('#password').type('password123')
      cy.get('#password').should('have.attr', 'type', 'password')
      
      cy.get('button[aria-label="Show password"]').click()
      cy.get('#password').should('have.attr', 'type', 'text')
      
      cy.get('button[aria-label="Hide password"]').click()
      cy.get('#password').should('have.attr', 'type', 'password')
    })
  })


  describe('Form Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      cy.get('#username').should('have.attr', 'aria-invalid', 'false')
      cy.get('#password').should('have.attr', 'aria-invalid', 'false')
      cy.get('button[type="submit"]').should('have.attr', 'type', 'submit')
    })

    it('should have proper labels with htmlFor attributes', () => {
      cy.get('label[for="username"]').should('exist')
      cy.get('label[for="password"]').should('exist')
      cy.get('label[for="remember"]').should('exist')
    })

    it('should have proper form structure', () => {
      // Check that labels are properly associated with inputs
      cy.get('label[for="username"]').should('be.visible')
      cy.get('label[for="password"]').should('be.visible')
      cy.get('label[for="remember"]').should('be.visible')
      
      // Check that inputs have corresponding labels
      cy.get('#username').should('have.attr', 'id', 'username')
      cy.get('#password').should('have.attr', 'id', 'password')
      cy.get('#remember').should('have.attr', 'id', 'remember')
    })

  })

  describe('Form Reset and Clear', () => {
    it('should clear form fields', () => {
      cy.get('#username').type('user123')
      cy.get('#password').type('password123')
      
      cy.get('#username').clear()
      cy.get('#password').clear()
      
      cy.get('#username').should('have.value', '')
      cy.get('#password').should('have.value', '')
    })

    it('should clear errors when fields are corrected', () => {
      cy.get('#username').type('ab').blur()
      cy.get('#username-error').should('be.visible')
      
      cy.get('#username').clear().type('user123').blur()
      cy.get('#username-error').should('not.exist')
    })
  })
})
