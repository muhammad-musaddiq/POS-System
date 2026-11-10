import {
  DeleteOutlined,
  LoadingOutlined,
  PictureOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { App, Button, Space, Typography, Upload } from "antd";
import type { UploadProps } from "antd";

import { ConfirmAction } from "../design-system";

interface ImageUploadFieldProps {
  value?: string | null;
  onChange?: (value: string | null) => void;
  onUpload: (file: File) => Promise<void>;
  accept: string;
  acceptLabel: string;
  maxSizeMb?: number;
  previewAlt: string;
  previewClassName?: string;
  uploading?: boolean;
}

export function ImageUploadField({
  value,
  onChange,
  onUpload,
  accept,
  acceptLabel,
  maxSizeMb = 10,
  previewAlt,
  previewClassName = "max-h-16 max-w-full object-contain",
  uploading = false,
}: ImageUploadFieldProps) {
  const { message } = App.useApp();

  const uploadProps: UploadProps = {
    accept,
    maxCount: 1,
    showUploadList: false,
    disabled: uploading,
    beforeUpload: (file) => {
      const allowedTypes = accept.split(",").map((item) => item.trim());
      if (!allowedTypes.includes(file.type)) {
        message.error(`Unsupported file type. Use ${acceptLabel}.`);
        return Upload.LIST_IGNORE;
      }
      const maxBytes = maxSizeMb * 1024 * 1024;
      if (file.size > maxBytes) {
        message.error(`File must be ${maxSizeMb} MB or smaller.`);
        return Upload.LIST_IGNORE;
      }
      void onUpload(file);
      return Upload.LIST_IGNORE;
    },
  };

  return (
    <div className="space-y-3">
      <div
        className={`flex min-h-28 items-center justify-center rounded-lg border border-dashed border-gray-200 bg-gray-50/80 p-4 ${
          value ? "bg-white" : ""
        }`}
      >
        {uploading ? (
          <div className="flex flex-col items-center gap-2 text-gray-500">
            <LoadingOutlined className="text-2xl" />
            <Typography.Text type="secondary">Uploading…</Typography.Text>
          </div>
        ) : value ? (
          <img src={value} alt={previewAlt} className={previewClassName} />
        ) : (
          <div className="flex flex-col items-center gap-2 text-gray-400">
            <PictureOutlined className="text-3xl" />
            <Typography.Text type="secondary">
              No image uploaded
            </Typography.Text>
          </div>
        )}
      </div>

      <Space wrap>
        <Upload {...uploadProps}>
          <Button icon={<UploadOutlined />} loading={uploading}>
            {value ? "Replace" : "Upload"}
          </Button>
        </Upload>
        {value && (
          <ConfirmAction
            title="Remove image?"
            description="The current image will be removed from this form."
            danger
            onConfirm={() => onChange?.(null)}
          >
            <Button danger icon={<DeleteOutlined />} disabled={uploading}>
              Remove
            </Button>
          </ConfirmAction>
        )}
      </Space>

      <Typography.Text
        type="secondary"
        className="block text-xs leading-relaxed"
      >
        {acceptLabel} · Max {maxSizeMb} MB
      </Typography.Text>
    </div>
  );
}
