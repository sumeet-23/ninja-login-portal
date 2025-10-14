describe('API Integration Tests', () => {
  beforeEach(() => {
    cy.visit('/login')
    cy.clearStorage()
  })

  describe('Successful Login API Call', () => {
    it('should successfully login with valid credentials', () => {
      // Mock successful API response
      cy.mockLoginApi('success')
      
      // Fill form with valid credentials
      cy.get('#username').type('NC23550')
      cy.get('#password').type('123Ninja@')
      cy.get('button[type="submit"]').click()
      
      // Verify loading state
      cy.get('button[type="submit"]').should('contain.text', 'Logging in...')
      cy.get('button[type="submit"]').should('be.disabled')
      
      // Wait for API call and verify success
      cy.wait('@loginSuccess')
      cy.get('[role="alert"]')
        .should('be.visible')
        .and('contain.text', 'Login successful! Redirecting...')
        .and('have.class', 'text-primary')
      
      // Verify API call was made with correct headers and body
      cy.get('@loginSuccess').then((interception) => {
        expect(interception.request.method).to.equal('POST')
        expect(interception.request.url).to.include('/user/login')
        expect(interception.request.headers).to.have.property('Application', 'biFrost')
        expect(interception.request.headers).to.have.property('Authorization', 'Basic')
        expect(interception.request.headers).to.have.property('Content-Type', 'application/json;charset=UTF-8')
        expect(interception.request.body).to.deep.equal({
          userName: 'NC23550',
          password: '123Ninja@'
        })
      })
    })

    it('should handle remember me functionality with API', () => {
      cy.mockLoginApi('success')
      
      cy.get('#username').type('NC23550')
      cy.get('#password').type('123Ninja@')
      cy.get('#remember').check()
      cy.get('button[type="submit"]').click()
      
      cy.wait('@loginSuccess')
      
      // Verify employID is stored in localStorage
      cy.window().then((win) => {
        expect(win.localStorage.getItem('remembereduserName')).to.equal('NC23550')
      })
    })
  })

  describe('API Error Handling', () => {
    it('should handle 401 Unauthorized error', () => {
      cy.mockLoginApi('error')
      
      cy.get('#username').type('invaliduser')
      cy.get('#password').type('wrongpassword')
      cy.get('button[type="submit"]').click()
      
      cy.wait('@loginError')
      cy.get('[role="alert"]')
        .should('be.visible')
        .and('contain.text', 'Invalid username or password. Please check your credentials.')
        .and('have.class', 'text-destructive')
    })

    it('should handle 403 Forbidden error', () => {
      cy.intercept('POST', 'http://direct.ninjacart.in:8080/user/login', {
        statusCode: 403,
        body: {
          success: false,
          message: 'Access denied',
          error: 'Forbidden'
        }
      }).as('loginForbidden')
      
      cy.get('#username').type('NC23550')
      cy.get('#password').type('123Ninja@')
      cy.get('button[type="submit"]').click()
      
      cy.wait('@loginForbidden')
      cy.get('[role="alert"]')
        .should('be.visible')
        .and('contain.text', 'Access denied. Please contact support.')
    })

    it('should handle 500 Server Error', () => {
      cy.intercept('POST', 'http://direct.ninjacart.in:8080/user/login', {
        statusCode: 500,
        body: {
          success: false,
          message: 'Internal server error',
          error: 'Server Error'
        }
      }).as('loginServerError')
      
      cy.get('#username').type('NC23550')
      cy.get('#password').type('123Ninja@')
      cy.get('button[type="submit"]').click()
      
      cy.wait('@loginServerError')
      cy.get('[role="alert"]')
        .should('be.visible')
        .and('contain.text', 'Server error. Please try again later.')
    })

    it('should handle network error', () => {
      cy.mockLoginApi('network-error')
      
      cy.get('#username').type('NC23550')
      cy.get('#password').type('123Ninja@')
      cy.get('button[type="submit"]').click()
      
      cy.wait('@loginNetworkError')
      cy.get('[role="alert"]')
        .should('be.visible')
        .and('contain.text', 'Unable to connect to the server. Please check your internet connection.')
    })

    it('should handle offline scenario', () => {
      // Mock offline state
      cy.window().then((win) => {
        Object.defineProperty(win.navigator, 'onLine', {
          writable: true,
          value: false
        })
      })
      
      cy.get('#username').type('NC23550')
      cy.get('#password').type('123Ninja@')
      cy.get('button[type="submit"]').click()
      
      cy.get('[role="alert"]')
        .should('be.visible')
        .and('contain.text', 'You are currently offline. Please check your internet connection.')
    })
  })

  describe('Employee ID Normalization', () => {
    it('should automatically add NC prefix to employee ID without it', () => {
      cy.intercept('POST', 'http://direct.ninjacart.in:8080/user/login', (req) => {
        expect(req.body.userName).to.equal('NCuser123')
        req.reply({
          statusCode: 200,
          body: { success: true, message: 'Login successful' }
        })
      }).as('loginWithNormalizeduserName')
      
      cy.get('#username').type('user123')
      cy.get('#password').type('password123')
      cy.get('button[type="submit"]').click()
      
      cy.wait('@loginWithNormalizeduserName')
    })

    it('should not modify employee ID that already has NC prefix', () => {
      cy.intercept('POST', 'http://direct.ninjacart.in:8080/user/login', (req) => {
        expect(req.body.userName).to.equal('NCuser123')
        req.reply({
          statusCode: 200,
          body: { success: true, message: 'Login successful' }
        })
      }).as('loginWithExistingNC')
      
      cy.get('#username').type('NCuser123')
      cy.get('#password').type('password123')
      cy.get('button[type="submit"]').click()
      
      cy.wait('@loginWithExistingNC')
    })
  })

  describe('API Request Validation', () => {
    it('should send correct request headers', () => {
      cy.intercept('POST', 'http://direct.ninjacart.in:8080/user/login', (req) => {
        expect(req.headers).to.have.property('Application', 'biFrost')
        expect(req.headers).to.have.property('Authorization', 'Basic')
        expect(req.headers).to.have.property('Referer', 'http://www.direct.ninjacart.in/')
        expect(req.headers).to.have.property('Content-Type', 'application/json;charset=UTF-8')
        expect(req.headers).to.have.property('Accept', 'application/json, text/plain, */*')
        expect(req.headers).to.have.property('User-Agent')
        
        req.reply({
          statusCode: 200,
          body: { success: true, message: 'Login successful' }
        })
      }).as('loginRequest')
      
      cy.get('#username').type('NC23550')
      cy.get('#password').type('123Ninja@')
      cy.get('button[type="submit"]').click()
      
      cy.wait('@loginRequest')
    })

    it('should send correct request body format', () => {
      cy.intercept('POST', 'http://direct.ninjacart.in:8080/user/login', (req) => {
        expect(req.body).to.have.property('userName')
        expect(req.body).to.have.property('password')
        expect(req.body.userName).to.be.a('string')
        expect(req.body.password).to.be.a('string')
        
        req.reply({
          statusCode: 200,
          body: { success: true, message: 'Login successful' }
        })
      }).as('loginBody')
      
      cy.get('#username').type('test@example.com')
      cy.get('#password').type('testpassword')
      cy.get('button[type="submit"]').click()
      
      cy.wait('@loginBody')
    })
  })

  describe('Loading States and UI Feedback', () => {
    it('should show loading spinner during API call', () => {
      cy.intercept('POST', 'http://direct.ninjacart.in:8080/user/login', {
        delay: 2000,
        statusCode: 200,
        body: { success: true, message: 'Login successful' }
      }).as('loginDelay')
      
      cy.get('#username').type('NC23550')
      cy.get('#password').type('123Ninja@')
      cy.get('button[type="submit"]').click()
      
      // Verify loading state
      cy.get('button[type="submit"]').should('contain.text', 'Logging in...')
      cy.get('button[type="submit"]').should('be.disabled')
      cy.get('button[type="submit"] svg').should('have.class', 'animate-spin')
      
      cy.wait('@loginDelay')
    })

    it('should clear loading state after API response', () => {
      cy.mockLoginApi('success')
      
      cy.get('#username').type('NC23550')
      cy.get('#password').type('123Ninja@')
      cy.get('button[type="submit"]').click()
      
      cy.wait('@loginSuccess')
      
      // Verify loading state is cleared
      cy.get('button[type="submit"]').should('not.contain.text', 'Logging in...')
      cy.get('button[type="submit"]').should('not.be.disabled')
    })
  })

  describe('Multiple Login Attempts', () => {
    it('should handle multiple failed login attempts', () => {
      cy.mockLoginApi('error')
      
      // First attempt
      cy.get('#username').type('wronguser')
      cy.get('#password').type('wrongpassword')
      cy.get('button[type="submit"]').click()
      cy.wait('@loginError')
      
      // Clear and try again
      cy.get('#username').clear().type('anotheruser')
      cy.get('#password').clear().type('anotherpassword')
      cy.get('button[type="submit"]').click()
      cy.wait('@loginError')
      
      cy.get('[role="alert"]')
        .should('be.visible')
        .and('contain.text', 'Invalid username or password')
    })

    it('should handle successful login after failed attempts', () => {
      // First attempt - fail
      cy.mockLoginApi('error')
      cy.get('#username').type('wronguser')
      cy.get('#password').type('wrongpassword')
      cy.get('button[type="submit"]').click()
      cy.wait('@loginError')
      
      // Second attempt - success
      cy.mockLoginApi('success')
      cy.get('#username').clear().type('NC23550')
      cy.get('#password').clear().type('123Ninja@')
      cy.get('button[type="submit"]').click()
      cy.wait('@loginSuccess')
      
      cy.get('[role="alert"]')
        .should('be.visible')
        .and('contain.text', 'Login successful! Redirecting...')
    })
  })

  describe('API Response Data Handling', () => {
    it('should log response data to console', () => {
      cy.window().then((win) => {
        cy.spy(win.console, 'log').as('consoleLog')
      })
      
      cy.mockLoginApi('success')
      cy.get('#username').type('NC23550')
      cy.get('#password').type('123Ninja@')
      cy.get('button[type="submit"]').click()
      
      cy.wait('@loginSuccess')
      cy.get('@consoleLog').should('have.been.calledWith', 'Login response:', Cypress.sinon.match.object)
    })

    it('should handle different response formats', () => {
      cy.intercept('POST', 'http://direct.ninjacart.in:8080/user/login', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            token: 'jwt-token-123',
            user: {
              id: '456',
              name: 'Test User',
              role: 'admin'
            },
            permissions: ['read', 'write', 'admin']
          },
          message: 'Authentication successful'
        }
      }).as('loginCustomResponse')
      
      cy.get('#username').type('NC23550')
      cy.get('#password').type('123Ninja@')
      cy.get('button[type="submit"]').click()
      
      cy.wait('@loginCustomResponse')
      cy.get('[role="alert"]')
        .should('be.visible')
        .and('contain.text', 'Login successful! Redirecting...')
    })
  })
})
