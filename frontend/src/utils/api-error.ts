import axios from "axios";

import type { ApiErrorEnvelope } from "../types/api";

export function getApiErrorMessage(error: unknown): string {
  if (!axios.isAxiosError<ApiErrorEnvelope>(error)) {
    return "Something went wrong. Please try again.";
  }

  const payload = error.response?.data;
  if (payload?.error?.message) {
    return payload.error.message;
  }
  if (typeof payload?.detail === "string") {
    return payload.detail;
  }
  if (payload?.validation_errors?.[0]?.message) {
    return payload.validation_errors[0].message;
  }
  return error.message || "Unable to complete the request.";
}
