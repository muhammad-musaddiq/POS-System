import { Button, Space } from "antd";
import { forwardRef, type ReactNode } from "react";

interface TableActionsProps {
  children: ReactNode;
}

/** Consistent spacing for table row action buttons */
export function TableActions({ children }: TableActionsProps) {
  return (
    <Space size={2} className="app-table-actions">
      {children}
    </Space>
  );
}

interface TableActionButtonProps {
  icon: ReactNode;
  label: string;
  onClick?: () => void;
  danger?: boolean;
}

export const TableActionButton = forwardRef<
  HTMLButtonElement,
  TableActionButtonProps
>(({ icon, label, onClick, danger }, ref) => (
  <Button
    ref={ref}
    type="text"
    size="small"
    className="app-table-action-btn"
    icon={icon}
    danger={danger}
    onClick={onClick}
    aria-label={label}
    title={label}
  />
));

TableActionButton.displayName = "TableActionButton";

/** Standard cell for primary reference links in tables */
export function TablePrimaryCell({
  primary,
  secondary,
  onClick,
}: {
  primary: string;
  secondary?: string;
  onClick?: () => void;
}) {
  return (
    <div className="app-table-primary-cell min-w-0">
      {onClick ? (
        <Button
          type="link"
          className="h-auto max-w-full p-0 font-medium"
          onClick={onClick}
        >
          <span className="truncate">{primary}</span>
        </Button>
      ) : (
        <div className="truncate font-medium text-gray-900">{primary}</div>
      )}
      {secondary && (
        <div className="truncate text-xs text-gray-500">{secondary}</div>
      )}
    </div>
  );
}
