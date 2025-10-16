// src/lib/api/Facility.ts
// Facility API service for fetching facility data from Asgard operations

export interface City {
  id: number;
  name: string;
  languageId: number;
  cityType: number;
}

export interface FacilityType {
  id: number;
  name: string;
  deleted: number;
}

export interface Facility {
  id: number;
  name: string;
  city: City;
  facilityType: FacilityType;
  parentFacilityId: number;
  shortName: string | null;
  latitude: number;
  longitude: number;
  combinePicknRun: boolean;
  address: string;
  contactNumber: string;
  alternateContactNumber: string;
  deleted: number;
  activeStatus: number;
  clusterId: number | null;
  facilityTypeGroupId: number;
}

export interface FacilityResponse extends Array<Facility> {}

export class FacilityService {
  private static baseUrl = 'http://ops.ninjacart.in/asgard_ops/operations';
  
  static async getFacilities(): Promise<FacilityResponse> {
    try {
      const response = await fetch(`${FacilityService.baseUrl}/facility`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Accept-Language': 'en-GB,en-US;q=0.9,en;q=0.8',
          'Application': 'biFrost',
          'Authorization': 'Basic TkMzNjA0OjEyMzQ1Ng==',
          'Connection': 'keep-alive',
          'Origin': 'http://bifrost.ops.ninjacart.in',
          'Referer': 'http://bifrost.ops.ninjacart.in/',
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',
          'appVersion': '7',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const facilities = await response.json();
      
      // Validate response structure
      if (!Array.isArray(facilities)) {
        throw new Error('Invalid response format: expected array of facilities');
      }

      return facilities;
    } catch (error) {
      console.error('Facility API error:', error);
      throw error;
    }
  }
}

// Export individual functions for convenience
export const getFacilities = FacilityService.getFacilities;
