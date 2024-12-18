import { HeaderLabel2 } from "@/models";

export interface LstvPrintProps {
  lstvHead: HeaderLabel2[];
  tableData: any[];
  printTitle: string;
  open?: boolean;
  handleClickOpen?: () => void;
  handleClose?: () => void;
  handlePrintOnClick?: () => void;
  componentRef?: React.RefObject<HTMLDivElement>;
  handleSavePDFOnClick?: () => void;
}
