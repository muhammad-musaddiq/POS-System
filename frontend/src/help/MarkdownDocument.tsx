import { Card, Typography } from "antd";
import type { ReactNode } from "react";

export interface TocItem {
  id: string;
  level: number;
  title: string;
}

interface MarkdownDocumentProps {
  content: string;
  searchQuery?: string;
  onTocChange?: (items: TocItem[]) => void;
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

function highlight(text: string, query?: string): ReactNode {
  if (!query?.trim()) {
    return text;
  }
  const normalizedQuery = query.trim();
  const index = text.toLowerCase().indexOf(normalizedQuery.toLowerCase());
  if (index === -1) {
    return text;
  }
  return (
    <>
      {text.slice(0, index)}
      <mark>{text.slice(index, index + normalizedQuery.length)}</mark>
      {text.slice(index + normalizedQuery.length)}
    </>
  );
}

function parseInline(text: string, query?: string): ReactNode {
  const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g).filter(Boolean);
  return parts.map((part, index) => {
    if (part.startsWith("`") && part.endsWith("`")) {
      return <code key={index}>{part.slice(1, -1)}</code>;
    }
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={index}>{highlight(part.slice(2, -2), query)}</strong>;
    }
    return <span key={index}>{highlight(part, query)}</span>;
  });
}

function isTableDivider(line: string): boolean {
  return /^\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?$/.test(line);
}

export function extractToc(content: string): TocItem[] {
  return content
    .split("\n")
    .filter((line) => /^#{1,3}\s/.test(line))
    .map((line) => {
      const level = line.match(/^#+/)?.[0].length ?? 1;
      const title = line.replace(/^#+\s/, "").trim();
      return { id: slugify(title), level, title };
    });
}

export function MarkdownDocument({
  content,
  searchQuery,
  onTocChange,
}: MarkdownDocumentProps) {
  const toc = extractToc(content);
  onTocChange?.(toc);

  const lines = content.split("\n");
  const blocks: ReactNode[] = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index];

    if (!line.trim()) {
      index += 1;
      continue;
    }

    if (line.startsWith("```")) {
      const codeLines: string[] = [];
      index += 1;
      while (index < lines.length && !lines[index].startsWith("```")) {
        codeLines.push(lines[index]);
        index += 1;
      }
      index += 1;
      blocks.push(
        <pre
          key={blocks.length}
          className="overflow-x-auto rounded-md bg-slate-950 p-4 text-xs text-slate-50"
        >
          <code>{codeLines.join("\n")}</code>
        </pre>,
      );
      continue;
    }

    if (/^#{1,3}\s/.test(line)) {
      const level = line.match(/^#+/)?.[0].length ?? 1;
      const title = line.replace(/^#+\s/, "").trim();
      const id = slugify(title);
      const Heading = level === 1 ? Typography.Title : Typography.Title;
      blocks.push(
        <Heading
          key={blocks.length}
          id={id}
          level={Math.min(level + 1, 4) as 2 | 3 | 4}
          className="scroll-mt-20"
        >
          {highlight(title, searchQuery)}
        </Heading>,
      );
      index += 1;
      continue;
    }

    if (line.trim().startsWith("- ")) {
      const items: string[] = [];
      while (index < lines.length && lines[index].trim().startsWith("- ")) {
        items.push(lines[index].trim().slice(2));
        index += 1;
      }
      blocks.push(
        <ul
          key={blocks.length}
          className="ml-5 list-disc space-y-1 text-sm text-slate-700"
        >
          {items.map((item) => (
            <li key={item}>{parseInline(item, searchQuery)}</li>
          ))}
        </ul>,
      );
      continue;
    }

    if (
      line.includes("|") &&
      lines[index + 1] &&
      isTableDivider(lines[index + 1])
    ) {
      const headers = line
        .split("|")
        .map((cell) => cell.trim())
        .filter(Boolean);
      index += 2;
      const rows: string[][] = [];
      while (index < lines.length && lines[index].includes("|")) {
        rows.push(
          lines[index]
            .split("|")
            .map((cell) => cell.trim())
            .filter(Boolean),
        );
        index += 1;
      }
      blocks.push(
        <div key={blocks.length} className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr>
                {headers.map((header) => (
                  <th
                    key={header}
                    className="border border-slate-200 bg-slate-50 px-3 py-2 text-left"
                  >
                    {highlight(header, searchQuery)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <td
                      key={cellIndex}
                      className="border border-slate-200 px-3 py-2"
                    >
                      {parseInline(cell, searchQuery)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>,
      );
      continue;
    }

    const paragraph: string[] = [];
    while (
      index < lines.length &&
      lines[index].trim() &&
      !/^#{1,3}\s/.test(lines[index]) &&
      !lines[index].trim().startsWith("- ") &&
      !lines[index].startsWith("```")
    ) {
      paragraph.push(lines[index]);
      index += 1;
    }
    blocks.push(
      <Typography.Paragraph
        key={blocks.length}
        className="text-sm leading-7 text-slate-700"
      >
        {parseInline(paragraph.join(" "), searchQuery)}
      </Typography.Paragraph>,
    );
  }

  return <Card className="app-help-document">{blocks}</Card>;
}
