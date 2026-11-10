# Workspace tours

Tours are started manually through the header or Help Center. The provider maps registered roles to neutral workspace steps, filters by module/permission and stores completion per user/role in localStorage. Completion does not grant permissions.

Customize roleTours.ts, the role type and route/module map when extending the app. Use data-tour-id attributes for stable targets. Supported starter roles are Super Admin, Admin and Viewer. Custom roles have no tour until registered.
