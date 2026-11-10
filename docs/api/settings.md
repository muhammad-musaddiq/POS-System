# Settings API

GET `/api/v1/settings` is available to authenticated users and returns/initializes the singleton settings record. PUT `/api/v1/settings`, POST `/api/v1/settings/logo`, and POST `/api/v1/settings/favicon` require `settings.update`. Asset uploads are multipart form requests with a `file` field.

Settings include app/company identity, theme colors, numeric tone colors, layout spacing, radius, white-label display mode, logo and favicon. Values use Pydantic validation; asset size/type are checked in the service. Uploaded assets are public under `/uploads/settings/`.

POS palette: teal primary `#0F766E`, slate secondary `#334155`, emerald accent `#047857`, dark slate sidebar `#0F172A`, white header and light slate background `#F8FAFC`. Success/positive amounts use emerald, warning uses amber, and errors/negative amounts use red. Backend model/Pydantic defaults and frontend fallback/reset defaults match. Existing installation colors were updated through the authorized settings API; other settings and credentials were preserved. No schema change.
