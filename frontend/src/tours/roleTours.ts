import type { RoleTour, SupportedTourRole } from "./types";
export const supportedTourRoles: SupportedTourRole[] = [
  "Super Admin",
  "Admin",
  "Viewer",
];
function buildTour(role: SupportedTourRole): RoleTour {
  return {
    role,
    title: "Workspace tour",
    documentationPath: "/docs/tours/workspace.md",
    overview: "Explore your workspace.",
    steps: [
      {
        id: "workspace",
        title: "Welcome",
        description: "Your application starts here.",
        level: "welcome",
      },
      {
        id: "sidebar-navigation",
        title: "Navigation",
        description: "Pages are visible according to your permissions.",
        level: "module-overview",
      },
      {
        id: "sidebar-navigation",
        title: "Settings",
        description: "Customize the application from Settings.",
        level: "advanced-action",
        module: "settings",
        permission: "settings.read",
      },
    ],
  };
}
export const roleTours: Record<SupportedTourRole, RoleTour> = {
  "Super Admin": buildTour("Super Admin"),
  Admin: buildTour("Admin"),
  Viewer: buildTour("Viewer"),
};
