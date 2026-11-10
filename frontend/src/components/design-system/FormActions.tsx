import { Button, Space } from "antd";

interface FormActionsProps {
  onCancel?: () => void;
  submitLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  disabled?: boolean;
}

/** Standard sticky-style form footer actions */
export function FormActions({
  onCancel,
  submitLabel = "Save",
  cancelLabel = "Cancel",
  loading,
  disabled,
}: FormActionsProps) {
  return (
    <div className="app-form-actions mt-5 flex flex-wrap items-center justify-end gap-3 border-t border-gray-100 pt-4">
      <Space>
        {onCancel && <Button onClick={onCancel}>{cancelLabel}</Button>}
        <Button
          type="primary"
          htmlType="submit"
          loading={loading}
          disabled={disabled}
        >
          {submitLabel}
        </Button>
      </Space>
    </div>
  );
}
