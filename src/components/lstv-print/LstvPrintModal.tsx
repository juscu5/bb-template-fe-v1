import React, { useRef } from "react";
import {
  Button,
  Dialog,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Slide,
  SlideProps,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PrintIcon from "@mui/icons-material/Print";
import { LstvPrintPreview } from "./LstvPrintPreview";
import { HeaderLabel2 } from "@/models";
import { TransitionProps } from "@mui/material/transitions";
import { use_LstvPrintModal } from "../hooks/lstvPrint";
import { LstvPrintProps } from "@/models/print";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export const LstvPrintModal: React.FC<LstvPrintProps> = ({
  tableData,
  lstvHead,
  printTitle,
  open,
  handleClickOpen,
  handleClose,
  handlePrintOnClick,
  componentRef,
  handleSavePDFOnClick,
}) => {
  return (
    <>
      <Button
        variant="outlined"
        size="small"
        onClick={handleClickOpen}
        startIcon={<PrintIcon />}
        color="success"
      >
        Print
      </Button>
      <Dialog
        fullScreen
        open={open!}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: "relative", backgroundColor: "#597445" }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Print Preview
            </Typography>
            <Button color="inherit" onClick={handlePrintOnClick}>
              Print
            </Button>
            <Button color="inherit" onClick={handleSavePDFOnClick}>
              Save as PDF
            </Button>
          </Toolbar>
        </AppBar>
        <LstvPrintPreview
          ref={componentRef}
          tableData={tableData}
          lstvHead={lstvHead}
          printTitle={printTitle}
        />
      </Dialog>
    </>
  );
};
