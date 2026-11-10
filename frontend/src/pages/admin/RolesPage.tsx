import { PermissionAction } from "../../components/PermissionAction";
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";
import {
  App,
  Button,
  Checkbox,
  Form,
  Input,
  Modal,
  Select,
  Space,
  Tag,
  type TableProps,
} from "antd";
import dayjs from "dayjs";
import { useMemo, useState } from "react";

import {
  buildTablePagination,
  ConfirmAction,
  DataTableWrapper,
  FilterBar,
  FilterField,
  PageContainer,
  PageHeader,
  TableActionButton,
  TableActions,
  TablePrimaryCell,
} from "../../components/design-system";
import { RecordStatusBadge } from "../../components/RecordStatusBadge";
import {
  useDeleteRole,
  useGroupedPermissions,
  useRoles,
  useSaveRole,
} from "../../hooks/use-access-control";
import { useCurrentUser } from "../../hooks/use-auth";
import type {
  ManagedRole,
  PermissionGroup,
  RoleFilters,
  RolePayload,
} from "../../types/access-control";
import { getApiErrorMessage } from "../../utils/api-error";

const defaultFilters: RoleFilters = { page: 1, page_size: 20 };
const actionColumns = ["read", "create", "update", "delete", "export"];

export function RolesPage() {
  const { message } = App.useApp();
  const [filters, setFilters] = useState<RoleFilters>(defaultFilters);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<ManagedRole>();
  const [permissionIds, setPermissionIdsState] = useState<number[]>([]);
  const [form] = Form.useForm<RolePayload>();
  const [filterForm] = Form.useForm<{
    search?: string;
    status?: "ACTIVE" | "INACTIVE";
  }>();
  const rolesQuery = useRoles(filters);
  const permissionsQuery = useGroupedPermissions();
  const saveMutation = useSaveRole();
  const deleteMutation = useDeleteRole();
  const currentUser = useCurrentUser();
  const isSuperAdmin =
    currentUser.data?.roles.some((role) => role.name === "Super Admin") ??
    false;
  const isSuperAdminRole = editingRole?.name === "Super Admin";
  const isLockedSystemRole = Boolean(
    editingRole?.is_system_role && !isSuperAdmin,
  );
  const matrixDisabled = isSuperAdminRole || isLockedSystemRole;

  const permissionIdSet = useMemo(
    () => new Set(permissionIds),
    [permissionIds],
  );

  const openRole = (role?: ManagedRole) => {
    const rolePermissionIds =
      role?.permissions.map((permission) => permission.id) ?? [];
    setEditingRole(role);
    setPermissionIdsState(rolePermissionIds);
    form.setFieldsValue(
      role
        ? {
            name: role.name,
            description: role.description ?? undefined,
            status: role.status,
            permission_ids: rolePermissionIds,
          }
        : {
            name: "",
            description: undefined,
            status: "ACTIVE",
            permission_ids: [],
          },
    );
    setModalOpen(true);
  };

  const setPermissionIds = (ids: number[]) => {
    const uniqueIds = Array.from(new Set(ids));
    setPermissionIdsState(uniqueIds);
    form.setFieldValue("permission_ids", uniqueIds);
  };

  const togglePermission = (permissionId: number, checked: boolean) => {
    setPermissionIds(
      checked
        ? [...permissionIds, permissionId]
        : permissionIds.filter((id) => id !== permissionId),
    );
  };

  const applyModuleIds = (
    group: PermissionGroup,
    mode: "all" | "clear" | "read",
  ) => {
    const groupIds = group.permissions.map((permission) => permission.id);
    const otherIds = permissionIds.filter((id) => !groupIds.includes(id));
    if (mode === "clear") {
      setPermissionIds(otherIds);
      return;
    }
    const selectedIds =
      mode === "read"
        ? group.permissions
            .filter((permission) => permission.action === "read")
            .map((permission) => permission.id)
        : groupIds;
    setPermissionIds([...otherIds, ...selectedIds]);
  };

  const applyFullAccess = () => {
    setPermissionIds(
      permissionsQuery.data?.flatMap((group) =>
        group.permissions.map((permission) => permission.id),
      ) ?? [],
    );
  };

  const applyReadOnly = () => {
    setPermissionIds(
      permissionsQuery.data?.flatMap((group) =>
        group.permissions
          .filter((permission) => permission.action === "read")
          .map((permission) => permission.id),
      ) ?? [],
    );
  };

  const saveRole = async (values: RolePayload) => {
    try {
      await saveMutation.mutateAsync({
        id: editingRole?.id,
        payload: {
          ...values,
          permission_ids: permissionIds,
        },
      });
      setModalOpen(false);
      message.success(editingRole ? "Role updated" : "Role created");
    } catch (error) {
      message.error(getApiErrorMessage(error));
    }
  };

  const columns: TableProps<ManagedRole>["columns"] = [
    {
      title: "Role",
      key: "role",
      render: (_, record) => (
        <div className="min-w-0">
          <TablePrimaryCell
            primary={record.name}
            secondary={record.description ?? undefined}
          />
          {record.is_system_role && (
            <Tag
              className="mt-1"
              icon={<SafetyCertificateOutlined />}
              color="blue"
            >
              System role
            </Tag>
          )}
        </div>
      ),
    },
    {
      title: "Users",
      dataIndex: "users_count",
      key: "users_count",
      width: 96,
    },
    {
      title: "Permissions",
      dataIndex: "permissions_count",
      key: "permissions_count",
      width: 120,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (value: ManagedRole["status"]) => (
        <RecordStatusBadge status={value} />
      ),
    },
    {
      title: "Created at",
      dataIndex: "created_at",
      key: "created_at",
      render: (value: string) => dayjs(value).format("DD MMM YYYY"),
    },
    {
      title: "Actions",
      key: "actions",
      width: 96,
      fixed: "right",
      render: (_, record) => (
        <TableActions>
          <PermissionAction permission="roles.update">
            <TableActionButton
              icon={<EditOutlined />}
              label="Edit role"
              onClick={() => openRole(record)}
            />
          </PermissionAction>
          <PermissionAction permission="roles.delete">
            <ConfirmAction
              title="Delete role?"
              description="System roles and roles assigned to users cannot be deleted."
              danger
              onConfirm={async () => {
                try {
                  await deleteMutation.mutateAsync(record.id);
                  message.success("Role deleted");
                } catch (error) {
                  message.error(getApiErrorMessage(error));
                }
              }}
            >
              <TableActionButton
                icon={<DeleteOutlined />}
                label="Delete role"
                danger
              />
            </ConfirmAction>
          </PermissionAction>
        </TableActions>
      ),
    },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Roles"
        subtitle="Configure role access with module-level permission presets and protected system roles"
        actions={
          <PermissionAction permission="roles.create">
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => openRole()}
            >
              Add role
            </Button>
          </PermissionAction>
        }
      />

      <FilterBar
        name="roles-filters"
        form={filterForm}
        onFinish={(values) =>
          setFilters({
            ...defaultFilters,
            search: values.search?.trim() || undefined,
            status: values.status,
          })
        }
        onReset={() => {
          filterForm.resetFields();
          setFilters(defaultFilters);
        }}
        loading={rolesQuery.isFetching}
        className="mb-4"
      >
        <FilterField span={2}>
          <Form.Item name="search" label="Search" className="mb-0">
            <Input allowClear placeholder="Role name" />
          </Form.Item>
        </FilterField>
        <FilterField>
          <Form.Item name="status" label="Status" className="mb-0">
            <Select
              allowClear
              options={[
                { value: "ACTIVE", label: "Active" },
                { value: "INACTIVE", label: "Inactive" },
              ]}
            />
          </Form.Item>
        </FilterField>
      </FilterBar>

      <DataTableWrapper
        emptyTitle="No roles found"
        rowKey="id"
        columns={columns}
        dataSource={rolesQuery.data?.items}
        loading={rolesQuery.isPending}
        scroll={{ x: 860 }}
        pagination={buildTablePagination(
          filters,
          rolesQuery.data?.total,
          (page, pageSize) =>
            setFilters((current) => ({
              ...current,
              page,
              page_size: pageSize,
            })),
          "roles",
        )}
      />

      <Modal
        title={editingRole ? "Edit role" : "Create role"}
        open={modalOpen}
        okText="Save"
        width={1080}
        confirmLoading={saveMutation.isPending}
        onOk={() => form.submit()}
        onCancel={() => setModalOpen(false)}
        destroyOnHidden
        styles={{
          body: { maxHeight: "72vh", overflowY: "auto", paddingTop: 8 },
        }}
      >
        <Form
          name="roles-editor"
          form={form}
          layout="vertical"
          onFinish={saveRole}
        >
          <div className="grid gap-x-3 md:grid-cols-2">
            <Form.Item
              name="name"
              label="Role name"
              rules={[{ required: true }]}
            >
              <Input
                maxLength={100}
                disabled={isSuperAdminRole || isLockedSystemRole}
              />
            </Form.Item>
            <Form.Item
              name="status"
              label="Status"
              rules={[{ required: true }]}
            >
              <Select
                disabled={isSuperAdminRole || isLockedSystemRole}
                options={[
                  { value: "ACTIVE", label: "Active" },
                  { value: "INACTIVE", label: "Inactive" },
                ]}
              />
            </Form.Item>
          </div>
          <Form.Item name="description" label="Description">
            <Input.TextArea
              rows={2}
              maxLength={255}
              disabled={isSuperAdminRole || isLockedSystemRole}
            />
          </Form.Item>
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <div className="text-sm font-semibold text-gray-900">
              Permission matrix
            </div>
            <Space wrap>
              <Button
                size="small"
                onClick={applyReadOnly}
                disabled={matrixDisabled}
              >
                Read-only preset
              </Button>
              <Button
                size="small"
                onClick={applyFullAccess}
                disabled={matrixDisabled}
              >
                Full access preset
              </Button>
            </Space>
          </div>

          <div className="space-y-3">
            {permissionsQuery.data?.map((group) => (
              <div
                key={group.module}
                className="rounded border border-gray-200 bg-white"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 px-3 py-2">
                  <div className="font-medium text-gray-900">{group.label}</div>
                  <Space wrap>
                    <Button
                      size="small"
                      onClick={() => applyModuleIds(group, "all")}
                      disabled={matrixDisabled}
                    >
                      Select all
                    </Button>
                    <Button
                      size="small"
                      onClick={() => applyModuleIds(group, "read")}
                      disabled={matrixDisabled}
                    >
                      Read only
                    </Button>
                    <Button
                      size="small"
                      onClick={() => applyModuleIds(group, "clear")}
                      disabled={matrixDisabled}
                    >
                      Clear
                    </Button>
                  </Space>
                </div>
                <div className="grid grid-cols-2 gap-2 px-3 py-3 sm:grid-cols-3 lg:grid-cols-6">
                  {actionColumns.map((action) => {
                    const permission = group.permissions.find(
                      (item) => item.action === action,
                    );
                    return (
                      <Checkbox
                        key={`${group.module}.${action}`}
                        checked={
                          permission
                            ? permissionIdSet.has(permission.id)
                            : false
                        }
                        disabled={!permission || matrixDisabled}
                        onChange={(event) =>
                          permission &&
                          togglePermission(permission.id, event.target.checked)
                        }
                      >
                        <span
                          className={!permission ? "text-gray-400" : undefined}
                        >
                          {action[0].toUpperCase()}
                          {action.slice(1)}
                        </span>
                      </Checkbox>
                    );
                  })}
                </div>
              </div>
            ))}
            {permissionsQuery.isPending && (
              <div className="py-6 text-center text-gray-500">
                Loading permissions...
              </div>
            )}
            {isSuperAdminRole && (
              <div className="rounded border border-blue-100 bg-blue-50 px-3 py-2 text-sm text-blue-800">
                Super Admin has full access and is locked to prevent accidental
                loss of control.
              </div>
            )}
            {isLockedSystemRole && (
              <div className="rounded border border-amber-100 bg-amber-50 px-3 py-2 text-sm text-amber-800">
                Only Super Admin can modify system roles.
              </div>
            )}
          </div>
        </Form>
      </Modal>
    </PageContainer>
  );
}
