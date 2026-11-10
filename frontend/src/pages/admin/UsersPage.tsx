import { PermissionAction } from "../../components/PermissionAction";
import {
  DeleteOutlined,
  EditOutlined,
  KeyOutlined,
  PlusOutlined,
  PoweroffOutlined,
} from "@ant-design/icons";
import { App, Button, Form, Input, Modal, Select, type TableProps } from "antd";
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
  truncateCell,
} from "../../components/design-system";
import { RecordStatusBadge } from "../../components/RecordStatusBadge";
import {
  useDeleteUser,
  useResetUserPassword,
  useRoles,
  useSaveUser,
  useUpdateUserStatus,
  useUsers,
} from "../../hooks/use-access-control";
import type {
  ManagedUser,
  UserFilters,
  UserPayload,
} from "../../types/access-control";
import { getApiErrorMessage } from "../../utils/api-error";

const defaultFilters: UserFilters = { page: 1, page_size: 20 };

interface ResetPasswordValues {
  password: string;
}

export function UsersPage() {
  const { message } = App.useApp();
  const [filters, setFilters] = useState<UserFilters>(defaultFilters);
  const [modalOpen, setModalOpen] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<ManagedUser>();
  const [passwordUser, setPasswordUser] = useState<ManagedUser>();
  const [form] = Form.useForm<UserPayload>();
  const [passwordForm] = Form.useForm<ResetPasswordValues>();
  const [filterForm] = Form.useForm<{
    search?: string;
    role_id?: number;
    status?: "ACTIVE" | "INACTIVE";
  }>();
  const usersQuery = useUsers(filters);
  const rolesQuery = useRoles({ page: 1, page_size: 100, status: "ACTIVE" });
  const saveUserMutation = useSaveUser();
  const statusMutation = useUpdateUserStatus();
  const passwordMutation = useResetUserPassword();
  const deleteMutation = useDeleteUser();

  const roleOptions = useMemo(
    () =>
      rolesQuery.data?.items.map((role) => ({
        value: role.id,
        label: role.name,
      })) ?? [],
    [rolesQuery.data?.items],
  );

  const openUser = (user?: ManagedUser) => {
    setEditingUser(user);
    form.setFieldsValue(
      user
        ? {
            name: user.name || user.full_name,
            email: user.email,
            phone: user.phone ?? undefined,
            role_id: user.role_id ?? undefined,
            status: user.status as "ACTIVE" | "INACTIVE",
          }
        : {
            name: "",
            email: "",
            phone: undefined,
            role_id: undefined,
            status: "ACTIVE",
          },
    );
    setModalOpen(true);
  };

  const saveUser = async (values: UserPayload) => {
    try {
      await saveUserMutation.mutateAsync({
        id: editingUser?.id,
        payload: values,
      });
      setModalOpen(false);
      message.success(editingUser ? "User updated" : "User created");
    } catch (error) {
      message.error(getApiErrorMessage(error));
    }
  };

  const openPasswordReset = (user: ManagedUser) => {
    setPasswordUser(user);
    passwordForm.resetFields();
    setPasswordModalOpen(true);
  };

  const resetPassword = async (values: ResetPasswordValues) => {
    if (!passwordUser) {
      return;
    }
    try {
      await passwordMutation.mutateAsync({
        id: passwordUser.id,
        password: values.password,
      });
      setPasswordModalOpen(false);
      message.success("Password reset");
    } catch (error) {
      message.error(getApiErrorMessage(error));
    }
  };

  const columns: TableProps<ManagedUser>["columns"] = [
    {
      title: "Name",
      key: "name",
      render: (_, record) => (
        <TablePrimaryCell
          primary={record.name || record.full_name}
          secondary={`#${record.id}`}
        />
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      ellipsis: true,
      render: (value: string) => truncateCell(value, value),
    },
    {
      title: "Role",
      key: "role",
      render: (_, record) => record.roles[0]?.name || "-",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (value: ManagedUser["status"]) => (
        <RecordStatusBadge status={value as "ACTIVE" | "INACTIVE"} />
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
      width: 144,
      fixed: "right",
      render: (_, record) => (
        <TableActions>
          <PermissionAction permission="users.update">
            <TableActionButton
              icon={<EditOutlined />}
              label="Edit user"
              onClick={() => openUser(record)}
            />
          </PermissionAction>
          <PermissionAction permission="users.update">
            {" "}
            <TableActionButton
              icon={<KeyOutlined />}
              label="Reset password"
              onClick={() => openPasswordReset(record)}
            />
          </PermissionAction>
          <PermissionAction permission="users.update">
            <ConfirmAction
              title={
                record.status === "ACTIVE"
                  ? "Deactivate user?"
                  : "Activate user?"
              }
              onConfirm={async () => {
                try {
                  await statusMutation.mutateAsync({
                    id: record.id,
                    status: record.status === "ACTIVE" ? "INACTIVE" : "ACTIVE",
                  });
                  message.success(
                    record.status === "ACTIVE"
                      ? "User deactivated"
                      : "User activated",
                  );
                } catch (error) {
                  message.error(getApiErrorMessage(error));
                }
              }}
            >
              <TableActionButton
                icon={<PoweroffOutlined />}
                label="Toggle user status"
              />
            </ConfirmAction>
          </PermissionAction>
          <PermissionAction permission="users.delete">
            <ConfirmAction
              title="Delete user?"
              description="The user will be deactivated and hidden from active workflows."
              danger
              onConfirm={async () => {
                try {
                  await deleteMutation.mutateAsync(record.id);
                  message.success("User deleted");
                } catch (error) {
                  message.error(getApiErrorMessage(error));
                }
              }}
            >
              <TableActionButton
                icon={<DeleteOutlined />}
                label="Delete user"
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
        title="Users"
        subtitle="Manage application access, assigned roles, account status, and password resets"
        actions={
          <PermissionAction permission="users.create">
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => openUser()}
            >
              Add user
            </Button>
          </PermissionAction>
        }
      />

      <FilterBar
        name="users-filters"
        form={filterForm}
        onFinish={(values) =>
          setFilters({
            ...defaultFilters,
            search: values.search?.trim() || undefined,
            role_id: values.role_id,
            status: values.status,
          })
        }
        onReset={() => {
          filterForm.resetFields();
          setFilters(defaultFilters);
        }}
        loading={usersQuery.isFetching}
        className="mb-4"
      >
        <FilterField span={2}>
          <Form.Item name="search" label="Search" className="mb-0">
            <Input allowClear placeholder="Name or email" />
          </Form.Item>
        </FilterField>
        <FilterField>
          <Form.Item name="role_id" label="Role" className="mb-0">
            <Select
              allowClear
              options={roleOptions}
              loading={rolesQuery.isFetching}
            />
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
        emptyTitle="No users found"
        rowKey="id"
        columns={columns}
        dataSource={usersQuery.data?.items}
        loading={usersQuery.isPending}
        scroll={{ x: 960 }}
        pagination={buildTablePagination(
          filters,
          usersQuery.data?.total,
          (page, pageSize) =>
            setFilters((current) => ({
              ...current,
              page,
              page_size: pageSize,
            })),
          "users",
        )}
      />

      <Modal
        title={editingUser ? "Edit user" : "Create user"}
        open={modalOpen}
        okText="Save"
        confirmLoading={saveUserMutation.isPending}
        onOk={() => form.submit()}
        onCancel={() => setModalOpen(false)}
        destroyOnHidden
        styles={{ body: { paddingTop: 8 } }}
      >
        <Form
          name="users-editor"
          form={form}
          layout="vertical"
          onFinish={saveUser}
        >
          <div className="grid gap-x-3 md:grid-cols-2">
            <Form.Item name="name" label="Name" rules={[{ required: true }]}>
              <Input maxLength={150} />
            </Form.Item>
            <Form.Item
              name="email"
              label="Email"
              rules={[{ required: true }, { type: "email" }]}
            >
              <Input maxLength={255} />
            </Form.Item>
            <Form.Item name="phone" label="Phone">
              <Input maxLength={50} />
            </Form.Item>
            <Form.Item name="role_id" label="Role" rules={[{ required: true }]}>
              <Select
                showSearch
                optionFilterProp="label"
                options={roleOptions}
                loading={rolesQuery.isFetching}
              />
            </Form.Item>
            {!editingUser && (
              <Form.Item
                name="password"
                label="Password"
                rules={[{ required: true, min: 8 }]}
              >
                <Input.Password maxLength={128} />
              </Form.Item>
            )}
            <Form.Item
              name="status"
              label="Status"
              rules={[{ required: true }]}
            >
              <Select
                options={[
                  { value: "ACTIVE", label: "Active" },
                  { value: "INACTIVE", label: "Inactive" },
                ]}
              />
            </Form.Item>
          </div>
        </Form>
      </Modal>

      <Modal
        title={`Reset password${passwordUser ? `: ${passwordUser.name}` : ""}`}
        open={passwordModalOpen}
        okText="Reset"
        confirmLoading={passwordMutation.isPending}
        onOk={() => passwordForm.submit()}
        onCancel={() => setPasswordModalOpen(false)}
        destroyOnHidden
      >
        <Form
          name="user-password"
          form={passwordForm}
          layout="vertical"
          onFinish={resetPassword}
        >
          <Form.Item
            name="password"
            label="New password"
            rules={[{ required: true, min: 8 }]}
          >
            <Input.Password maxLength={128} />
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
}
