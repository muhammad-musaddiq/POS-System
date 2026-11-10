# Roles and access

Super Admin: full foundation permissions; can assign dangerous grants and modify protected system roles except the locked Super Admin role. Admin: initially all foundation permissions, with service restrictions on dangerous grants/system role editing. Viewer: settings.read and authenticated Home/Help Center access; no administration or write actions.

Only the configured administrator is seeded. Create additional users in Users and assign an active role. Custom roles receive explicitly selected permissions. User/role administration still requires Admin or Super Admin role membership, matching the retained backend behavior; merely assigning users.read to an ordinary custom role does not open administration.

Routes, navigation and per-action controls use permissions. Backend checks remain authoritative. Users with no active role cannot pass permission checks. System roles cannot be deleted, and a user cannot delete/deactivate their own account or remove their own administrative role.
