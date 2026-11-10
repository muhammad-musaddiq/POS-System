const TOUR_STORAGE_PREFIX = "pos-tour-completed";

export function tourCompletionKey(userId: number, role: string): string {
  return `${TOUR_STORAGE_PREFIX}:${userId}:${role}`;
}

export function isTourCompleted(userId: number, role: string): boolean {
  return (
    window.localStorage.getItem(tourCompletionKey(userId, role)) === "true"
  );
}

export function markTourCompleted(userId: number, role: string): void {
  window.localStorage.setItem(tourCompletionKey(userId, role), "true");
}

export function resetTourCompletion(userId: number, role: string): void {
  window.localStorage.removeItem(tourCompletionKey(userId, role));
}
