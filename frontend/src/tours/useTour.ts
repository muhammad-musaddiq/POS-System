import { useContext } from "react";

import { TourContext } from "./TourProvider";
import type { TourContextValue } from "./types";

export function useTour(): TourContextValue {
  const value = useContext(TourContext);
  if (!value) {
    throw new Error("useTour must be used inside TourProvider");
  }
  return value;
}
