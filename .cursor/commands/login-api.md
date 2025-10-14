# Login API

## Description
Login API to be used for authenticating users with the Ninjacart system.

## API Endpoint
```
POST http://direct.ninjacart.in:8080/user/login
```

## Headers
```
Application: biFrost
Authorization: Basic
Referer: http://www.direct.ninjacart.in/
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36
Accept: application/json, text/plain, */*
Content-Type: application/json;charset=UTF-8
```

## Request Body
```json
{
  "userName": "NC23550",
  "password": "123Ninja@"
}
```

## Example cURL Command
```bash
curl 'http://direct.ninjacart.in:8080/user/login' \
  -H 'Application: biFrost' \
  -H 'Authorization: Basic' \
  -H 'Referer: http://www.direct.ninjacart.in/' \
  -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36' \
  -H 'Accept: application/json, text/plain, */*' \
  -H 'Content-Type: application/json;charset=UTF-8' \
  --data-raw '{"userName":"NC23550","password":"123Ninja@"}'
```

## Implementation Notes
- Username validation supports NC prefix (auto-added if not provided)
- Minimum 3 characters for username without NC, 5 characters with NC
- Only alphanumeric characters allowed
- Password minimum 6 characters
- API automatically normalizes usernames by adding NC prefix if missing
- Supports remember me functionality with localStorage
- Includes comprehensive error handling for network issues, authentication failures, and server errors

## Response Format
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "jwt-token",
    "user": {
      "id": "123",
      "username": "NC23550"
    }
  }
}
```

## Error Responses
- **401**: Invalid credentials
- **403**: Access denied
- **500**: Server error
- **Network Error**: Connection issues
- **Offline**: No internet connection

## Usage in Code
```typescript
import { loginUser } from '@/lib/api';

const response = await loginUser({
  userName: 'NC23550',
  password: '123Ninja@'
});
```

## Implementation Files
- **API Service**: `src/lib/api.ts` - Contains the loginUser function and TypeScript interfaces
- **Login Page**: `src/pages/Index.tsx` - Main login form component with validation and error handling
- **Test Files**: `cypress/e2e/api-integration.cy.ts` - Comprehensive API integration tests

## Development Notes
- The login page automatically adds NC prefix to usernames if not provided
- All API calls are logged to console for debugging
- Error handling covers network issues, authentication failures, and server errors
- Remember me functionality stores username in localStorage
- Form validation ensures proper username format and password length
