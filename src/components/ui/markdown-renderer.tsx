import React from "react";

interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  if (!content) return null;

  const lines = content.split("\n");

  return (
    <div className="space-y-1.5 text-xs text-aegis-cloud leading-relaxed">
      {lines.map((line, index) => {
        // Handle headers: e.g., ### Title
        const headerMatch = line.match(/^(#{1,6})\s+(.*)$/);
        if (headerMatch) {
          const depth = headerMatch[1].length;
          const text = headerMatch[2];
          const renderedText = renderInlineMarkdown(text);
          if (depth === 1) {
            return (
              <h1 key={index} className="text-base font-bold text-aegis-white mt-4 mb-2">
                {renderedText}
              </h1>
            );
          }
          if (depth === 2) {
            return (
              <h2 key={index} className="text-sm font-bold text-aegis-white mt-3 mb-2">
                {renderedText}
              </h2>
            );
          }
          return (
            <h3 key={index} className="text-xs font-bold text-aegis-white mt-2 mb-1">
              {renderedText}
            </h3>
          );
        }

        // Handle numbered lists: e.g., 1. Item
        const numListMatch = line.match(/^(\s*)(\d+)\.\s+(.*)$/);
        if (numListMatch) {
          const spaces = numListMatch[1].length;
          const num = numListMatch[2];
          const text = numListMatch[3];
          const pl = spaces > 2 ? "pl-6" : "pl-2";
          return (
            <div key={index} className={`flex gap-2 ${pl}`}>
              <span className="text-aegis-cyan font-semibold shrink-0">{num}.</span>
              <span className="flex-1">{renderInlineMarkdown(text)}</span>
            </div>
          );
        }

        // Handle bullet points: e.g., * Item or - Item
        const bulletMatch = line.match(/^(\s*)(\*|-)\s+(.*)$/);
        if (bulletMatch) {
          const spaces = bulletMatch[1].length;
          const text = bulletMatch[3];
          const pl = spaces > 2 ? "pl-6" : "pl-3";
          return (
            <div key={index} className={`flex gap-2 items-start ${pl}`}>
              <span className="text-aegis-cyan mt-1 text-[8px] shrink-0">&bull;</span>
              <span className="flex-1">{renderInlineMarkdown(text)}</span>
            </div>
          );
        }

        // Standard paragraph
        if (line.trim() === "") {
          return <div key={index} className="h-1.5" />;
        }

        return (
          <p key={index} className="leading-relaxed">
            {renderInlineMarkdown(line)}
          </p>
        );
      })}
    </div>
  );
}

function renderInlineMarkdown(text: string) {
  // Basic parser for **bold**
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-bold text-aegis-white">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}
