import type { ReactNode } from "react";

import { pageMaxWidths, type PageWidth } from "./tokens";

interface PageContainerProps {
  children: ReactNode;
  width?: PageWidth;
  className?: string;
}

export function PageContainer({
  children,
  width = "default",
  className = "",
}: PageContainerProps) {
  return (
    <div
      className={`app-page-container mx-auto w-full ${className}`}
      style={{ maxWidth: pageMaxWidths[width] }}
    >
      {children}
    </div>
  );
}
