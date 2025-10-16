# New API Integration Template

## Description
Generates a standardized API integration template for new API endpoints.

## Author
Sumeet Kumar

## Tags
api, integration, documentation, template

---

You are helping to create a new API integration in our project.  
Please collect and output all the following fields in a structured way.

## 🧩 Integration Template

**BaseURL:**  
- QA: `{{QA_BASE_URL}}`  
- PROD: `{{PROD_BASE_URL}}`

**APIEntity:**  
Describe the main entity or feature this API belongs to (e.g., `PurchaseOrder`, `UserAuth`, `ProductDetails`).

**Sample Request:**  
Show a real JSON example or cURL request for this API, including endpoint, method, headers, and body.

**Sample Response:**  
Provide a realistic example JSON response.

**Page/Component to Integrate:**  
Specify the React or backend file/component where this integration will occur (e.g., `PurchaseOrderPage.tsx` or `services/orderService.ts`).

**AdditionalComponent:**  
List any additional components, modals, or helper hooks/services involved in this integration.

**Additional Details:**  
Include edge cases, timeout or retry logic, header requirements (like JWT tokens), or notes about multipart/form-data.

---

## 💡 Instructions for Cursor AI:

- Ask the user for each field interactively (BaseURL, APIEntity, Sample request, etc.).
- **CRITICAL**: If ANY required field is missing or empty, STOP and ask the user to provide that specific field.
- **DO NOT proceed with integration** until ALL required fields are provided.
- Once all information is gathered, output the full filled-out template.
- Ensure the BaseURL is referenced from environment variables (e.g., `process.env.REACT_APP_API_BASE_URL_QA`, etc.).
- Maintain consistent Markdown formatting and code blocks for requests/responses.

## ⚠️ Required Fields Validation

**MANDATORY FIELDS** (Integration will NOT proceed without these):
- ✅ **BaseURL** (both QA and PROD)
- ✅ **APIEntity** (main entity name)
- ✅ **Sample Request** (complete request example)
- ✅ **Sample Response** (complete response example)
- ✅ **Page/Component to Integrate** (target file path)
- ✅ **Additional Details** (error handling, headers, etc.)

**OPTIONAL FIELDS** (can be empty):
- 🔄 **AdditionalComponent** (can be "None" or "N/A")

## 🚫 Integration Blocking Rules

**STOP and ask for missing field if:**
- BaseURL is empty or contains only `{{QA_BASE_URL}}` placeholder
- APIEntity is empty or generic (like "API" or "Endpoint")
- Sample Request is missing or incomplete
- Sample Response is missing or incomplete
- Page/Component path is empty or invalid
- Additional Details are missing (must include at least basic error handling)

**Example validation message:**
```
❌ INTEGRATION BLOCKED: Missing required field "Sample Request"
Please provide a complete JSON example or cURL request for this API, including:
- Endpoint URL
- HTTP method (GET, POST, PUT, DELETE)
- Required headers
- Request body (if applicable)

Without this information, I cannot proceed with the integration.
```

## ✅ Pre-Integration Validation Checklist

Before proceeding with any API integration, verify ALL of the following:

### **Required Information Checklist:**
- [ ] **BaseURL**: Both QA and PROD URLs provided (not placeholders)
- [ ] **APIEntity**: Specific entity name (e.g., "UserProfile", "OrderManagement")
- [ ] **Sample Request**: Complete example with method, headers, body
- [ ] **Sample Response**: Realistic success response example
- [ ] **Page/Component**: Valid file path (e.g., "src/pages/UserProfile.tsx")
- [ ] **Additional Details**: At minimum includes error handling approach

### **Quality Validation:**
- [ ] **BaseURL**: Contains actual URLs, not `{{QA_BASE_URL}}` placeholders
- [ ] **APIEntity**: Descriptive name, not generic terms like "API" or "Endpoint"
- [ ] **Sample Request**: Includes all required headers, proper JSON structure
- [ ] **Sample Response**: Shows expected data structure, not just `{success: true}`
- [ ] **Page/Component**: Valid file path that exists or will be created
- [ ] **Additional Details**: Includes error handling, authentication, or special requirements

### **Integration Blocking Conditions:**
```
❌ BLOCKED: BaseURL contains placeholder text
❌ BLOCKED: APIEntity is too generic or empty
❌ BLOCKED: Sample Request is incomplete or missing
❌ BLOCKED: Sample Response is missing or unrealistic
❌ BLOCKED: Page/Component path is invalid or empty
❌ BLOCKED: Additional Details missing error handling info
```

## 📋 Standard Integration Checklist

### 1. **API Service Setup**
- [ ] Create dedicated service file: `src/lib/api/{{APIEntity}}.ts`
- [ ] Create TypeScript interfaces for request/response
- [ ] Implement service class with static methods
- [ ] Add error handling (network, HTTP, validation)
- [ ] Implement retry logic if needed
- [ ] Add loading states and timeout handling
- [ ] Export individual functions for convenience

### 2. **Component Integration**
- [ ] Add API call to component
- [ ] Implement error handling UI
- [ ] Add loading states
- [ ] Handle success/error responses

### 3. **Testing**
- [ ] Create Cypress tests for API integration
- [ ] Add unit tests for API service
- [ ] Test error scenarios
- [ ] Test loading states

### 4. **Documentation**
- [ ] Update API documentation
- [ ] Add usage examples
- [ ] Document error codes
- [ ] Add troubleshooting guide

### 5. **Environment Setup**
- [ ] Add environment variables
- [ ] Configure different environments (QA/PROD)
- [ ] Update .env.example
- [ ] Document environment setup

## 📁 Service File Structure

### **Entity-Based Service Files**
Each new API entity gets its own dedicated service file following this structure:

```
src/lib/api/
├── {{APIEntity}}.ts          # Main service file (PascalCase)
├── {{APIEntity}}Types.ts     # Type definitions (optional)
└── {{APIEntity}}Utils.ts     # Utility functions (optional)
```

### **File Naming Convention**
- **Service File**: `{{APIEntity}}.ts` (PascalCase)
- **Examples**: 
  - `UserProfile.ts`
  - `OrderManagement.ts`
  - `ProductCatalog.ts`
  - `PaymentProcessing.ts`

### **Service File Structure**
```typescript
// src/lib/api/{{APIEntity}}.ts
export interface {{APIEntity}}Request { }
export interface {{APIEntity}}Response { }
export class {{APIEntity}}Service { }
export const {{apiEntity}}Api = {{APIEntity}}Service.{{apiEntity}}Api;
```

### **Benefits of Entity-Based Service Files**
- 🎯 **Single Responsibility**: Each service handles one entity
- 🔍 **Easy to Find**: Clear file naming convention
- 🧪 **Better Testing**: Isolated service testing
- 🔄 **Reusability**: Services can be imported anywhere
- 📦 **Modularity**: Easy to maintain and update
- 🚀 **Scalability**: Add new entities without affecting existing ones

## 🔧 Code Templates

### API Service Template
```typescript
// src/lib/api/{{APIEntity}}.ts
// Each entity gets its own dedicated service file
// File naming convention: PascalCase entity name (e.g., UserProfile.ts, OrderManagement.ts)

export interface {{APIEntity}}Request {
  // Define request interface
}

export interface {{APIEntity}}Response {
  // Define response interface
}

export class {{APIEntity}}Service {
  private static baseUrl = process.env.REACT_APP_API_BASE_URL;
  
  static async {{apiEntity}}Api(data: {{APIEntity}}Request): Promise<{{APIEntity}}Response> {
    try {
      const response = await fetch(`${this.baseUrl}/{{endpoint}}`, {
        method: '{{METHOD}}',
        headers: {
          'Content-Type': 'application/json',
          // Add other headers
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('{{APIEntity}} API error:', error);
      throw error;
    }
  }
}

// Export individual functions for convenience
export const {{apiEntity}}Api = {{APIEntity}}Service.{{apiEntity}}Api;
```

### Component Integration Template
```typescript
// In your React component
import { {{apiEntity}}Api, {{APIEntity}}Request } from '@/lib/api/{{APIEntity}}';

const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);

const handle{{APIEntity}} = async (data: {{APIEntity}}Request) => {
  setLoading(true);
  setError(null);
  
  try {
    const result = await {{apiEntity}}Api(data);
    // Handle success
  } catch (err) {
    setError(err instanceof Error ? err.message : 'An error occurred');
  } finally {
    setLoading(false);
  }
};
```

### Cypress Test Template
```typescript
// cypress/e2e/{{apiEntity}}-integration.cy.ts
describe('{{APIEntity}} API Integration', () => {
  beforeEach(() => {
    cy.visit('/{{page}}');
    cy.clearStorage();
  });

  it('should successfully call {{APIEntity}} API', () => {
    cy.intercept('{{METHOD}}', '**/{{endpoint}}', {
      statusCode: 200,
      body: { success: true }
    }).as('{{apiEntity}}Success');

    // Test implementation
    cy.get('[data-cy="{{trigger}}"]').click();
    cy.wait('@{{apiEntity}}Success');
  });

  it('should handle {{APIEntity}} API errors', () => {
    cy.intercept('{{METHOD}}', '**/{{endpoint}}', {
      statusCode: 400,
      body: { error: 'Bad Request' }
    }).as('{{apiEntity}}Error');

    // Test error handling
  });
});
```

## 🌍 Internationalization Support

### Error Messages
```typescript
// Add to locales/en.json and locales/pt.json
{
  "{{apiEntity}}": {
    "success": "{{APIEntity}} completed successfully",
    "error": "Failed to {{action}} {{APIEntity}}",
    "loading": "{{Action}} {{APIEntity}}..."
  }
}
```

### Usage in Components
```typescript
const { t } = useTranslation();
const successMessage = t('{{apiEntity}}.success');
const errorMessage = t('{{apiEntity}}.error');
```

## 📝 Documentation Template

### API Documentation
```markdown
# {{APIEntity}} API

## Endpoint
```
{{METHOD}} {{endpoint}}
```

## Request
```json
{
  "field1": "value1",
  "field2": "value2"
}
```

## Response
```json
{
  "success": true,
  "data": {
    "result": "value"
  }
}
```

## Error Codes
- 400: Bad Request
- 401: Unauthorized
- 500: Internal Server Error
```

## 🚀 Quick Start

1. **Copy the template** and fill in the placeholders
2. **Create the API service** using the TypeScript template
3. **Integrate into component** using the React template
4. **Add tests** using the Cypress template
5. **Update documentation** with the API details
6. **Test in both environments** (QA/PROD)

## 🔍 Example Usage

```bash
# Use this command to generate a new API integration
# Cursor will ask for each field and generate the complete template
```

This template ensures consistent API integration across the project while maintaining high quality standards and comprehensive testing coverage.

## 🛡️ Final Integration Validation

**BEFORE GENERATING ANY CODE OR PROCEEDING WITH INTEGRATION:**

1. **Verify ALL required fields are complete and valid**
2. **Check that no placeholders remain in critical fields**
3. **Ensure Sample Request/Response are realistic and complete**
4. **Confirm Page/Component path is valid**

**If ANY validation fails:**
- ❌ **STOP immediately**
- ❌ **DO NOT generate code**
- ❌ **DO NOT create files**
- ✅ **Ask user to provide missing/complete information**

**Only proceed when ALL validations pass:**
- ✅ All required fields provided
- ✅ No placeholder text in critical fields
- ✅ Realistic and complete examples
- ✅ Valid file paths and entity names

**Remember: Quality over speed. Incomplete integrations cause more problems than they solve.**
