import { roleTours, supportedTourRoles } from "./roleTours";
import type {
  RoleTour,
  RoleTourStep,
  StartTourOptions,
  SupportedTourRole,
  TourUser,
} from "./types";

function userPermissionCodes(user: TourUser): Set<string> {
  const codes = new Set<string>();
  user?.roles.forEach((role) => {
    role.permissions.forEach((permission) => codes.add(permission.code));
  });
  return codes;
}

export function resolveTourRole(user: TourUser): SupportedTourRole | null {
  if (!user) {
    return null;
  }

  const roleNames = user.roles.map((role) => role.name);
  return supportedTourRoles.find((role) => roleNames.includes(role)) ?? null;
}

export function getTourForUser(user: TourUser): RoleTour | null {
  const role = resolveTourRole(user);
  return role ? roleTours[role] : null;
}

export function userCanSeeTourStep(
  user: TourUser,
  step: RoleTourStep,
): boolean {
  const permissionCodes = userPermissionCodes(user);

  if (step.permission && !permissionCodes.has(step.permission)) {
    return false;
  }
  if (
    step.permissions?.length &&
    !step.permissions.some((permission) => permissionCodes.has(permission))
  ) {
    return false;
  }
  return true;
}

export function getPermittedTourSteps(
  user: TourUser,
  tour: RoleTour,
  options: StartTourOptions = {},
): RoleTourStep[] {
  return tour.steps.filter((step) => {
    if (!userCanSeeTourStep(user, step)) {
      return false;
    }
    if (
      options.level &&
      options.level !== "full" &&
      step.level !== options.level
    ) {
      return false;
    }
    if (options.module && step.module !== options.module) {
      return false;
    }
    return true;
  });
}
