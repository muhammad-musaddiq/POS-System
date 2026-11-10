const markdownFiles = import.meta.glob("../../../docs/**/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

export interface HelpDocument {
  path: string;
  title: string;
  category:
    | "Role Guides"
    | "Module Guides"
    | "Workflow Guides"
    | "Tour Guides"
    | "API Reference"
    | "Database Guides"
    | "Architecture Guides"
    | "Common Guides";
  content: string;
}

export const developerDocCategories = [
  "API Reference",
  "Database Guides",
  "Architecture Guides",
  "Common Guides",
] as const satisfies ReadonlyArray<HelpDocument["category"]>;

export type DeveloperDocCategory = (typeof developerDocCategories)[number];

export const isDeveloperDocsEnabled =
  import.meta.env.VITE_ENABLE_DEVELOPER_DOCS === "true";

export function isDeveloperDocument(document: HelpDocument): boolean {
  return developerDocCategories.includes(
    document.category as DeveloperDocCategory,
  );
}

function normalizePath(path: string): string {
  return path.replace("../../../", "/");
}

function titleFromMarkdown(path: string, content: string): string {
  const firstHeading = content
    .split("\n")
    .find((line) => line.startsWith("# "));
  if (firstHeading) {
    return firstHeading.replace("# ", "").trim();
  }
  return (
    path.split("/").pop()?.replace(".md", "").replaceAll("-", " ") ?? "Guide"
  );
}

function categoryForPath(path: string): HelpDocument["category"] {
  if (path.includes("/roles/")) {
    return "Role Guides";
  }
  if (path.includes("/modules/")) {
    return "Module Guides";
  }
  if (path.includes("/workflows/")) {
    return "Workflow Guides";
  }
  if (path.includes("/tours/")) {
    return "Tour Guides";
  }
  if (path.includes("/api/")) {
    return "API Reference";
  }
  if (path.includes("/database/")) {
    return "Database Guides";
  }
  if (path.includes("/architecture/")) {
    return "Architecture Guides";
  }
  return "Common Guides";
}

export const allHelpDocuments: HelpDocument[] = Object.entries(markdownFiles)
  .map(([path, content]) => {
    const normalizedPath = normalizePath(path);
    return {
      path: normalizedPath,
      title: titleFromMarkdown(normalizedPath, content),
      category: categoryForPath(normalizedPath),
      content,
    };
  })
  .sort(
    (left, right) =>
      left.category.localeCompare(right.category) ||
      left.title.localeCompare(right.title),
  );

export const helpDocuments: HelpDocument[] = isDeveloperDocsEnabled
  ? allHelpDocuments
  : allHelpDocuments.filter((document) => !isDeveloperDocument(document));

export function getHelpDocument(
  path: string | null | undefined,
): HelpDocument | undefined {
  if (!path) {
    return undefined;
  }
  return helpDocuments.find((document) => document.path === path);
}

export function getDefaultHelpDocument(): HelpDocument | undefined {
  return (
    getHelpDocument("/docs/workflows/getting-started.md") ?? helpDocuments[0]
  );
}
