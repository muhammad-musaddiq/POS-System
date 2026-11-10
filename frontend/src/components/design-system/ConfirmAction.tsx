import { ExclamationCircleOutlined } from "@ant-design/icons";
import { Popconfirm, type PopconfirmProps } from "antd";
import type { ReactNode } from "react";

interface ConfirmActionProps extends Omit<PopconfirmProps, "title"> {
  title: string;
  description?: string;
  children: ReactNode;
  danger?: boolean;
}

export function ConfirmAction({
  title,
  description,
  children,
  danger = false,
  okText = danger ? "Delete" : "Confirm",
  cancelText = "Cancel",
  okButtonProps,
  ...rest
}: ConfirmActionProps) {
  return (
    <Popconfirm
      title={title}
      description={description}
      okText={okText}
      cancelText={cancelText}
      icon={
        <ExclamationCircleOutlined
          className={danger ? "text-red-500" : "text-amber-500"}
        />
      }
      okButtonProps={{ danger, ...okButtonProps }}
      {...rest}
    >
      {children}
    </Popconfirm>
  );
}
