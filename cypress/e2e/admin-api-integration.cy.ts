// cypress/e2e/admin-api-integration.cy.ts
describe('Admin API Integration Tests', () => {
  // Note: Tests use htmlFor attributes (#username, #password) instead of text content
  // This ensures tests remain stable even if UI labels change (e.g., "Username" → "Employee ID")
  // Tests support both English and Portuguese languages via i18n
  beforeEach(() => {
    cy.visit('/login')
    cy.clearStorage()
  })

  describe('Successful Admin Login API Call', () => {
    it('should successfully login with valid admin credentials', () => {
      // Mock successful Admin API response
      cy.intercept('POST', 'http://direct.ninjacart.in:8080/user/login', {
        statusCode: 200,
        body: {
          id: 1759013,
          employeeId: "NC23550",
          userName: "NC23550",
          email: "sumeetkumar@ninjacart.com",
          roles: "TRADER",
          rolesList: ["TRADER"],
          asgardUserPropertyMap: {
            fullName: "Sumeet Kumar",
            city: { name: "Bengaluru" },
            facility: { name: "Hoskote FC" }
          }
        }
      }).as('adminLoginSuccess')
      
      // Fill form with valid credentials
      cy.get('#username').type('NC23550')
      cy.get('#password').type('123Ninja@')
      cy.get('button[type="submit"]').click()
      
      // Verify loading state
      cy.get('button[type="submit"]').should('contain.text', 'Logging in...')
      cy.get('button[type="submit"]').should('be.disabled')
      
      // Wait for API call
      cy.wait('@adminLoginSuccess')
      
      // Verify success message
      cy.get('[role="alert"]')
        .should('be.visible')
        .and('contain.text', 'Login successful! Redirecting...')
        .and('have.class', 'text-primary')
      
      // Verify admin user data is stored
      cy.window().then((win) => {
        const adminUser = JSON.parse(win.localStorage.getItem('adminUser') || '{}')
        expect(adminUser.id).to.equal(1759013)
        expect(adminUser.userName).to.equal('NC23550')
        expect(adminUser.email).to.equal('sumeetkumar@ninjacart.com')
        expect(adminUser.roles).to.equal('TRADER')
      })
    })

    it('should handle remember me functionality with Admin API', () => {
      cy.intercept('POST', 'http://direct.ninjacart.in:8080/user/login', {
        statusCode: 200,
        body: {
          id: 1759013,
          userName: "NC23550",
          email: "sumeetkumar@ninjacart.com"
        }
      }).as('adminLoginSuccess')
      
      cy.get('#username').type('NC23550')
      cy.get('#password').type('123Ninja@')
      cy.get('#remember').check()
      cy.get('button[type="submit"]').click()
      
      cy.wait('@adminLoginSuccess')
      
      // Verify username is remembered
      cy.window().then((win) => {
        expect(win.localStorage.getItem('rememberedUser')).to.equal('NC23550')
      })
    })
  })

  describe('Admin API Error Handling', () => {
    it('should handle 401 Unauthorized error', () => {
      cy.intercept('POST', 'http://direct.ninjacart.in:8080/user/login', {
        statusCode: 401,
        body: { error: 'Unauthorized' }
      }).as('adminLoginError')
      
      cy.get('#username').type('invaliduser')
      cy.get('#password').type('wrongpassword')
      cy.get('button[type="submit"]').click()
      
      cy.wait('@adminLoginError')
      cy.get('[role="alert"]')
        .should('be.visible')
        .and('contain.text', 'Invalid username or password. Please check your credentials.')
    })

    it('should handle 403 Forbidden error', () => {
      cy.intercept('POST', 'http://direct.ninjacart.in:8080/user/login', {
        statusCode: 403,
        body: { error: 'Forbidden' }
      }).as('adminLoginForbidden')
      
      cy.get('#username').type('NC23550')
      cy.get('#password').type('123Ninja@')
      cy.get('button[type="submit"]').click()
      
      cy.wait('@adminLoginForbidden')
      cy.get('[role="alert"]')
        .should('be.visible')
        .and('contain.text', 'Access denied. Please contact support.')
    })

    it('should handle 500 Server error', () => {
      cy.intercept('POST', 'http://direct.ninjacart.in:8080/user/login', {
        statusCode: 500,
        body: { error: 'Internal Server Error' }
      }).as('adminLoginServerError')
      
      cy.get('#username').type('NC23550')
      cy.get('#password').type('123Ninja@')
      cy.get('button[type="submit"]').click()
      
      cy.wait('@adminLoginServerError')
      cy.get('[role="alert"]')
        .should('be.visible')
        .and('contain.text', 'Server error. Please try again later.')
    })

    it('should handle network error', () => {
      cy.intercept('POST', 'http://direct.ninjacart.in:8080/user/login', {
        forceNetworkError: true
      }).as('adminLoginNetworkError')
      
      cy.get('#username').type('NC23550')
      cy.get('#password').type('123Ninja@')
      cy.get('button[type="submit"]').click()
      
      cy.wait('@adminLoginNetworkError')
      cy.get('[role="alert"]')
        .should('be.visible')
        .and('contain.text', 'Unable to connect to the server. Please check your internet connection.')
    })

    it('should handle offline error', () => {
      cy.window().then((win) => {
        cy.stub(win.navigator, 'onLine').value(false)
      })
      
      cy.get('#username').type('NC23550')
      cy.get('#password').type('123Ninja@')
      cy.get('button[type="submit"]').click()
      
      cy.get('[role="alert"]')
        .should('be.visible')
        .and('contain.text', 'You are currently offline. Please check your internet connection.')
    })
  })

  describe('Admin API Request Validation', () => {
    it('should send correct request headers', () => {
      cy.intercept('POST', 'http://direct.ninjacart.in:8080/user/login', (req) => {
        expect(req.headers).to.have.property('Application', 'biFrost')
        expect(req.headers).to.have.property('appVersion', '7')
        expect(req.headers).to.have.property('Authorization', 'Basic')
        expect(req.headers).to.have.property('Referer', 'http://www.direct.ninjacart.in/')
        expect(req.headers).to.have.property('Content-Type', 'application/json;charset=UTF-8')
        
        req.reply({
          statusCode: 200,
          body: { id: 1759013, userName: "NC23550" }
        })
      }).as('adminLoginRequest')
      
      cy.get('#username').type('NC23550')
      cy.get('#password').type('123Ninja@')
      cy.get('button[type="submit"]').click()
      
      cy.wait('@adminLoginRequest')
    })

    it('should send correct request body format', () => {
      cy.intercept('POST', 'http://direct.ninjacart.in:8080/user/login', (req) => {
        expect(req.body).to.have.property('userName')
        expect(req.body).to.have.property('password')
        expect(req.body.userName).to.be.a('string')
        expect(req.body.password).to.be.a('string')
        
        req.reply({
          statusCode: 200,
          body: { id: 1759013, userName: "NC23550" }
        })
      }).as('adminLoginRequest')
      
      cy.get('#username').type('NC23550')
      cy.get('#password').type('123Ninja@')
      cy.get('button[type="submit"]').click()
      
      cy.wait('@adminLoginRequest')
    })
  })

  describe('Internationalization Admin API Tests', () => {
    it('should handle Admin API errors in Portuguese', () => {
      // Set language to Portuguese
      cy.window().then((win) => {
        win.localStorage.setItem('language', 'pt');
      })
      cy.reload()
      
      // Mock API error
      cy.intercept('POST', 'http://direct.ninjacart.in:8080/user/login', {
        statusCode: 401,
        body: { error: 'Unauthorized' }
      }).as('adminLoginError')
      
      cy.get('#username').type('invaliduser')
      cy.get('#password').type('wrongpassword')
      cy.get('button[type="submit"]').click()
      
      cy.wait('@adminLoginError')
      cy.get('[role="alert"]')
        .should('be.visible')
        .and('contain.text', 'Nome de usuário ou senha inválidos')
    })

    it('should handle network errors in Portuguese', () => {
      // Set language to Portuguese
      cy.window().then((win) => {
        win.localStorage.setItem('language', 'pt');
      })
      cy.reload()
      
      // Mock network error
      cy.intercept('POST', 'http://direct.ninjacart.in:8080/user/login', { forceNetworkError: true }).as('networkError')
      
      cy.get('#username').type('NC23550')
      cy.get('#password').type('123Ninja@')
      cy.get('button[type="submit"]').click()
      
      cy.wait('@networkError')
      cy.get('[role="alert"]')
        .should('be.visible')
        .and('contain.text', 'Não foi possível conectar ao servidor')
    })
  })
})
