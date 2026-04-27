import { alpha, useTheme } from "@mui/material/styles";
import { Paper, Typography } from "@mui/material";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark, oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import type { WorkflowDetailPayload } from "../model/dashboard";
import { DiffViewer } from "./DiffViewer";

type ArtifactDocumentContentProps = {
  detail: WorkflowDetailPayload;
  maxHeight?: string | number;
};

function inferSyntaxLanguage(detail: WorkflowDetailPayload): string {
  const extension = detail.sourcePath.split(".").pop()?.toLowerCase() ?? "";
  const byExtension: Record<string, string> = {
    cjs: "javascript",
    css: "css",
    html: "html",
    js: "javascript",
    json: "json",
    jsx: "jsx",
    md: "markdown",
    mjs: "javascript",
    sh: "bash",
    toml: "toml",
    ts: "typescript",
    tsx: "tsx",
    yaml: "yaml",
    yml: "yaml"
  };

  if (byExtension[extension]) {
    return byExtension[extension];
  }
  if (detail.contentType.includes("json")) {
    return "json";
  }
  return "text";
}

export function ArtifactDocumentContent(props: ArtifactDocumentContentProps) {
  const theme = useTheme();

  if (props.detail.kind === "diff") {
    return <DiffViewer value={props.detail.content} maxHeight={props.maxHeight} />;
  }

  if (props.detail.kind === "markdown") {
    return (
      <Paper
        variant="outlined"
        sx={{
          p: 2,
          borderRadius: 1,
          maxHeight: props.maxHeight ?? "65vh",
          overflow: "auto",
          backgroundColor: alpha(theme.palette.background.paper, theme.palette.mode === "dark" ? 0.84 : 0.94),
          "& p": { my: 1.2, lineHeight: 1.75 },
          "& ul, & ol": { my: 1.2, pl: 3 },
          "& li": { my: 0.5 },
          "& blockquote": {
            my: 1.5,
            mx: 0,
            px: 1.5,
            py: 1,
            borderLeft: `3px solid ${alpha(theme.palette.primary.main, 0.48)}`,
            backgroundColor: alpha(theme.palette.primary.main, 0.08)
          },
          "& code": {
            px: 0.45,
            py: 0.2,
            borderRadius: 0.75,
            backgroundColor: alpha(theme.palette.text.primary, theme.palette.mode === "dark" ? 0.18 : 0.08),
            fontFamily: '"IBM Plex Mono", "SFMono-Regular", monospace',
            fontSize: "0.86em"
          },
          "& pre": {
            m: 0
          }
        }}
      >
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            code({ className, children, ...rest }) {
              const match = /language-(\w+)/.exec(className ?? "");
              if (!match) {
                return (
                  <code className={className} {...rest}>
                    {children}
                  </code>
                );
              }

              return (
                <SyntaxHighlighter
                  style={theme.palette.mode === "dark" ? oneDark : oneLight}
                  language={match[1]}
                  PreTag="div"
                  showLineNumbers
                  wrapLongLines
                  lineNumberStyle={{
                    minWidth: "3.25em",
                    paddingRight: 12,
                    color: alpha(theme.palette.text.secondary, 0.72),
                    userSelect: "none"
                  }}
                  customStyle={{
                    margin: 0,
                    borderRadius: 8,
                    padding: 16,
                    fontSize: "0.85rem"
                  }}
                >
                  {String(children).replace(/\n$/, "")}
                </SyntaxHighlighter>
              );
            }
          }}
        >
          {props.detail.content}
        </ReactMarkdown>
      </Paper>
    );
  }

  return (
    <Paper
      variant="outlined"
      sx={{
        p: 0,
        borderRadius: 1,
        maxHeight: props.maxHeight ?? "65vh",
        overflow: "auto",
        backgroundColor: alpha(theme.palette.text.primary, theme.palette.mode === "dark" ? 0.14 : 0.04)
      }}
    >
      <SyntaxHighlighter
        style={theme.palette.mode === "dark" ? oneDark : oneLight}
        language={inferSyntaxLanguage(props.detail)}
        showLineNumbers
        wrapLongLines
        lineNumberStyle={{
          minWidth: "3.25em",
          paddingRight: 12,
          color: alpha(theme.palette.text.secondary, 0.72),
          userSelect: "none"
        }}
        customStyle={{
          m: 0,
          margin: 0,
          minHeight: 120,
          borderRadius: 0,
          padding: 16,
          fontSize: "0.84rem",
          lineHeight: 1.65
        }}
      >
        {props.detail.content}
      </SyntaxHighlighter>
    </Paper>
  );
}
