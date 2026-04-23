import { Alert, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Paper, Stack, Typography } from "@mui/material";
import type { ArtifactSelection, DashboardLocale } from "../../shared/model/dashboard";
import { formatDate } from "../../shared/utils/dashboard";
import { ArtifactDocumentContent } from "../../shared/ui/ArtifactDocumentContent";

type ArtifactDetailDialogProps = {
  open: boolean;
  detailSelection: ArtifactSelection | null;
  dictionary: DashboardLocale;
  language: "ko" | "en";
  onClose: () => void;
};

export function ArtifactDetailDialog(props: ArtifactDetailDialogProps) {
  return (
    <Dialog open={props.open} onClose={props.onClose} fullWidth maxWidth="lg">
      <DialogTitle>{props.detailSelection?.detail?.title ?? props.detailSelection?.title}</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={1.5}>
          <Stack direction={{ xs: "column", md: "row" }} spacing={1} useFlexGap sx={{ flexWrap: "wrap" }}>
            <Chip size="small" label={props.detailSelection?.detail?.kind ?? props.dictionary.text} />
            {props.detailSelection?.sourcePath ? (
              <Chip
                size="small"
                variant="outlined"
                label={`${props.dictionary.detailPath}: ${props.detailSelection.sourcePath}`}
              />
            ) : null}
            {props.detailSelection?.detail?.updatedAt ? (
              <Chip
                size="small"
                variant="outlined"
                label={`${props.dictionary.detailUpdatedAt}: ${formatDate(props.detailSelection.detail.updatedAt, props.language)}`}
              />
            ) : null}
          </Stack>

          {props.detailSelection?.detail ? (
            <ArtifactDocumentContent detail={props.detailSelection.detail} />
          ) : (
            <Alert severity="info">{props.dictionary.detailUnavailable}</Alert>
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onClose}>{props.dictionary.cancel}</Button>
      </DialogActions>
    </Dialog>
  );
}
