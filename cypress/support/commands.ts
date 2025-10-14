/// <reference types="cypress" />

// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to select DOM element by data-cy attribute.
       * @example cy.dataCy('greeting')
       */
      dataCy(value: string): Chainable<JQuery<HTMLElement>>
      
      /**
       * Custom command to login with credentials
       * @example cy.login('NC23550', 'password123')
       */
      login(username: string, password: string): Chainable<void>
      
      /**
       * Custom command to clear localStorage and sessionStorage
       * @example cy.clearStorage()
       */
      clearStorage(): Chainable<void>
      
      /**
       * Custom command to mock API responses
       * @example cy.mockLoginApi('success')
       */
      mockLoginApi(responseType: 'success' | 'error' | 'network-error'): Chainable<void>
    }
  }
}

// Custom command to select by data-cy attribute
Cypress.Commands.add('dataCy', (value: string) => {
  return cy.get(`[data-cy=${value}]`)
})

// Custom command to login
Cypress.Commands.add('login', (username: string, password: string) => {
  cy.get('#username').clear().type(username)
  cy.get('#password').clear().type(password)
  cy.get('button[type="submit"]').click()
})

// Custom command to clear storage
Cypress.Commands.add('clearStorage', () => {
  cy.clearLocalStorage()
  cy.clearAllSessionStorage()
  cy.window().then((win) => {
    win.localStorage.clear()
    win.sessionStorage.clear()
  })
})

// Custom command to mock API responses
Cypress.Commands.add('mockLoginApi', (responseType: 'success' | 'error' | 'network-error') => {
  const baseUrl = 'http://direct.ninjacart.in:8080'
  
  switch (responseType) {
    case 'success':
      cy.intercept('POST', `${baseUrl}/user/login`, {
        statusCode: 200,
        body: {
          success: true,
          message: 'Login successful',
          data: {
            token: 'mock-jwt-token',
            user: {
              id: '123',
              username: 'NC23550',
              email: 'user@ninjacart.com'
            }
          }
        }
      }).as('loginSuccess')
      break
      
    case 'error':
      cy.intercept('POST', `${baseUrl}/user/login`, {
        statusCode: 401,
        body: {
          success: false,
          message: 'Invalid credentials',
          error: 'Unauthorized'
        }
      }).as('loginError')
      break
      
    case 'network-error':
      cy.intercept('POST', `${baseUrl}/user/login`, {
        forceNetworkError: true
      }).as('loginNetworkError')
      break
  }
})

export {}