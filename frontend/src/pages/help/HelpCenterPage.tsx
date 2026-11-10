import {
  BookOutlined,
  DownloadOutlined,
  FileSearchOutlined,
  PlayCircleOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import {
  Alert,
  Button,
  Card,
  Col,
  Empty,
  Input,
  Row,
  Space,
  Tabs,
  Tag,
  Typography,
} from "antd";
import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { PageContainer, PageHeader } from "../../components/design-system";
import {
  getDefaultHelpDocument,
  getHelpDocument,
  helpDocuments,
  isDeveloperDocsEnabled,
  type HelpDocument,
} from "../../help/documentRegistry";
import { extractToc, MarkdownDocument } from "../../help/MarkdownDocument";
import { useTour } from "../../tours/useTour";

const categoryOrder = [
  "Role Guides",
  "Module Guides",
  "Workflow Guides",
  "Tour Guides",
  "API Reference",
  "Database Guides",
  "Architecture Guides",
  "Common Guides",
] as const;

const publicCategoryOrder = categoryOrder.filter(
  (category) =>
    ![
      "API Reference",
      "Database Guides",
      "Architecture Guides",
      "Common Guides",
    ].includes(category),
) as ReadonlyArray<HelpDocument["category"]>;

export function HelpCenterPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { documentationPath, startTour } = useTour();
  const [query, setQuery] = useState("");
  const requestedDocument = getHelpDocument(searchParams.get("doc"));
  const activeDocument =
    requestedDocument ??
    getHelpDocument(documentationPath) ??
    getDefaultHelpDocument();

  const filteredDocuments = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
      return helpDocuments;
    }
    return helpDocuments.filter(
      (document) =>
        document.title.toLowerCase().includes(normalized) ||
        document.content.toLowerCase().includes(normalized) ||
        document.category.toLowerCase().includes(normalized),
    );
  }, [query]);

  const activeIndex = activeDocument
    ? helpDocuments.findIndex(
        (document) => document.path === activeDocument.path,
      )
    : -1;
  const previousDocument =
    activeIndex > 0 ? helpDocuments[activeIndex - 1] : undefined;
  const nextDocument =
    activeIndex >= 0 && activeIndex < helpDocuments.length - 1
      ? helpDocuments[activeIndex + 1]
      : undefined;
  const toc = activeDocument ? extractToc(activeDocument.content) : [];

  const openDocument = (path: string) => {
    setSearchParams({ doc: path });
  };

  const visibleCategories = isDeveloperDocsEnabled
    ? categoryOrder
    : publicCategoryOrder;
  const groupedDocuments = visibleCategories.map((category) => ({
    key: category,
    label: category,
    children: (
      <ul className="m-0 list-none divide-y divide-slate-100 p-0">
        {filteredDocuments.filter((document) => document.category === category).length === 0 && (
          <li className="py-4 text-center text-slate-500">No matching documents</li>
        )}
        {filteredDocuments.filter((document) => document.category === category).map((document) => (
          <li key={document.path} className="py-1">
            <button
              type="button"
              className={`w-full rounded-md px-3 py-2 text-left text-sm ${
                activeDocument?.path === document.path
                  ? "bg-blue-50 font-semibold text-blue-700"
                  : "text-slate-700 hover:bg-slate-50"
              }`}
              onClick={() => openDocument(document.path)}
            >
              {document.title}
            </button>
          </li>
        ))}
      </ul>
    ),
  }));

  return (
    <PageContainer width="wide">
      <PageHeader
        title="Help Center"
        subtitle="Role guides, module guides, business rules, FAQs, and onboarding support"
        actions={
          <Space wrap>
            <Button
              icon={<QuestionCircleOutlined />}
              onClick={() => startTour({ manual: true })}
            >
              Start Tour
            </Button>
            <Button
              icon={<BookOutlined />}
              onClick={() =>
                documentationPath && openDocument(documentationPath)
              }
            >
              My Role Guide
            </Button>
            <Button onClick={() => navigate("/")}>Back to Home</Button>
          </Space>
        }
      />

      <Row gutter={[20, 20]}>
        <Col xs={24} lg={7} xl={6}>
          <Card className="sticky top-[72px]">
            <Input
              allowClear
              prefix={<FileSearchOutlined />}
              placeholder="Search guides, modules, rules..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            <Tabs className="mt-4" size="small" items={groupedDocuments} />
          </Card>
        </Col>

        <Col xs={24} lg={12} xl={13}>
          {activeDocument ? (
            <>
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <Space wrap>
                  <Tag color="blue">{activeDocument.category}</Tag>
                  <Typography.Text type="secondary" className="text-sm">
                    Source: {activeDocument.path}
                  </Typography.Text>
                </Space>
                <Space wrap>
                  <Button
                    disabled={!previousDocument}
                    onClick={() =>
                      previousDocument && openDocument(previousDocument.path)
                    }
                  >
                    Previous
                  </Button>
                  <Button
                    disabled={!nextDocument}
                    onClick={() =>
                      nextDocument && openDocument(nextDocument.path)
                    }
                  >
                    Next
                  </Button>
                </Space>
              </div>
              <MarkdownDocument
                content={activeDocument.content}
                searchQuery={query}
              />
            </>
          ) : (
            <Card>
              <Empty description="No help document is available." />
            </Card>
          )}
        </Col>

        <Col xs={24} lg={5}>
          <Card title="Table of contents" className="sticky top-[72px]">
            {toc.length ? (
              <div className="space-y-2">
                {toc.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className="block text-sm text-slate-600 hover:text-blue-600"
                    style={{ paddingLeft: (item.level - 1) * 12 }}
                  >
                    {item.title}
                  </a>
                ))}
              </div>
            ) : (
              <Typography.Text type="secondary">
                No headings found.
              </Typography.Text>
            )}
          </Card>

          <Alert
            className="mt-4"
            type="info"
            showIcon
            title="Future training support"
            description={
              <div className="space-y-2 text-sm">
                <div>
                  <PlayCircleOutlined /> Embedded videos can be added to guides
                  later.
                </div>
                <div>
                  <DownloadOutlined /> PDF export is reserved for a future
                  release.
                </div>
                <div>
                  Screenshot placeholders in docs are ready for visual
                  tutorials.
                </div>
              </div>
            }
          />
        </Col>
      </Row>
    </PageContainer>
  );
}
