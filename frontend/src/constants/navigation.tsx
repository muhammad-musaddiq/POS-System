export const navigationItems = [
  { key: "/", label: "Home" },
  { key: "/users", label: "Users", permission: "users.read", adminOnly: true },
  { key: "/roles", label: "Roles", permission: "roles.read", adminOnly: true },
  { key: "/settings", label: "Settings", permission: "settings.read" },
  { key: "/help-center", label: "Help Center" },
];
