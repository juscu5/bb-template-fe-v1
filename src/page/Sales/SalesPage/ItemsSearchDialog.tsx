import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import { Container } from "@mui/material";
import { LSTVTable3 } from "@/components/lstv-table3/LSTVTable";
import { useQuery } from "react-query";
import { ApiService } from "@/services";
import { useAccountStore } from "@/store/useStore";
import { HeaderLabel2 } from "@/models";

interface ItemsSearchDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  setItemToAdd: (itemToAdd: any[]) => void;
  handleFromItemAdd: () => void;
}

// #region API_CON
const API_CON = () => {
  const { account } = useAccountStore();
  const { data, refetch } = useQuery<any>(
    "item",
    async () =>
      await ApiService.get("item", {
        headers: { Authorization: `Bearer ${account}` },
      })
  );
  return {
    data,
    refetch,
  };
};
// #endregion

// #region TABLE_HEAD
const TABLE_HEAD: HeaderLabel2[] = [
  {
    id: "itmdsc",
    header: "Item Description",
    size: 150,
    align: "left", // left | center | right
    type: "text", // text | date | monetary | number | email | password   alignment
  },
  {
    id: "itmtyp",
    header: "Item Type",
    size: 150,
    align: "left", // left | center | right
    type: "text", // text | date | monetary | number | email | password   alignment
  },
  {
    id: "itmcladsc",
    header: "Item Class",
    size: 150,
    align: "left", // left | center | right
    type: "text", // text | date | monetary | number | email | password   alignment
  },
  {
    id: "brndsc",
    header: "Brand",
    size: 150,
    align: "left", // left | center | right
    type: "text", // text | date | monetary | number | email | password   alignment
  },
  {
    id: "inactive",
    header: "Active",
    size: 150,
    align: "left", // left | center | right
    type: "cndn", // text | date | monetary | number | email | password | cndn
    cndntype: 2,
  },
];
// #endregion

export const ItemsSearchDialog = ({
  open,
  setOpen,
  setItemToAdd,
  handleFromItemAdd,
}: ItemsSearchDialogProps) => {
  const { data, refetch } = API_CON();

  const handleClose = () => {
    setOpen(false);
  };


  return (
    <>
      <Dialog
        fullWidth
        maxWidth="xl"
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: "form",
          onSubmit: handleFromItemAdd,
        }}
      >
        <DialogTitle>Search Item</DialogTitle>
        <Container
          maxWidth="xl"
          sx={{
            display: "flex",
            flexDirection: "column",
            alignContent: "center",
          }}
        >
          <LSTVTable3
            title="Item"
            placeholder={"Search Item"}
            tableHead={TABLE_HEAD}
            tableData={data?.data?.payload || []}
            enableTitle={false}
            enableCheckbox={true}
            setItemToAdd={setItemToAdd}
            enableActionsMenu={false}
          />
        </Container>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">add</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
