# Authentication API

- POST `/api/v1/auth/login`: JSON `{email,password}`, returns access_token, refresh_token, token_type.
- POST `/api/v1/auth/refresh`: JSON `{refresh_token}`, returns a token pair.
- GET `/api/v1/auth/me`: bearer access token required; returns the active user and active role/permission information.

Invalid credentials/tokens, inactive and deleted users return 401. Refresh tokens cannot authenticate API requests. Frontend retries an authenticated failed request once after refresh; failed refresh clears local credentials.

Swagger: `/docs`. OpenAPI: `/api/v1/openapi.json`. Health: `/api/v1/health`. Request validation errors return 422 with field information; raw request input values are omitted.
