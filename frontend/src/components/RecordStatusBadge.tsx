import type { RecordStatus } from "../types/common";
import { formatStatus } from "../utils/format";
import { StatusTag } from "./StatusTag";

export function RecordStatusBadge({ status }: { status: RecordStatus }) {
  return (
    <StatusTag
      label={formatStatus(status)}
      variant={status === "ACTIVE" ? "success" : "default"}
    />
  );
}
