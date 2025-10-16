// src/lib/api/City.ts
// City API service for fetching city data from Asgard operations

export interface City {
  id: number;
  name: string;
  languageId: number;
  cityType: number;
}

export interface CityResponse extends Array<City> {}

export class CityService {
  private static baseUrl = 'http://ops.ninjacart.in/asgard_ops/operations';
  
  static async getCities(): Promise<CityResponse> {
    try {
      // Use direct URL for now since the proxy is configured for /api routes
      const response = await fetch(`${CityService.baseUrl}/city`, {
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

      const cities = await response.json();
      
      // Validate response structure
      if (!Array.isArray(cities)) {
        throw new Error('Invalid response format: expected array of cities');
      }

      return cities;
    } catch (error) {
      console.error('City API error:', error);
      throw error;
    }
  }
}

// Export individual functions for convenience
export const getCities = CityService.getCities;
