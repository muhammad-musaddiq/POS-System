# Administration API

Users: GET/POST `/api/v1/users`, GET/PUT/DELETE `/api/v1/users/{id}`, PATCH `/{id}/status`, PATCH `/{id}/password`.

Roles: GET/POST `/api/v1/roles`, GET/PUT/DELETE `/api/v1/roles/{id}`.

Permissions: GET `/api/v1/permissions`, GET `/api/v1/permissions/grouped`.

Require bearer authentication, the corresponding `users.*`, `roles.*` or `permissions.read` permission, and active Admin/Super Admin role membership. Lists support search, status, page and page_size; users also support role_id. Creates return 201, deletes 204, missing records 404, conflicts 409 and denied actions 403. Deletions are soft. Password hashes are never returned.

System roles are protected; Super Admin permissions are locked, dangerous grants require Super Admin, and assigned active users block role deletion. See OpenAPI for exact schemas.
