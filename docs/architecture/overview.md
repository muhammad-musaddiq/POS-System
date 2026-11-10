# Architecture

The backend keeps `api/v1/routes -> services -> repositories -> models` with schemas at the API boundary. `app/core` owns environment configuration, JWT/password helpers and structured exception responses. `app/db/base.py` registers only foundation models. SQLAlchemy sessions are request scoped; services commit mutations.

The React entry point wraps routes in React Query and the settings theme provider. Authentication hooks use the shared Axios client, which adds bearer tokens and shares one in-flight refresh across failed requests. ProtectedRoute checks the current user; PermissionRoute applies permission checks and the existing administrative role requirement. PermissionAction hides unauthorized action controls.

The frontend documentation registry reads only `docs/` relative to the frontend source. User-facing guides are shown by default; API/database/architecture/common guides require `VITE_ENABLE_DEVELOPER_DOCS=true` at build time. This is a UI filter, not a confidentiality boundary; never put secrets in Markdown.

Uploads are local filesystem assets mounted at `/uploads`. Settings image upload validates type and size. Audit/status-history services are opt-in extension points. The generic spreadsheet registry is empty until a module is added.
