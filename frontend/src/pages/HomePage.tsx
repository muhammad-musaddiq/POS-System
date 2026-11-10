import { Card, Typography } from "antd";
import { PageContainer, PageHeader } from "../components/design-system";
import { useCurrentUser } from "../hooks/use-auth";
export function HomePage() {
  const { data: user } = useCurrentUser();
  return (
    <PageContainer>
      <PageHeader title="Home" subtitle="Your POS workspace" />
      <Card data-tour-id="workspace">
        <Typography.Title level={3}>
          Welcome, {user?.full_name}
        </Typography.Title>
        <Typography.Paragraph>
          Manage POS users, roles and system settings, or open the Help Center.
        </Typography.Paragraph>
      </Card>
    </PageContainer>
  );
}
