import { UndoOutlined } from "@ant-design/icons";
import { Button, Input, Tooltip } from "antd";

import { isValidHexColor, normalizeHexColor } from "../../utils/color";

interface ColorPickerFieldProps {
  value?: string;
  onChange?: (value: string) => void;
  defaultColor: string;
}

export function ColorPickerField({
  value,
  onChange,
  defaultColor,
}: ColorPickerFieldProps) {
  const swatchValue = value && isValidHexColor(value) ? value : defaultColor;
  const isDefault =
    (value ?? defaultColor).toUpperCase() === defaultColor.toUpperCase();

  const handleHexChange = (raw: string) => {
    if (!raw.startsWith("#") && raw.length > 0) {
      onChange?.(`#${raw}`);
      return;
    }
    onChange?.(raw);
  };

  const handleHexBlur = () => {
    if (!value) return;
    const normalized = normalizeHexColor(value);
    if (normalized) {
      onChange?.(normalized);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <label
        className="relative size-10 shrink-0 cursor-pointer overflow-hidden rounded-md border border-gray-200 shadow-sm"
        style={{ backgroundColor: swatchValue }}
        title="Pick color"
      >
        <input
          type="color"
          value={swatchValue}
          className="absolute inset-0 size-full cursor-pointer opacity-0"
          onChange={(event) => {
            const normalized = normalizeHexColor(event.target.value);
            if (normalized) onChange?.(normalized);
          }}
        />
      </label>
      <Input
        value={value ?? ""}
        placeholder={defaultColor}
        maxLength={7}
        spellCheck={false}
        className="font-mono uppercase"
        onChange={(event) => handleHexChange(event.target.value)}
        onBlur={handleHexBlur}
      />
      <Tooltip title="Reset to default">
        <Button
          type="text"
          icon={<UndoOutlined />}
          disabled={isDefault}
          aria-label="Reset color"
          onClick={() => onChange?.(defaultColor)}
        />
      </Tooltip>
    </div>
  );
}
