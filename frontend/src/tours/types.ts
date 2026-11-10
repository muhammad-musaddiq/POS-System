import type { ReactNode } from "react";

import type { User } from "../types/auth";

export type SupportedTourRole = "Super Admin" | "Admin" | "Viewer";

export type TourLevel =
  | "welcome"
  | "role-overview"
  | "module-overview"
  | "crud-functional"
  | "business-flow"
  | "advanced-action";

export interface RoleTourStep {
  id: string;
  title: string;
  description: ReactNode;
  level: TourLevel;
  module?: string;
  permission?: string;
  permissions?: string[];
}

export interface RoleTour {
  role: SupportedTourRole;
  title: string;
  documentationPath: string;
  overview: string;
  steps: RoleTourStep[];
}

export interface StartTourOptions {
  manual?: boolean;
  level?: TourLevel | "full";
  module?: string;
  currentPath?: string;
}

export interface TourContextValue {
  activeTour: RoleTour | null;
  documentationPath: string | null;
  hasTour: boolean;
  isTourOpen: boolean;
  startTour: (options?: StartTourOptions) => void;
  completeTour: () => void;
  resetTour: () => void;
}

export type TourUser = Pick<User, "id" | "roles"> | undefined;
