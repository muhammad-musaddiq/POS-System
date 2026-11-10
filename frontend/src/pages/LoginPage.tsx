import { Alert, Button, Form, Input, Typography } from "antd";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { AppLogo } from "../components/AppLogo";
import { useLogin } from "../hooks/use-auth";
import { authStorage } from "../utils/auth-storage";
import { getApiErrorMessage } from "../utils/api-error";
import type { LoginRequest } from "../types/auth";
export function LoginPage() {
  const login = useLogin();
  const navigate = useNavigate();
  const location = useLocation();
  if (authStorage.getToken()) return <Navigate to="/" replace />;
  return (
    <div className="app-auth-card">
      <AppLogo />
      <Typography.Title level={2}>Sign in to POS System</Typography.Title>
      {login.isError && (
        <Alert
          type="error"
          title="Unable to sign in"
          description={getApiErrorMessage(login.error)}
        />
      )}
      <Form<LoginRequest>
        layout="vertical"
        onFinish={async (values) => {
          try {
            await login.mutateAsync(values);
            navigate(location.state?.from || "/", { replace: true });
          } catch {
            /* Display mutation error above. */
          }
        }}
      >
        <Form.Item
          name="email"
          label="Email address"
          rules={[{ required: true }, { type: "email" }]}
        >
          <Input autoComplete="email" />
        </Form.Item>
        <Form.Item
          name="password"
          label="Password"
          rules={[{ required: true }]}
        >
          <Input.Password autoComplete="current-password" />
        </Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          block
          loading={login.isPending}
        >
          Sign in
        </Button>
      </Form>
    </div>
  );
}
