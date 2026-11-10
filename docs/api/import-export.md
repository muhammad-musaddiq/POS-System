# Generic import/export API

All routes require authentication. GET `/api/v1/import-export/modules` lists registered definitions accessible through their read permission. The initial registry is empty and returns `[]`.

For registered module keys: GET `/{key}/sample`, GET `/{key}/export`, POST `/{key}/import-preview`, POST `/{key}/import`, POST `/{key}/error-report`, all relative to `/api/v1/import-export`. Samples require read, export requires export, preview/import/error-report require create permission for the configured permission module. Unknown keys return 404.

CSV and XLSX are supported. Configure maximum rows/file size and allowed formats in the backend environment. See the extension guide before registering a model.
