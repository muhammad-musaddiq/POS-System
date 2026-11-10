import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Tour, type TourProps } from "antd";
import { useLocation, useNavigate } from "react-router-dom";

import { useCurrentUser } from "../hooks/use-auth";
import { getPermittedTourSteps, getTourForUser } from "./permissions";
import {
  isTourCompleted,
  markTourCompleted,
  resetTourCompletion,
} from "./tourStorage";
import type {
  RoleTour,
  RoleTourStep,
  StartTourOptions,
  TourContextValue,
} from "./types";

export const TourContext = createContext<TourContextValue | null>(null);

interface TourProviderProps {
  children: ReactNode;
}

function targetForStep(step: RoleTourStep): HTMLElement | null {
  const directTarget = document.querySelector(`[data-tour-id="${step.id}"]`);
  if (directTarget instanceof HTMLElement) {
    return directTarget;
  }
  if (step.id.startsWith("nav-")) {
    const sidebarTarget = document.querySelector(
      '[data-tour-id="sidebar-navigation"]',
    );
    return sidebarTarget instanceof HTMLElement ? sidebarTarget : null;
  }
  return null;
}

function buildAntTourSteps(steps: RoleTourStep[]): TourProps["steps"] {
  return steps.map((step) => ({
    title: step.title,
    description: step.description,
    target: () => targetForStep(step) ?? document.body,
  }));
}

export function resolveTourModuleFromPath(
  pathname: string,
): string | undefined {
  const normalizedPath = pathname.replace(/\/+$/, "") || "/";
  const routeMap: Array<[string, string]> = [
    ["/users", "users"],
    ["/roles", "roles"],
    ["/settings", "settings"],
  ];

  return routeMap.find(
    ([prefix]) =>
      normalizedPath === prefix || normalizedPath.startsWith(`${prefix}/`),
  )?.[1];
}

export function TourProvider({ children }: TourProviderProps) {
  const { data: user } = useCurrentUser();
  const location = useLocation();
  const navigate = useNavigate();
  const [isTourOpen, setIsTourOpen] = useState(false);
  const [activeTour, setActiveTour] = useState<RoleTour | null>(null);
  const [tourSteps, setTourSteps] = useState<RoleTourStep[]>([]);
  const autoStartedKeyRef = useRef<string | null>(null);

  const userTour = useMemo(() => getTourForUser(user), [user]);
  const documentationPath = userTour?.documentationPath ?? null;

  const completeTour = useCallback(() => {
    if (user && activeTour) {
      markTourCompleted(user.id, activeTour.role);
    }
    setIsTourOpen(false);
  }, [activeTour, user]);

  const startTour = useCallback(
    (options: StartTourOptions = {}) => {
      if (!user || !userTour) {
        return;
      }

      const requestedModule =
        options.level === "full"
          ? options.module
          : (options.module ??
            resolveTourModuleFromPath(
              options.currentPath ?? location.pathname,
            ));
      const scopedOptions: StartTourOptions = {
        ...options,
        module: requestedModule,
      };
      let permittedSteps = getPermittedTourSteps(user, userTour, scopedOptions);

      if (!permittedSteps.length && scopedOptions.module) {
        permittedSteps = getPermittedTourSteps(user, userTour, {
          ...scopedOptions,
          module: undefined,
        });
      }

      if (
        !permittedSteps.length &&
        scopedOptions.level &&
        scopedOptions.level !== "full"
      ) {
        permittedSteps = getPermittedTourSteps(user, userTour, {
          ...scopedOptions,
          level: "full",
          module: undefined,
        });
      }

      if (!permittedSteps.length) {
        return;
      }

      setActiveTour(userTour);
      setTourSteps(permittedSteps);

      if (!requestedModule && location.pathname !== "/") {
        navigate("/");
      }

      window.setTimeout(() => setIsTourOpen(true), 120);
    },
    [location.pathname, navigate, user, userTour],
  );

  const resetTour = useCallback(() => {
    if (!user || !userTour) {
      return;
    }
    resetTourCompletion(user.id, userTour.role);
    startTour();
  }, [startTour, user, userTour]);

  useEffect(() => {
    if (!user || !userTour) {
      return;
    }

    const autoStartKey = `${user.id}:${userTour.role}`;
    if (autoStartedKeyRef.current === autoStartKey) {
      return;
    }
    if (isTourCompleted(user.id, userTour.role)) {
      return;
    }

    autoStartedKeyRef.current = autoStartKey;
    // Tours start explicitly from the header to avoid interrupting sign-in.
  }, [startTour, user, userTour]);

  const value = useMemo<TourContextValue>(
    () => ({
      activeTour: userTour,
      documentationPath,
      hasTour: Boolean(userTour),
      isTourOpen,
      startTour,
      completeTour,
      resetTour,
    }),
    [
      completeTour,
      documentationPath,
      isTourOpen,
      resetTour,
      startTour,
      userTour,
    ],
  );

  return (
    <TourContext.Provider value={value}>
      {children}
      <Tour
        open={isTourOpen}
        steps={buildAntTourSteps(tourSteps)}
        onClose={completeTour}
        onFinish={completeTour}
      />
    </TourContext.Provider>
  );
}
