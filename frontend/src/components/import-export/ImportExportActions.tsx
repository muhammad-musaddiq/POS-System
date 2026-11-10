import { PermissionAction } from "../PermissionAction";
import {
  DownloadOutlined,
  ExportOutlined,
  FileExcelOutlined,
  ImportOutlined,
} from "@ant-design/icons";
import { useQueryClient } from "@tanstack/react-query";
import {
  Alert,
  App,
  Button,
  Dropdown,
  Modal,
  Radio,
  Space,
  Statistic,
  Table,
  Upload,
  type MenuProps,
  type TableProps,
  type UploadFile,
} from "antd";
import { useMemo, useState } from "react";

import {
  confirmImport,
  downloadImportErrorReport,
  downloadImportSample,
  exportModuleData,
  previewImport,
  type ImportExportFormat,
  type ImportPreviewResponse,
  type ImportPreviewRow,
} from "../../api/import-export";
import { getApiErrorMessage } from "../../utils/api-error";

interface ImportExportActionsProps {
  moduleKey: string;
  permissionModule?: string;
  label?: string;
  filters?: object;
  invalidateQueryKeys?: Array<readonly unknown[]>;
}

export function ImportExportActions({
  moduleKey,
  permissionModule = moduleKey,
  label,
  filters,
  invalidateQueryKeys = [],
}: ImportExportActionsProps) {
  const { message } = App.useApp();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [preview, setPreview] = useState<ImportPreviewResponse>();
  const [previewing, setPreviewing] = useState(false);
  const [importing, setImporting] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [sampleFormat, setSampleFormat] = useState<ImportExportFormat>("xlsx");
  const [exportFormat, setExportFormat] = useState<ImportExportFormat>("xlsx");

  const sourceFile = fileList[0]?.originFileObj;
  const invalidRows = useMemo(
    () => preview?.rows.filter((row) => !row.valid) ?? [],
    [preview],
  );

  const resetModal = () => {
    setOpen(false);
    setFileList([]);
    setPreview(undefined);
  };

  const runPreview = async () => {
    if (!sourceFile) {
      message.warning("Choose an Excel or CSV file first");
      return;
    }
    setPreviewing(true);
    try {
      setPreview(await previewImport(moduleKey, sourceFile));
    } catch (error) {
      message.error(getApiErrorMessage(error));
    } finally {
      setPreviewing(false);
    }
  };

  const runImport = async () => {
    if (!sourceFile) {
      message.warning("Choose an Excel or CSV file first");
      return;
    }
    setImporting(true);
    try {
      const result = await confirmImport(moduleKey, sourceFile);
      message.success(
        `Imported ${result.imported_rows} rows. ${result.failed_rows} rows failed validation.`,
      );
      invalidateQueryKeys.forEach((queryKey) => {
        void queryClient.invalidateQueries({ queryKey });
      });
      resetModal();
    } catch (error) {
      message.error(getApiErrorMessage(error));
    } finally {
      setImporting(false);
    }
  };

  const runExport = async (format: ImportExportFormat) => {
    setExportFormat(format);
    setExporting(true);
    try {
      await exportModuleData(
        moduleKey,
        format,
        filters ? { ...filters } : undefined,
      );
    } catch (error) {
      message.error(getApiErrorMessage(error));
    } finally {
      setExporting(false);
    }
  };

  const runSampleDownload = async (format: ImportExportFormat) => {
    setSampleFormat(format);
    try {
      await downloadImportSample(moduleKey, format);
    } catch (error) {
      message.error(getApiErrorMessage(error));
    }
  };

  const downloadErrors = async (format: ImportExportFormat) => {
    try {
      await downloadImportErrorReport(moduleKey, invalidRows, format);
    } catch (error) {
      message.error(getApiErrorMessage(error));
    }
  };

  const exportMenuItems: MenuProps["items"] = [
    { key: "xlsx", label: "Export Excel" },
    { key: "csv", label: "Export CSV" },
  ];

  const sampleMenuItems: MenuProps["items"] = [
    { key: "xlsx", label: "Sample Excel" },
    { key: "csv", label: "Sample CSV" },
  ];

  const columns: TableProps<ImportPreviewRow>["columns"] = [
    { title: "Row", dataIndex: "row_number", width: 80 },
    {
      title: "Status",
      dataIndex: "valid",
      width: 110,
      render: (valid: boolean) => (valid ? "Valid" : "Invalid"),
    },
    {
      title: "Errors",
      dataIndex: "errors",
      width: 260,
      render: (errors: string[]) => errors.join("; ") || "-",
    },
    {
      title: "Preview data",
      dataIndex: "data",
      render: (data: Record<string, unknown>) =>
        Object.entries(data)
          .map(([key, value]) => `${key}: ${value ?? ""}`)
          .join(" | "),
    },
  ];

  return (
    <>
      <Space wrap size={8}>
        <PermissionAction permission={`${permissionModule}.create`}>
          <Button icon={<ImportOutlined />} onClick={() => setOpen(true)}>
            {label ? `Import ${label}` : "Import"}
          </Button>
        </PermissionAction>
        <PermissionAction permission={`${permissionModule}.export`}>
          <Dropdown
            menu={{
              items: exportMenuItems,
              onClick: ({ key }) => void runExport(key as ImportExportFormat),
            }}
          >
            <Button icon={<ExportOutlined />} loading={exporting}>
              {exporting
                ? `Exporting ${exportFormat.toUpperCase()}`
                : label
                  ? `Export ${label}`
                  : "Export"}
            </Button>
          </Dropdown>
        </PermissionAction>
        <PermissionAction permission={`${permissionModule}.read`}>
          <Dropdown
            menu={{
              items: sampleMenuItems,
              onClick: ({ key }) =>
                void runSampleDownload(key as ImportExportFormat),
            }}
          >
            <Button icon={<DownloadOutlined />}>
              {label ? `Sample ${label}` : "Sample"}{" "}
              {sampleFormat.toUpperCase()}
            </Button>
          </Dropdown>
        </PermissionAction>
      </Space>

      <Modal
        title="Import records"
        open={open}
        width={980}
        okText="Confirm import"
        okButtonProps={{ disabled: !preview || preview.valid_rows === 0 }}
        confirmLoading={importing}
        onOk={runImport}
        onCancel={resetModal}
        destroyOnHidden
      >
        <Space direction="vertical" className="w-full" size={16}>
          <Alert
            type="info"
            showIcon
            title="Upload the official sample template as Excel or CSV. The file is validated before any row is saved."
          />
          <Upload.Dragger
            accept=".xlsx,.csv"
            maxCount={1}
            fileList={fileList}
            beforeUpload={() => false}
            onChange={({ fileList: nextFileList }) => {
              setFileList(nextFileList);
              setPreview(undefined);
            }}
          >
            <p className="ant-upload-drag-icon">
              <FileExcelOutlined />
            </p>
            <p className="ant-upload-text">Select or drag an Excel/CSV file</p>
            <p className="ant-upload-hint">
              Maximum file size and row count are enforced by the backend.
            </p>
          </Upload.Dragger>

          <Space wrap>
            <Button
              type="primary"
              onClick={runPreview}
              loading={previewing}
              disabled={!sourceFile}
            >
              Validate & Preview
            </Button>
            {invalidRows.length > 0 && (
              <Radio.Group
                buttonStyle="solid"
                onChange={(event) => void downloadErrors(event.target.value)}
                options={[
                  { value: "xlsx", label: "Error Excel" },
                  { value: "csv", label: "Error CSV" },
                ]}
              />
            )}
          </Space>

          {preview && (
            <>
              <div className="grid gap-3 md:grid-cols-3">
                <Statistic title="Total rows" value={preview.total_rows} />
                <Statistic
                  title="Valid rows"
                  value={preview.valid_rows}
                  valueStyle={{ color: "#1677ff" }}
                />
                <Statistic
                  title="Invalid rows"
                  value={preview.invalid_rows}
                  valueStyle={{
                    color: preview.invalid_rows ? "#cf1322" : undefined,
                  }}
                />
              </div>
              <Table
                rowKey="row_number"
                columns={columns}
                dataSource={preview.rows}
                pagination={{ pageSize: 5 }}
                scroll={{ x: 1100 }}
                size="small"
              />
            </>
          )}
        </Space>
      </Modal>
    </>
  );
}
