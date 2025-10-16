// cypress/e2e/city-api-integration.cy.ts
describe('City API Integration', () => {
  beforeEach(() => {
    cy.visit('/view-purchase-order');
    cy.clearStorage();
  });

  it('should successfully load cities from API', () => {
    // Mock the city API response
    cy.intercept('GET', '**/city', {
      statusCode: 200,
      body: [
        {
          "id": 1,
          "name": "Amsterdam",
          "languageId": 1,
          "cityType": 1
        },
        {
          "id": 2,
          "name": "Bengaluru",
          "languageId": 3,
          "cityType": 1
        },
        {
          "id": 3,
          "name": "Chennai",
          "languageId": 3,
          "cityType": 1
        }
      ]
    }).as('citiesSuccess');

    // Wait for the API call
    cy.wait('@citiesSuccess');

    // Check that city dropdown is populated
    cy.get('[data-cy="city-select"]').click();
    cy.get('[data-cy="city-option-Amsterdam"]').should('be.visible');
    cy.get('[data-cy="city-option-Bengaluru"]').should('be.visible');
    cy.get('[data-cy="city-option-Chennai"]').should('be.visible');
  });

  it('should handle city API loading state', () => {
    // Mock a slow API response
    cy.intercept('GET', '**/city', {
      statusCode: 200,
      body: [],
      delay: 2000
    }).as('citiesLoading');

    // Check loading state
    cy.get('[data-cy="city-select"]').should('be.disabled');
    cy.get('[data-cy="city-select"]').should('contain', 'Loading cities...');

    // Wait for API call to complete
    cy.wait('@citiesLoading');
  });

  it('should handle city API error state', () => {
    // Mock API error
    cy.intercept('GET', '**/city', {
      statusCode: 500,
      body: { error: 'Internal Server Error' }
    }).as('citiesError');

    // Wait for the API call
    cy.wait('@citiesError');

    // Check error state
    cy.get('[data-cy="city-select"]').click();
    cy.get('[data-cy="city-error"]').should('be.visible');
    cy.get('[data-cy="city-error"]').should('contain', 'Error loading cities');
  });

  it('should allow city selection and trigger fetch', () => {
    // Mock successful city API response
    cy.intercept('GET', '**/city', {
      statusCode: 200,
      body: [
        {
          "id": 1,
          "name": "Amsterdam",
          "languageId": 1,
          "cityType": 1
        },
        {
          "id": 2,
          "name": "Bengaluru",
          "languageId": 3,
          "cityType": 1
        }
      ]
    }).as('citiesSuccess');

    // Mock purchase orders API
    cy.intercept('GET', '**/purchase-orders**', {
      statusCode: 200,
      body: []
    }).as('purchaseOrdersSuccess');

    // Wait for cities to load
    cy.wait('@citiesSuccess');

    // Select a city
    cy.get('[data-cy="city-select"]').click();
    cy.get('[data-cy="city-option-Bengaluru"]').click();

    // Click fetch button
    cy.get('[data-cy="fetch-button"]').click();

    // Verify that purchase orders API was called with the selected city
    cy.wait('@purchaseOrdersSuccess').then((interception) => {
      expect(interception.request.url).to.include('city=Bengaluru');
    });
  });

  it('should set default city when cities are loaded', () => {
    // Mock city API response with Chennai
    cy.intercept('GET', '**/city', {
      statusCode: 200,
      body: [
        {
          "id": 1,
          "name": "Amsterdam",
          "languageId": 1,
          "cityType": 1
        },
        {
          "id": 2,
          "name": "Chennai",
          "languageId": 3,
          "cityType": 1
        }
      ]
    }).as('citiesSuccess');

    // Wait for cities to load
    cy.wait('@citiesSuccess');

    // Check that Chennai is selected by default
    cy.get('[data-cy="city-select"]').should('contain', 'Chennai');
  });

  it('should handle empty city response', () => {
    // Mock empty city API response
    cy.intercept('GET', '**/city', {
      statusCode: 200,
      body: []
    }).as('citiesEmpty');

    // Wait for the API call
    cy.wait('@citiesEmpty');

    // Check that city dropdown shows no options
    cy.get('[data-cy="city-select"]').click();
    cy.get('[data-cy="city-options"]').should('be.empty');
  });

  it('should maintain city selection after page refresh', () => {
    // Mock city API response
    cy.intercept('GET', '**/city', {
      statusCode: 200,
      body: [
        {
          "id": 1,
          "name": "Amsterdam",
          "languageId": 1,
          "cityType": 1
        },
        {
          "id": 2,
          "name": "Bengaluru",
          "languageId": 3,
          "cityType": 1
        }
      ]
    }).as('citiesSuccess');

    // Wait for cities to load
    cy.wait('@citiesSuccess');

    // Select a city
    cy.get('[data-cy="city-select"]').click();
    cy.get('[data-cy="city-option-Amsterdam"]').click();

    // Refresh the page
    cy.reload();

    // Mock cities API again for reload
    cy.intercept('GET', '**/city', {
      statusCode: 200,
      body: [
        {
          "id": 1,
          "name": "Amsterdam",
          "languageId": 1,
          "cityType": 1
        },
        {
          "id": 2,
          "name": "Bengaluru",
          "languageId": 3,
          "cityType": 1
        }
      ]
    }).as('citiesSuccessReload');

    cy.wait('@citiesSuccessReload');

    // Check that the city selection is maintained
    cy.get('[data-cy="city-select"]').should('contain', 'Amsterdam');
  });
});
