import { Box, Paper } from "@mui/material";

type DiffLineTone = "hunk" | "added" | "removed" | "meta" | "context";

function diffLineTone(line: string): DiffLineTone {
  if (line.startsWith("@@")) {
    return "hunk";
  }
  if (line.startsWith("+++") || line.startsWith("---") || line.startsWith("diff ") || line.startsWith("index ")) {
    return "meta";
  }
  if (line.startsWith("+")) {
    return "added";
  }
  if (line.startsWith("-")) {
    return "removed";
  }
  return "context";
}

function diffLineSx(tone: DiffLineTone) {
  if (tone === "hunk") {
    return {
      backgroundColor: "rgba(242, 197, 92, 0.14)",
      color: "#f2c55c",
      borderLeftColor: "#f2c55c"
    };
  }
  if (tone === "added") {
    return {
      backgroundColor: "rgba(57, 179, 92, 0.16)",
      color: "#8bd49f",
      borderLeftColor: "#39b35c"
    };
  }
  if (tone === "removed") {
    return {
      backgroundColor: "rgba(248, 81, 73, 0.16)",
      color: "#f2a2a2",
      borderLeftColor: "#f85149"
    };
  }
  if (tone === "meta") {
    return {
      backgroundColor: "rgba(79, 146, 255, 0.12)",
      color: "#9cc2ff",
      borderLeftColor: "#4f92ff"
    };
  }
  return {
    backgroundColor: "transparent",
    color: "rgba(247, 239, 230, 0.78)",
    borderLeftColor: "transparent"
  };
}

export function DiffViewer(props: { value: string; maxHeight?: string | number }) {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 0,
        borderRadius: 1,
        maxHeight: props.maxHeight ?? "65vh",
        overflow: "auto",
        backgroundColor: "rgba(22, 19, 17, 0.96)"
      }}
    >
      <Box component="pre" sx={{ m: 0, p: 1.25, fontSize: "0.82rem", lineHeight: 1.7 }}>
        {props.value.split("\n").map((line, index) => {
          const sx = diffLineSx(diffLineTone(line));

          return (
            <Box
              key={`${index}:${line}`}
              component="div"
              sx={{
                display: "grid",
                gridTemplateColumns: "4.25rem minmax(0, 1fr)",
                minWidth: "max-content",
                borderRadius: 0.75,
                borderLeft: "3px solid",
                borderLeftColor: sx.borderLeftColor,
                backgroundColor: sx.backgroundColor,
                color: sx.color,
                fontFamily: '"IBM Plex Mono", "SFMono-Regular", monospace'
              }}
            >
              <Box
                component="span"
                sx={{
                  px: 0.9,
                  color: "rgba(247, 239, 230, 0.45)",
                  textAlign: "right",
                  userSelect: "none"
                }}
              >
                {index + 1}
              </Box>
              <Box component="span" sx={{ px: 1, whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}>
                {line || " "}
              </Box>
            </Box>
          );
        })}
      </Box>
    </Paper>
  );
}
