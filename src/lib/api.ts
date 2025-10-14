// API service for Ninjacart login
// 📚 Complete API documentation: .cursor/commands/login-api.md

export interface LoginRequest {
  userName: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message?: string;
  data?: any;
  error?: string;
}

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

// Base API configuration
const API_BASE_URL = 'http://direct.ninjacart.in:8080';

// Create a custom error class for API errors
export class ApiError extends Error {
  status?: number;
  code?: string;

  constructor(message: string, status?: number, code?: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
  }
}

// Login API function
// 📚 See .cursor/commands/login-api.md for complete API documentation
export const loginUser = async (credentials: LoginRequest): Promise<LoginResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/user/login`, {
      method: 'POST',
      headers: {
        'Application': 'biFrost',
        'Authorization': 'Basic',
        'Referer': 'http://www.direct.ninjacart.in/',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json;charset=UTF-8',
      },
      body: JSON.stringify(credentials),
    });

    // Check if the response is ok
    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        // If we can't parse the error response, use the default message
      }
      throw new ApiError(errorMessage, response.status);
    }

    // Parse the response
    const data = await response.json();
    
    return {
      success: true,
      data,
      message: 'Login successful'
    };

  } catch (error) {
    // Handle network errors or other issues
    if (error instanceof ApiError) {
      throw error;
    }
    
    // Handle network errors
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new ApiError('Network error: Unable to connect to the server. Please check your internet connection.', 0, 'NETWORK_ERROR');
    }
    
    // Handle other errors
    throw new ApiError(
      error instanceof Error ? error.message : 'An unexpected error occurred',
      0,
      'UNKNOWN_ERROR'
    );
  }
};

// Utility function to check if user is online
export const isOnline = (): boolean => {
  return navigator.onLine;
};

// Utility function to handle offline scenarios
export const handleOfflineError = (): ApiError => {
  return new ApiError('You are currently offline. Please check your internet connection and try again.', 0, 'OFFLINE');
};
