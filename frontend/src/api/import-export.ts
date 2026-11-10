import { apiClient } from "./client";

export type ImportExportFormat = "csv" | "xlsx";

export interface ImportPreviewRow {
  row_number: number;
  valid: boolean;
  data: Record<string, unknown>;
  errors: string[];
}

export interface ImportPreviewResponse {
  module: string;
  total_rows: number;
  valid_rows: number;
  invalid_rows: number;
  rows: ImportPreviewRow[];
}

export interface ImportResultResponse {
  module: string;
  total_rows: number;
  imported_rows: number;
  failed_rows: number;
  errors: ImportPreviewRow[];
}

function downloadBlob(data: BlobPart, filename: string, contentType: string) {
  const blob = new Blob([data], { type: contentType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function filenameFromDisposition(
  disposition: string | undefined,
  fallback: string,
) {
  const match = disposition?.match(/filename="?(?<filename>[^";]+)"?/);
  return match?.groups?.filename || fallback;
}

function headerValue(value: unknown): string | undefined {
  if (typeof value === "string") {
    return value;
  }
  return undefined;
}

export async function downloadImportSample(
  moduleKey: string,
  format: ImportExportFormat,
) {
  const response = await apiClient.get<ArrayBuffer>(
    `/import-export/${moduleKey}/sample`,
    {
      params: { format },
      responseType: "arraybuffer",
    },
  );
  downloadBlob(
    response.data,
    filenameFromDisposition(
      headerValue(response.headers["content-disposition"]),
      `${moduleKey}-sample.${format}`,
    ),
    headerValue(response.headers["content-type"]) || "application/octet-stream",
  );
}

export async function exportModuleData(
  moduleKey: string,
  format: ImportExportFormat,
  filters?: Record<string, unknown>,
) {
  const response = await apiClient.get<ArrayBuffer>(
    `/import-export/${moduleKey}/export`,
    {
      params: { format, ...filters },
      responseType: "arraybuffer",
    },
  );
  downloadBlob(
    response.data,
    filenameFromDisposition(
      headerValue(response.headers["content-disposition"]),
      `${moduleKey}-export.${format}`,
    ),
    headerValue(response.headers["content-type"]) || "application/octet-stream",
  );
}

export async function previewImport(moduleKey: string, file: File) {
  const payload = new FormData();
  payload.append("file", file);
  const response = await apiClient.post<ImportPreviewResponse>(
    `/import-export/${moduleKey}/import-preview`,
    payload,
    { headers: { "Content-Type": "multipart/form-data" } },
  );
  return response.data;
}

export async function confirmImport(moduleKey: string, file: File) {
  const payload = new FormData();
  payload.append("file", file);
  const response = await apiClient.post<ImportResultResponse>(
    `/import-export/${moduleKey}/import`,
    payload,
    { headers: { "Content-Type": "multipart/form-data" } },
  );
  return response.data;
}

export async function downloadImportErrorReport(
  moduleKey: string,
  rows: ImportPreviewRow[],
  format: ImportExportFormat,
) {
  const response = await apiClient.post<ArrayBuffer>(
    `/import-export/${moduleKey}/error-report`,
    { rows },
    {
      params: { format },
      responseType: "arraybuffer",
    },
  );
  downloadBlob(
    response.data,
    filenameFromDisposition(
      headerValue(response.headers["content-disposition"]),
      `${moduleKey}-import-errors.${format}`,
    ),
    headerValue(response.headers["content-type"]) || "application/octet-stream",
  );
}
