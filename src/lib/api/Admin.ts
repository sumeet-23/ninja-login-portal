// src/lib/api/Admin.ts
// Admin API service for Ninjacart admin authentication

export interface AdminRequest {
  userName: string;
  password: string;
}

export interface AdminResponse {
  id: number;
  employeeId: string;
  createdAt: number;
  createdBy: number;
  verified: number;
  deleted: number;
  externalUserId: string;
  updatedAt: number;
  updatedBy: number;
  userName: string;
  contactNumber: number;
  email: string;
  password: string;
  roles: string;
  appType: string | null;
  gCMRegistrationId: string | null;
  userType: number;
  realmId: string | null;
  userAccessDTO: any;
  languagesKnown: string | null;
  languageKnownNames: string | null;
  asgardUserPropertyMap: {
    id: number;
    fullName: string;
    city: {
      id: number;
      name: string;
      languageId: number;
      stateId: number;
      countryId: number;
      cityType: number;
      b2B: boolean;
    };
    facility: {
      id: number;
      name: string;
      city: {
        id: number;
        name: string;
        languageId: number;
        stateId: number;
        countryId: number;
        cityType: number;
        b2B: boolean;
      };
      facilityType: {
        id: number;
        name: string;
        deleted: number;
      };
      parentFacilityId: number;
      latitude: number;
      longitude: number;
      combinePicknRun: boolean;
      address: string;
      contactNumber: string;
      alternateContactNumber: string;
      deleted: number;
      activeStatus: number;
      clusterId: number;
      facilityTypeGroupId: number;
      initiateClosure: number;
      closureCreation: number;
      shortName: string;
      businessUnit: string;
      bizCluster: string;
      pincode: number;
      areaId: number;
      regionId: number;
      virtualFacility: any;
    };
    localityCluster: any;
    department: any;
    speakEnabled: number;
    deleted: number;
    otpLogin: boolean;
    fCMRegistrationId: string | null;
    faceId: string | null;
    imagePath: string | null;
    faceVerified: number;
    userLevel: string;
    departmentName: string;
    gstin: string | null;
    referralCode: string;
    referredBy: any;
    passwordExpiry: number;
    invalidLoginAttempts: number;
  };
  simSerialNumber: string | null;
  passwordReset: boolean;
  businessPartnerId: any;
  asgardUserTransientDto: any;
  vendorId: any;
  rolesList: string[];
  imei: string | null;
}

export class AdminService {
  private static baseUrl = 'http://direct.ninjacart.in:8080'; // Direct API call for testing
  
  static async adminLoginApi(data: AdminRequest): Promise<AdminResponse> {
    try {
      const apiUrl = `${AdminService.baseUrl}/user/login`;
      console.log('Making Admin API request to:', apiUrl);
      console.log('Request data:', { userName: data.userName, password: '***' });
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Application': 'biFrost',
          'appVersion': '7',
          'Authorization': 'Basic',
          'Referer': 'http://www.direct.ninjacart.in/',
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json;charset=UTF-8'
        },
        body: JSON.stringify(data)
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const responseData = await response.json();
      console.log('Parsed response data:', responseData);
      return responseData;
    } catch (error) {
      console.error('Admin API error:', error);
      throw error;
    }
  }
}

// Export individual functions for convenience
export const adminLoginApi = AdminService.adminLoginApi;
