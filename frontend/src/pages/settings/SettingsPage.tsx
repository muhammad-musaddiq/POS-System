import { useCurrentUser } from "../../hooks/use-auth";
import { userHasPermission } from "../../utils/permissions";
import { ReloadOutlined, SaveOutlined } from "@ant-design/icons";
import {
  Alert,
  App,
  Button,
  Col,
  Form,
  Input,
  Row,
  Select,
  Switch,
  Typography,
} from "antd";
import { useEffect, useMemo } from "react";

import {
  PageContainer,
  PageHeader,
  PageLoading,
} from "../../components/design-system";
import { ColorPickerField } from "../../components/settings/ColorPickerField";
import { ImageUploadField } from "../../components/settings/ImageUploadField";
import { SettingSection } from "../../components/settings/SettingSection";
import { ThemePreview } from "../../components/settings/ThemePreview";
import {
  useSettings,
  useUpdateSettings,
  useUploadSettingsFavicon,
  useUploadSettingsLogo,
} from "../../hooks/use-settings";
import {
  defaultSettingsTheme,
  financialColorFields,
  getThemeDefaultValues,
  semanticColorFields,
  themeColorFields,
} from "../../theme/settings-theme";
import type { SettingsUpdate } from "../../types/settings";
import { getApiErrorMessage } from "../../utils/api-error";
import { hexColorFormRule } from "../../utils/color";

export function SettingsPage() {
  const currentUser = useCurrentUser();
  const canUpdate = userHasPermission(currentUser.data, "settings.update");
  const [form] = Form.useForm<SettingsUpdate>();
  const { message, modal } = App.useApp();
  const settingsQuery = useSettings();
  const updateSettings = useUpdateSettings();
  const uploadLogo = useUploadSettingsLogo();
  const uploadFavicon = useUploadSettingsFavicon();
  const settings = settingsQuery.data;

  const watchedValues = Form.useWatch([], form);

  const previewValues = useMemo(
    () => ({
      app_name:
        watchedValues?.app_name ??
        settings?.app_name ??
        defaultSettingsTheme.app_name,
      company_name: watchedValues?.company_name ?? settings?.company_name,
      logo_url: watchedValues?.logo_url ?? settings?.logo_url,
      primary_color: watchedValues?.primary_color ?? settings?.primary_color,
      secondary_color:
        watchedValues?.secondary_color ?? settings?.secondary_color,
      accent_color: watchedValues?.accent_color ?? settings?.accent_color,
      sidebar_color: watchedValues?.sidebar_color ?? settings?.sidebar_color,
      header_color: watchedValues?.header_color ?? settings?.header_color,
      background_color:
        watchedValues?.background_color ?? settings?.background_color,
      text_color: watchedValues?.text_color ?? settings?.text_color,
      success_color: watchedValues?.success_color ?? settings?.success_color,
      warning_color: watchedValues?.warning_color ?? settings?.warning_color,
      error_color: watchedValues?.error_color ?? settings?.error_color,
      info_color: watchedValues?.info_color ?? settings?.info_color,
      positive_amount_color:
        watchedValues?.positive_amount_color ?? settings?.positive_amount_color,
      negative_amount_color:
        watchedValues?.negative_amount_color ?? settings?.negative_amount_color,
      warning_amount_color:
        watchedValues?.warning_amount_color ?? settings?.warning_amount_color,
      neutral_amount_color:
        watchedValues?.neutral_amount_color ?? settings?.neutral_amount_color,
      total_amount_color:
        watchedValues?.total_amount_color ?? settings?.total_amount_color,
      border_radius: watchedValues?.border_radius ?? settings?.border_radius,
      layout_spacing: watchedValues?.layout_spacing ?? settings?.layout_spacing,
    }),
    [settings, watchedValues],
  );

  useEffect(() => {
    if (settings) {
      form.setFieldsValue(settings);
    }
  }, [form, settings]);

  const handleSave = async (values: SettingsUpdate) => {
    if (!canUpdate) return;
    try {
      const updated = await updateSettings.mutateAsync(values);
      form.setFieldsValue(updated);
      message.success("Settings saved");
    } catch (error) {
      message.error(getApiErrorMessage(error));
    }
  };

  const handleLogoUpload = async (file: File) => {
    try {
      const updated = await uploadLogo.mutateAsync(file);
      form.setFieldsValue(updated);
      message.success("Logo uploaded");
    } catch (error) {
      message.error(getApiErrorMessage(error));
    }
  };

  const handleFaviconUpload = async (file: File) => {
    try {
      const updated = await uploadFavicon.mutateAsync(file);
      form.setFieldsValue(updated);
      message.success("Favicon uploaded");
    } catch (error) {
      message.error(getApiErrorMessage(error));
    }
  };

  const handleResetTheme = () => {
    modal.confirm({
      title: "Reset theme to defaults?",
      content:
        "Color and layout preferences will revert to the built-in defaults. Save to apply globally.",
      okText: "Reset",
      onOk: () => {
        form.setFieldsValue(getThemeDefaultValues());
        message.info("Theme reset to defaults. Save to apply changes.");
      },
    });
  };

  const brandColorFields = themeColorFields.filter(
    (field) => field.group === "brand",
  );
  const layoutColorFields = themeColorFields.filter(
    (field) => field.group === "layout",
  );

  if (settingsQuery.isPending) {
    return (
      <PageContainer>
        <fieldset disabled={!canUpdate} className="border-0 p-0 m-0 min-w-0">
          <PageLoading rows={10} />
        </fieldset>
      </PageContainer>
    );
  }

  if (settingsQuery.isError) {
    return (
      <PageContainer>
        <fieldset disabled={!canUpdate} className="border-0 p-0 m-0 min-w-0">
          <Alert
            type="error"
            title="Unable to load settings"
            description={getApiErrorMessage(settingsQuery.error)}
          />
        </fieldset>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <fieldset disabled={!canUpdate} className="border-0 p-0 m-0 min-w-0">
        <PageHeader
          title="Settings"
          subtitle="Configure company identity, branding, theme colors, and layout preferences."
          actions={
            <>
              <Button icon={<ReloadOutlined />} onClick={handleResetTheme}>
                Reset to Default Theme
              </Button>
              <Button
                type="primary"
                icon={<SaveOutlined />}
                loading={updateSettings.isPending}
                onClick={() => form.submit()}
              >
                Save Settings
              </Button>
            </>
          }
        />

        <Form
          disabled={!canUpdate}
          form={form}
          layout="vertical"
          onFinish={handleSave}
          initialValues={settings}
        >
          <Row gutter={[24, 24]}>
            <Col xs={24} xl={16}>
              <div className="settings-section-stack space-y-5">
                <SettingSection
                  title="General Settings"
                  description="Core company and application identity shown across the application."
                >
                  <Row gutter={[16, 0]}>
                    <Col xs={24} md={12}>
                      <Form.Item
                        name="app_name"
                        label="App name"
                        rules={[{ required: true }]}
                      >
                        <Input
                          maxLength={150}
                          placeholder="POS System"
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item name="company_name" label="Company name">
                        <Input
                          maxLength={200}
                          placeholder="Your organization"
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item
                        name="company_email"
                        label="Company email"
                        rules={[{ type: "email" }]}
                      >
                        <Input
                          maxLength={255}
                          placeholder="contact@company.com"
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item name="company_phone" label="Company phone">
                        <Input maxLength={50} placeholder="+1 (555) 000-0000" />
                      </Form.Item>
                    </Col>
                    <Col span={24}>
                      <Form.Item name="company_address" label="Company address">
                        <Input.TextArea
                          rows={3}
                          maxLength={500}
                          placeholder="Street, city, country"
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </SettingSection>

                <SettingSection
                  title="Branding"
                  description="Upload a logo and favicon for the sidebar, login screen, and browser tab."
                >
                  <Row gutter={[24, 24]}>
                    <Col xs={24} md={12}>
                      <Form.Item name="logo_url" label="Logo" hidden>
                        <Input />
                      </Form.Item>
                      <Typography.Text className="mb-2 block text-sm font-medium">
                        Logo
                      </Typography.Text>
                      <ImageUploadField
                        value={watchedValues?.logo_url ?? settings?.logo_url}
                        uploading={uploadLogo.isPending}
                        accept="image/png,image/jpeg,image/webp"
                        acceptLabel="PNG, JPG, or WebP"
                        previewAlt="Logo preview"
                        onUpload={handleLogoUpload}
                        onChange={(url) => form.setFieldValue("logo_url", url)}
                      />
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item name="favicon_url" label="Favicon" hidden>
                        <Input />
                      </Form.Item>
                      <Typography.Text className="mb-2 block text-sm font-medium">
                        Favicon
                      </Typography.Text>
                      <ImageUploadField
                        value={
                          watchedValues?.favicon_url ?? settings?.favicon_url
                        }
                        uploading={uploadFavicon.isPending}
                        accept="image/png,image/jpeg,image/webp,image/x-icon,image/vnd.microsoft.icon"
                        acceptLabel="PNG, JPG, WebP, or ICO"
                        previewAlt="Favicon preview"
                        previewClassName="size-12 object-contain"
                        onUpload={handleFaviconUpload}
                        onChange={(url) =>
                          form.setFieldValue("favicon_url", url)
                        }
                      />
                    </Col>
                  </Row>
                </SettingSection>

                <SettingSection
                  title="Theme Colors"
                  description="Brand and layout colors applied through Ant Design tokens across the app."
                >
                  <Typography.Text className="mb-3 block text-xs font-medium tracking-wide text-gray-500 uppercase">
                    Brand colors
                  </Typography.Text>
                  <Row gutter={[16, 8]} className="mb-4">
                    {brandColorFields.map((field) => (
                      <Col xs={24} sm={12} key={field.name}>
                        <Form.Item
                          name={field.name}
                          label={field.label}
                          rules={[hexColorFormRule]}
                        >
                          <ColorPickerField
                            defaultColor={defaultSettingsTheme[field.name]}
                          />
                        </Form.Item>
                      </Col>
                    ))}
                  </Row>
                  <Typography.Text className="mb-3 block text-xs font-medium tracking-wide text-gray-500 uppercase">
                    Layout colors
                  </Typography.Text>
                  <Row gutter={[16, 8]}>
                    {layoutColorFields.map((field) => (
                      <Col xs={24} sm={12} key={field.name}>
                        <Form.Item
                          name={field.name}
                          label={field.label}
                          rules={[hexColorFormRule]}
                        >
                          <ColorPickerField
                            defaultColor={defaultSettingsTheme[field.name]}
                          />
                        </Form.Item>
                      </Col>
                    ))}
                  </Row>
                </SettingSection>

                <SettingSection
                  title="Semantic Colors"
                  description="Status and feedback colors used by badges, alerts, validation, and progress states."
                >
                  <Row gutter={[16, 8]}>
                    {semanticColorFields.map((field) => (
                      <Col xs={24} sm={12} key={field.name}>
                        <Form.Item
                          name={field.name}
                          label={field.label}
                          rules={[hexColorFormRule]}
                        >
                          <ColorPickerField
                            defaultColor={defaultSettingsTheme[field.name]}
                          />
                        </Form.Item>
                      </Col>
                    ))}
                  </Row>
                </SettingSection>

                <SettingSection
                  title="Financial Colors"
                  description="Amount colors used by currency, numeric, totals, balances, and warning amounts."
                >
                  <Row gutter={[16, 8]}>
                    {financialColorFields.map((field) => (
                      <Col xs={24} sm={12} key={field.name}>
                        <Form.Item
                          name={field.name}
                          label={field.label}
                          rules={[hexColorFormRule]}
                        >
                          <ColorPickerField
                            defaultColor={defaultSettingsTheme[field.name]}
                          />
                        </Form.Item>
                      </Col>
                    ))}
                  </Row>
                </SettingSection>

                <SettingSection
                  title="Layout & Spacing"
                  description="Control content density and corner rounding for cards, inputs, and buttons."
                >
                  <Row gutter={[16, 0]}>
                    <Col xs={24} md={12}>
                      <Form.Item
                        name="layout_spacing"
                        label="Layout spacing"
                        rules={[{ required: true }]}
                      >
                        <Select
                          options={[
                            {
                              value: "compact",
                              label: "Compact — tighter page padding",
                            },
                            {
                              value: "comfortable",
                              label: "Comfortable — balanced spacing",
                            },
                            {
                              value: "spacious",
                              label: "Spacious — extra breathing room",
                            },
                          ]}
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item
                        name="border_radius"
                        label="Border radius"
                        rules={[{ required: true }]}
                      >
                        <Select
                          options={[
                            { value: "none", label: "None — square corners" },
                            {
                              value: "small",
                              label: "Small — subtle rounding",
                            },
                            { value: "medium", label: "Medium — default" },
                            { value: "large", label: "Large — soft corners" },
                          ]}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </SettingSection>

                <SettingSection
                  title="White Label"
                  description="Enable white-label mode to hide default application branding in customer-facing areas."
                >
                  <Form.Item
                    name="white_label_enabled"
                    valuePropName="checked"
                    label="White-label mode"
                    className="mb-0!"
                  >
                    <Switch
                      checkedChildren="Enabled"
                      unCheckedChildren="Disabled"
                    />
                  </Form.Item>
                </SettingSection>
              </div>
            </Col>

            <Col xs={24} xl={8}>
              <div className="xl:sticky xl:top-4">
                <SettingSection
                  title="Live Preview"
                  description="Updates as you edit. Save settings to apply across the application."
                >
                  <div className="max-w-full overflow-hidden">
                    <ThemePreview values={previewValues} />
                  </div>
                </SettingSection>
              </div>
            </Col>
          </Row>
        </Form>
      </fieldset>
    </PageContainer>
  );
}
