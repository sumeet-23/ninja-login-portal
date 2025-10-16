// cypress/e2e/facility-api-integration.cy.ts
describe('Facility API Integration', () => {
  beforeEach(() => {
    cy.visit('/view-purchase-order');
    cy.clearStorage();
  });

  it('should successfully load facilities from API', () => {
    // Mock the facility API response
    cy.intercept('GET', '**/facility', {
      statusCode: 200,
      body: [
        {
          "id": 1,
          "name": "Hoskote FC",
          "city": {
            "id": 2,
            "name": "Bengaluru",
            "languageId": 3,
            "cityType": 1
          },
          "facilityType": {
            "id": 1,
            "name": "Warehouse",
            "deleted": 0
          },
          "parentFacilityId": 1,
          "shortName": "HK",
          "latitude": 12.9951346,
          "longitude": 77.7832199,
          "combinePicknRun": true,
          "address": "Whitefield,Bangalore",
          "contactNumber": "9958343313",
          "alternateContactNumber": "9538011822",
          "deleted": 0,
          "activeStatus": 1,
          "clusterId": 1,
          "facilityTypeGroupId": 0
        },
        {
          "id": 2,
          "name": "BMW",
          "city": {
            "id": 2,
            "name": "Bengaluru",
            "languageId": 3,
            "cityType": 1
          },
          "facilityType": {
            "id": 1,
            "name": "Warehouse",
            "deleted": 0
          },
          "parentFacilityId": 2,
          "shortName": null,
          "latitude": 12.911722,
          "longitude": 77.624144,
          "combinePicknRun": false,
          "address": "Near Mahindra Showroom,Bommanahall",
          "contactNumber": "1212121236",
          "alternateContactNumber": "1111111111",
          "deleted": 0,
          "activeStatus": 0,
          "clusterId": null,
          "facilityTypeGroupId": 0
        }
      ]
    }).as('facilitiesSuccess');

    // Wait for the API call
    cy.wait('@facilitiesSuccess');

    // Check that facility dropdown is populated
    cy.get('[data-cy="facility-select"]').click();
    cy.get('[data-cy="facility-option-Hoskote FC"]').should('be.visible');
    cy.get('[data-cy="facility-option-BMW"]').should('be.visible');
    
    // Check that inactive facility shows (Inactive) label
    cy.get('[data-cy="facility-option-BMW"]').should('contain', '(Inactive)');
  });

  it('should handle facility API loading state', () => {
    // Mock a slow API response
    cy.intercept('GET', '**/facility', {
      statusCode: 200,
      body: [],
      delay: 2000
    }).as('facilitiesLoading');

    // Check loading state
    cy.get('[data-cy="facility-select"]').should('be.disabled');
    cy.get('[data-cy="facility-select"]').should('contain', 'Loading facilities...');

    // Wait for API call to complete
    cy.wait('@facilitiesLoading');
  });

  it('should handle facility API error state', () => {
    // Mock API error
    cy.intercept('GET', '**/facility', {
      statusCode: 500,
      body: { error: 'Internal Server Error' }
    }).as('facilitiesError');

    // Wait for the API call
    cy.wait('@facilitiesError');

    // Check error state
    cy.get('[data-cy="facility-select"]').click();
    cy.get('[data-cy="facility-error"]').should('be.visible');
    cy.get('[data-cy="facility-error"]').should('contain', 'Error loading facilities');
  });

  it('should allow facility selection and trigger fetch', () => {
    // Mock successful facility API response
    cy.intercept('GET', '**/facility', {
      statusCode: 200,
      body: [
        {
          "id": 1,
          "name": "Hoskote FC",
          "city": {
            "id": 2,
            "name": "Bengaluru",
            "languageId": 3,
            "cityType": 1
          },
          "facilityType": {
            "id": 1,
            "name": "Warehouse",
            "deleted": 0
          },
          "parentFacilityId": 1,
          "shortName": "HK",
          "latitude": 12.9951346,
          "longitude": 77.7832199,
          "combinePicknRun": true,
          "address": "Whitefield,Bangalore",
          "contactNumber": "9958343313",
          "alternateContactNumber": "9538011822",
          "deleted": 0,
          "activeStatus": 1,
          "clusterId": 1,
          "facilityTypeGroupId": 0
        }
      ]
    }).as('facilitiesSuccess');

    // Mock purchase orders API
    cy.intercept('GET', '**/purchase-orders**', {
      statusCode: 200,
      body: []
    }).as('purchaseOrdersSuccess');

    // Wait for facilities to load
    cy.wait('@facilitiesSuccess');

    // Select a facility
    cy.get('[data-cy="facility-select"]').click();
    cy.get('[data-cy="facility-option-Hoskote FC"]').click();

    // Click fetch button
    cy.get('[data-cy="fetch-button"]').click();

    // Verify that purchase orders API was called with the selected facility
    cy.wait('@purchaseOrdersSuccess').then((interception) => {
      expect(interception.request.url).to.include('facility=Hoskote FC');
    });
  });

  it('should set default facility when facilities are loaded', () => {
    // Mock facility API response with active facility
    cy.intercept('GET', '**/facility', {
      statusCode: 200,
      body: [
        {
          "id": 1,
          "name": "Hoskote FC",
          "city": {
            "id": 2,
            "name": "Bengaluru",
            "languageId": 3,
            "cityType": 1
          },
          "facilityType": {
            "id": 1,
            "name": "Warehouse",
            "deleted": 0
          },
          "parentFacilityId": 1,
          "shortName": "HK",
          "latitude": 12.9951346,
          "longitude": 77.7832199,
          "combinePicknRun": true,
          "address": "Whitefield,Bangalore",
          "contactNumber": "9958343313",
          "alternateContactNumber": "9538011822",
          "deleted": 0,
          "activeStatus": 1,
          "clusterId": 1,
          "facilityTypeGroupId": 0
        },
        {
          "id": 2,
          "name": "BMW",
          "city": {
            "id": 2,
            "name": "Bengaluru",
            "languageId": 3,
            "cityType": 1
          },
          "facilityType": {
            "id": 1,
            "name": "Warehouse",
            "deleted": 0
          },
          "parentFacilityId": 2,
          "shortName": null,
          "latitude": 12.911722,
          "longitude": 77.624144,
          "combinePicknRun": false,
          "address": "Near Mahindra Showroom,Bommanahall",
          "contactNumber": "1212121236",
          "alternateContactNumber": "1111111111",
          "deleted": 0,
          "activeStatus": 0,
          "clusterId": null,
          "facilityTypeGroupId": 0
        }
      ]
    }).as('facilitiesSuccess');

    // Wait for facilities to load
    cy.wait('@facilitiesSuccess');

    // Check that Hoskote FC (active facility) is selected by default
    cy.get('[data-cy="facility-select"]').should('contain', 'Hoskote FC');
  });

  it('should handle empty facility response', () => {
    // Mock empty facility API response
    cy.intercept('GET', '**/facility', {
      statusCode: 200,
      body: []
    }).as('facilitiesEmpty');

    // Wait for the API call
    cy.wait('@facilitiesEmpty');

    // Check that facility dropdown shows no options
    cy.get('[data-cy="facility-select"]').click();
    cy.get('[data-cy="facility-options"]').should('be.empty');
  });

  it('should maintain facility selection after page refresh', () => {
    // Mock facility API response
    cy.intercept('GET', '**/facility', {
      statusCode: 200,
      body: [
        {
          "id": 1,
          "name": "Hoskote FC",
          "city": {
            "id": 2,
            "name": "Bengaluru",
            "languageId": 3,
            "cityType": 1
          },
          "facilityType": {
            "id": 1,
            "name": "Warehouse",
            "deleted": 0
          },
          "parentFacilityId": 1,
          "shortName": "HK",
          "latitude": 12.9951346,
          "longitude": 77.7832199,
          "combinePicknRun": true,
          "address": "Whitefield,Bangalore",
          "contactNumber": "9958343313",
          "alternateContactNumber": "9538011822",
          "deleted": 0,
          "activeStatus": 1,
          "clusterId": 1,
          "facilityTypeGroupId": 0
        }
      ]
    }).as('facilitiesSuccess');

    // Wait for facilities to load
    cy.wait('@facilitiesSuccess');

    // Select a facility
    cy.get('[data-cy="facility-select"]').click();
    cy.get('[data-cy="facility-option-Hoskote FC"]').click();

    // Refresh the page
    cy.reload();

    // Mock facilities API again for reload
    cy.intercept('GET', '**/facility', {
      statusCode: 200,
      body: [
        {
          "id": 1,
          "name": "Hoskote FC",
          "city": {
            "id": 2,
            "name": "Bengaluru",
            "languageId": 3,
            "cityType": 1
          },
          "facilityType": {
            "id": 1,
            "name": "Warehouse",
            "deleted": 0
          },
          "parentFacilityId": 1,
          "shortName": "HK",
          "latitude": 12.9951346,
          "longitude": 77.7832199,
          "combinePicknRun": true,
          "address": "Whitefield,Bangalore",
          "contactNumber": "9958343313",
          "alternateContactNumber": "9538011822",
          "deleted": 0,
          "activeStatus": 1,
          "clusterId": 1,
          "facilityTypeGroupId": 0
        }
      ]
    }).as('facilitiesSuccessReload');

    cy.wait('@facilitiesSuccessReload');

    // Check that the facility selection is maintained
    cy.get('[data-cy="facility-select"]').should('contain', 'Hoskote FC');
  });

  it('should show inactive facilities with proper labeling', () => {
    // Mock facility API response with both active and inactive facilities
    cy.intercept('GET', '**/facility', {
      statusCode: 200,
      body: [
        {
          "id": 1,
          "name": "Active Facility",
          "city": {
            "id": 1,
            "name": "Chennai",
            "languageId": 3,
            "cityType": 1
          },
          "facilityType": {
            "id": 1,
            "name": "Warehouse",
            "deleted": 0
          },
          "parentFacilityId": 1,
          "shortName": "AF",
          "latitude": 12.9951346,
          "longitude": 77.7832199,
          "combinePicknRun": true,
          "address": "Test Address",
          "contactNumber": "1234567890",
          "alternateContactNumber": "0987654321",
          "deleted": 0,
          "activeStatus": 1,
          "clusterId": 1,
          "facilityTypeGroupId": 0
        },
        {
          "id": 2,
          "name": "Inactive Facility",
          "city": {
            "id": 1,
            "name": "Chennai",
            "languageId": 3,
            "cityType": 1
          },
          "facilityType": {
            "id": 1,
            "name": "Warehouse",
            "deleted": 0
          },
          "parentFacilityId": 2,
          "shortName": "IF",
          "latitude": 12.911722,
          "longitude": 77.624144,
          "combinePicknRun": false,
          "address": "Test Address 2",
          "contactNumber": "1111111111",
          "alternateContactNumber": "2222222222",
          "deleted": 0,
          "activeStatus": 0,
          "clusterId": null,
          "facilityTypeGroupId": 0
        }
      ]
    }).as('facilitiesSuccess');

    // Wait for facilities to load
    cy.wait('@facilitiesSuccess');

    // Check that both facilities are shown with proper labeling
    cy.get('[data-cy="facility-select"]').click();
    cy.get('[data-cy="facility-option-Active Facility"]').should('be.visible');
    cy.get('[data-cy="facility-option-Active Facility"]').should('not.contain', '(Inactive)');
    cy.get('[data-cy="facility-option-Inactive Facility"]').should('be.visible');
    cy.get('[data-cy="facility-option-Inactive Facility"]').should('contain', '(Inactive)');
  });

  it('should filter facilities based on selected city', () => {
    // Mock city API response
    cy.intercept('GET', '**/city', {
      statusCode: 200,
      body: [
        {
          "id": 1,
          "name": "Chennai",
          "languageId": 3,
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

    // Mock facility API response with facilities from different cities
    cy.intercept('GET', '**/facility', {
      statusCode: 200,
      body: [
        {
          "id": 1,
          "name": "Chennai Facility 1",
          "city": {
            "id": 1,
            "name": "Chennai",
            "languageId": 3,
            "cityType": 1
          },
          "facilityType": {
            "id": 1,
            "name": "Warehouse",
            "deleted": 0
          },
          "parentFacilityId": 1,
          "shortName": "CF1",
          "latitude": 12.9951346,
          "longitude": 77.7832199,
          "combinePicknRun": true,
          "address": "Chennai Address",
          "contactNumber": "1234567890",
          "alternateContactNumber": "0987654321",
          "deleted": 0,
          "activeStatus": 1,
          "clusterId": 1,
          "facilityTypeGroupId": 0
        },
        {
          "id": 2,
          "name": "Bengaluru Facility 1",
          "city": {
            "id": 2,
            "name": "Bengaluru",
            "languageId": 3,
            "cityType": 1
          },
          "facilityType": {
            "id": 1,
            "name": "Warehouse",
            "deleted": 0
          },
          "parentFacilityId": 2,
          "shortName": "BF1",
          "latitude": 12.911722,
          "longitude": 77.624144,
          "combinePicknRun": false,
          "address": "Bengaluru Address",
          "contactNumber": "1111111111",
          "alternateContactNumber": "2222222222",
          "deleted": 0,
          "activeStatus": 1,
          "clusterId": 1,
          "facilityTypeGroupId": 0
        },
        {
          "id": 3,
          "name": "Chennai Facility 2",
          "city": {
            "id": 1,
            "name": "Chennai",
            "languageId": 3,
            "cityType": 1
          },
          "facilityType": {
            "id": 1,
            "name": "Warehouse",
            "deleted": 0
          },
          "parentFacilityId": 3,
          "shortName": "CF2",
          "latitude": 12.9951346,
          "longitude": 77.7832199,
          "combinePicknRun": true,
          "address": "Chennai Address 2",
          "contactNumber": "3333333333",
          "alternateContactNumber": "4444444444",
          "deleted": 0,
          "activeStatus": 1,
          "clusterId": 1,
          "facilityTypeGroupId": 0
        }
      ]
    }).as('facilitiesSuccess');

    // Wait for both APIs to load
    cy.wait('@citiesSuccess');
    cy.wait('@facilitiesSuccess');

    // Initially, all facilities should be visible (no city selected)
    cy.get('[data-cy="facility-select"]').click();
    cy.get('[data-cy="facility-option-Chennai Facility 1"]').should('be.visible');
    cy.get('[data-cy="facility-option-Bengaluru Facility 1"]').should('be.visible');
    cy.get('[data-cy="facility-option-Chennai Facility 2"]').should('be.visible');
    cy.get('[data-cy="facility-select"]').click(); // Close dropdown

    // Select Chennai city
    cy.get('[data-cy="city-select"]').click();
    cy.get('[data-cy="city-option-Chennai"]').click();

    // Now only Chennai facilities should be visible
    cy.get('[data-cy="facility-select"]').click();
    cy.get('[data-cy="facility-option-Chennai Facility 1"]').should('be.visible');
    cy.get('[data-cy="facility-option-Chennai Facility 2"]').should('be.visible');
    cy.get('[data-cy="facility-option-Bengaluru Facility 1"]').should('not.exist');
    cy.get('[data-cy="facility-select"]').click(); // Close dropdown

    // Select Bengaluru city
    cy.get('[data-cy="city-select"]').click();
    cy.get('[data-cy="city-option-Bengaluru"]').click();

    // Now only Bengaluru facilities should be visible
    cy.get('[data-cy="facility-select"]').click();
    cy.get('[data-cy="facility-option-Bengaluru Facility 1"]').should('be.visible');
    cy.get('[data-cy="facility-option-Chennai Facility 1"]').should('not.exist');
    cy.get('[data-cy="facility-option-Chennai Facility 2"]').should('not.exist');
  });

  it('should reset facility selection when city changes', () => {
    // Mock city API response
    cy.intercept('GET', '**/city', {
      statusCode: 200,
      body: [
        {
          "id": 1,
          "name": "Chennai",
          "languageId": 3,
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

    // Mock facility API response
    cy.intercept('GET', '**/facility', {
      statusCode: 200,
      body: [
        {
          "id": 1,
          "name": "Chennai Facility",
          "city": {
            "id": 1,
            "name": "Chennai",
            "languageId": 3,
            "cityType": 1
          },
          "facilityType": {
            "id": 1,
            "name": "Warehouse",
            "deleted": 0
          },
          "parentFacilityId": 1,
          "shortName": "CF",
          "latitude": 12.9951346,
          "longitude": 77.7832199,
          "combinePicknRun": true,
          "address": "Chennai Address",
          "contactNumber": "1234567890",
          "alternateContactNumber": "0987654321",
          "deleted": 0,
          "activeStatus": 1,
          "clusterId": 1,
          "facilityTypeGroupId": 0
        },
        {
          "id": 2,
          "name": "Bengaluru Facility",
          "city": {
            "id": 2,
            "name": "Bengaluru",
            "languageId": 3,
            "cityType": 1
          },
          "facilityType": {
            "id": 1,
            "name": "Warehouse",
            "deleted": 0
          },
          "parentFacilityId": 2,
          "shortName": "BF",
          "latitude": 12.911722,
          "longitude": 77.624144,
          "combinePicknRun": false,
          "address": "Bengaluru Address",
          "contactNumber": "1111111111",
          "alternateContactNumber": "2222222222",
          "deleted": 0,
          "activeStatus": 1,
          "clusterId": 1,
          "facilityTypeGroupId": 0
        }
      ]
    }).as('facilitiesSuccess');

    // Wait for both APIs to load
    cy.wait('@citiesSuccess');
    cy.wait('@facilitiesSuccess');

    // Select Chennai and a facility
    cy.get('[data-cy="city-select"]').click();
    cy.get('[data-cy="city-option-Chennai"]').click();
    cy.get('[data-cy="facility-select"]').click();
    cy.get('[data-cy="facility-option-Chennai Facility"]').click();

    // Verify Chennai facility is selected
    cy.get('[data-cy="facility-select"]').should('contain', 'Chennai Facility');

    // Change city to Bengaluru
    cy.get('[data-cy="city-select"]').click();
    cy.get('[data-cy="city-option-Bengaluru"]').click();

    // Verify facility selection is reset to Bengaluru facility
    cy.get('[data-cy="facility-select"]').should('contain', 'Bengaluru Facility');
  });

  it('should show no facilities message when no facilities exist for selected city', () => {
    // Mock city API response
    cy.intercept('GET', '**/city', {
      statusCode: 200,
      body: [
        {
          "id": 1,
          "name": "Chennai",
          "languageId": 3,
          "cityType": 1
        },
        {
          "id": 2,
          "name": "Mumbai",
          "languageId": 3,
          "cityType": 1
        }
      ]
    }).as('citiesSuccess');

    // Mock facility API response with only Chennai facilities
    cy.intercept('GET', '**/facility', {
      statusCode: 200,
      body: [
        {
          "id": 1,
          "name": "Chennai Facility",
          "city": {
            "id": 1,
            "name": "Chennai",
            "languageId": 3,
            "cityType": 1
          },
          "facilityType": {
            "id": 1,
            "name": "Warehouse",
            "deleted": 0
          },
          "parentFacilityId": 1,
          "shortName": "CF",
          "latitude": 12.9951346,
          "longitude": 77.7832199,
          "combinePicknRun": true,
          "address": "Chennai Address",
          "contactNumber": "1234567890",
          "alternateContactNumber": "0987654321",
          "deleted": 0,
          "activeStatus": 1,
          "clusterId": 1,
          "facilityTypeGroupId": 0
        }
      ]
    }).as('facilitiesSuccess');

    // Wait for both APIs to load
    cy.wait('@citiesSuccess');
    cy.wait('@facilitiesSuccess');

    // Select Mumbai city (which has no facilities)
    cy.get('[data-cy="city-select"]').click();
    cy.get('[data-cy="city-option-Mumbai"]').click();

    // Check that no facilities message is shown
    cy.get('[data-cy="facility-select"]').click();
    cy.get('[data-cy="facility-options"]').should('contain', 'No facilities available for selected city');
  });
});
