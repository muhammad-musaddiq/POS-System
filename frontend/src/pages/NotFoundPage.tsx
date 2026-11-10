import { HomeOutlined } from "@ant-design/icons";
import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";

import { PageContainer } from "../components/design-system";

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <PageContainer width="narrow">
      <Result
        status="404"
        title="Page not found"
        subTitle="The requested application page is not available or you may not have access."
        extra={
          <Button
            type="primary"
            icon={<HomeOutlined />}
            onClick={() => navigate("/")}
          >
            Return to dashboard
          </Button>
        }
      />
    </PageContainer>
  );
}
