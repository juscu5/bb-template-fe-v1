import { LSTVPageRootStyle } from "@/components/Dynamic";
import { LSTVTable2 } from "@/components/lstv-table2/LSTVTable";
import { ActionMenu, FormElement, HeaderLabel2, TableSettings } from "@/models";
import { ApiService } from "@/services";
import { useAccountStore } from "@/store/useStore";
import { useQuery } from "react-query";
import eyeFill from "@iconify/icons-eva/eye-fill";
import trashFill from "@iconify/icons-eva/trash-fill";
import editFill from "@iconify/icons-eva/edit-fill";
import { useHandles } from "@/store/useCallbackStore";
import {
  LSTVDialogDeleteForm,
  LSTVDialogForm,
} from "@/components/lstv-dialog/LSTVDialog";
import { enqueueSnackbar } from "notistack";
import { use_SystemParam } from "@/components/hooks/lstvSysparam";

// #region System Parameters
const systemParam = () => {
  const { data } = use_SystemParam();
  const sysParam = data?.data?.payload[0];

  const enableDocnum = sysParam?.chkitmcde === 0 ? false : true;

  return { enableDocnum };
};
// #endregion

// #region Access Parameters
const accessParam = () => {
  return {};
};
// #endregion

// #region TABLE_API_CON
const API_CON = () => {
  const { setShowDialog } = useHandles();
  const { account } = useAccountStore();
  const { enableDocnum } = systemParam();

  const { data, refetch } = useQuery<any>(
    "item",
    async () =>
      await ApiService.get("item", {
        headers: { Authorization: `Bearer ${account}` },
      })
  );

  const { data: classData, refetch: classRefetch } = useQuery<any>(
    "itemclass",
    async () =>
      await ApiService.get("itemclass", {
        headers: { Authorization: `Bearer ${account}` },
      })
  );

  const addData = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries((formData as any).entries());

    const docnum = enableDocnum ? "docnum" : "";

    // console.log("docnum", docnum);

    try {
      const res = await ApiService.post(`item/${docnum}`, formJson, {
        headers: { Authorization: `Bearer ${account}` },
      });
      if (res.status === 200) {
        setShowDialog!(false);
        enqueueSnackbar(res.data.payload.msg, {
          variant: "success",
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "right",
          },
        });
      }
    } catch (e: any) {
      const errorMessage = e.response.data.payload.msg;
      const error = errorMessage ? errorMessage : e;
      enqueueSnackbar(`Adding Item Failed: ${error}`, {
        variant: "error",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "right",
        },
      });
    }
    refetch();
  };

  const editData = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries((formData as any).entries());

    try {
      const res = await ApiService.put(
        `customer/${formJson["itmcde"]}`,
        formJson,
        {
          headers: { Authorization: `Bearer ${account}` },
        }
      );
      if (res.status === 200) {
        setShowDialog!(false);
        enqueueSnackbar(res.data.payload.msg, {
          variant: "success",
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "right",
          },
        });
      }
    } catch (e: any) {
      const errorMessage = e.response.data.payload.msg;
      const error = errorMessage ? errorMessage : e;
      enqueueSnackbar(`Customer Failed Update: ${error}`, {
        variant: "error",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "right",
        },
      });
    }
    refetch();
  };

  const deleteData = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries((formData as any).entries());

    try {
      const res = await ApiService.delete(`item/${formJson["itmcde"]}`, {
        headers: { Authorization: `Bearer ${account}` },
      });
      if (res.status === 200) {
        setShowDialog!(false);
        enqueueSnackbar(res.data.payload.msg, {
          variant: "success",
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "right",
          },
        });
      }
    } catch (e: any) {
      const errorMessage = e.response.data.payload.msg;
      const error = errorMessage ? errorMessage : e;
      enqueueSnackbar(`Customer Failed Delete: ${error}`, {
        variant: "error",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "right",
        },
      });
    }
    refetch();
  };
  return {
    data,
    classData,
    classRefetch,
    addData,
    editData,
    deleteData,
  };
};
// #endregion

// #region TABLE_TITLE
const TABLE_TITLE = "Item File";
// #endregion

// #region TABLE_SETTINGS
const TABLE_SETTINGS: TableSettings[] = [
  {
    stripeColor: "#f5f5f5",
    addButton: true,
    printButton: true,
    sysParam: false,
    columnPinning: true,
  },
];
// #endregion

// #region TABLE_HEAD
const TABLE_HEAD: HeaderLabel2[] = [
  {
    id: "itmcde",
    header: "Item Code",
    size: 50,
    align: "left", // left | center | right
    type: "number", // text | date | monetary | number | email | password   alignment
  },
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

// #region TABLE_ACTION_MENU
const actionMenu = (): ActionMenu[] => {
  const { handleShowDialog } = useHandles();
  return [
    {
      label: "View",
      icon: eyeFill,
      type: "View", // view | edit | delete
      callback: (type, row) => {
        handleShowDialog!(type, row);
      },
    },
    {
      label: "Edit",
      icon: editFill,
      type: "Edit", // view | edit | delete
      callback: (type, row) => {
        handleShowDialog!(type, row);
      },
    },
    {
      label: "Delete",
      icon: trashFill,
      type: "Delete", // view | edit | delete
      callback: (type, row) => {
        handleShowDialog!(type, row);
      },
    },
  ];
};
// #endregion

// #region TABLE_DIALOG_ELEMENTS
const formElements = (): FormElement[] => {
  const { dialogType } = useHandles();
  const { enableDocnum } = systemParam();
  const { classData } = API_CON();
  const data = classData?.data.payload;

  const itemClass = data?.map((iClass: any) => ({
    id: iClass.itmclacde,
    name: iClass.itmcladsc,
  }));

  // Dialog Type with Docnum. If edit auto hidden, if add depend on syspar
  const typeDocnum = dialogType === "Add" ? enableDocnum : true;

  return [
    {
      id: "itmcde",
      label: "Item Code",
      name: "itmcde",
      type: "text",
      hidden: typeDocnum,
    },
    {
      id: "itmdsc",
      label: "Item Description",
      name: "itmdsc",
      type: "text",
    },
    {
      id: "itmtyp",
      label: "Item Type",
      name: "itmtyp",
      type: "select",
      selectOpt: [
        {
          id: "INVENTORY",
          name: "INVENTORY",
        },
        {
          id: "CHARGES",
          name: "CHARGES",
        },
        {
          id: "SERVICES",
          name: "SERVICES",
        },
      ],
    },
    {
      id: "barcde",
      label: "Barcode",
      name: "barcde",
      type: "text",
    },
    {
      id: "itmclacde",
      label: "Item Class",
      name: "itmclacde",
      type: "select",
      selectOpt: itemClass,
    },
    {
      id: "brndsc",
      label: "Brand",
      name: "brndsc",
      type: "select",
      selectOpt: [
        {
          id: "COKE",
          name: "COKE",
        },
        {
          id: "REDBULL",
          name: "REDBULL",
        },
        {
          id: "GATORADE",
          name: "GATORADE",
        },
      ],
    },
    {
      id: "wardsc",
      label: "Brand",
      name: "wardsc",
      type: "select",
      selectOpt: [
        {
          id: "ALL",
          name: "ALL",
        },
        {
          id: "WAREHOUSE 1",
          name: "WAREHOUSE 1",
        },
        {
          id: "WAREHOUSE 2",
          name: "WAREHOUSE 2",
        },
      ],
    },
    {
      id: "remarks",
      label: "Remarks",
      name: "remarks",
      type: "text",
    },
    {
      id: "multium",
      label: "Multiple Unit of Measures",
      name: "multium",
      type: "check",
    },
    {
      id: "untmea",
      label: "Unit Of Measure",
      name: "untmea",
      type: "text",
    },
    {
      id: "untcst",
      label: "Unit Cost",
      name: "untcst",
      type: "monetary",
    },
    {
      id: "untprc",
      label: "Selling Price",
      name: "untprc",
      type: "monetary",
    },
    {
      id: "inactive",
      label: "Inactive",
      name: "inactive",
      // type: "check",
      type: "switch",
      switchStyle: "IOS",
    },
    {
      id: "itmrem1",
      label: "Re-Order Level",
      name: "itmrem1",
      type: "select",
      selectOpt: [
        {
          id: "Trade",
          name: "Trade",
        },
        {
          id: "Non-Trade",
          name: "Non-Trade",
        },
      ],
    },
  ];
};
// #endregion

// #region TABLE_ACTION_DIALOG
const ACTION_DIALOG = () => {
  const { setShowDialog, showDialog, dialogType } = useHandles();
  const { addData, editData, deleteData } = API_CON();
  const FORM_ELEMENTS = formElements();

  if (dialogType === "Delete") {
    return (
      <LSTVDialogDeleteForm
        open={showDialog!}
        setOpen={(isOpen: boolean) => setShowDialog!(isOpen)}
        formElements={FORM_ELEMENTS}
        deleteCallback={deleteData}
        docnum="itmcde"
        dialogTitle="Item"
      />
    );
  } else {
    return (
      <LSTVDialogForm
        open={showDialog!}
        setOpen={(isOpen: boolean) => setShowDialog!(isOpen)}
        formElements={FORM_ELEMENTS}
        dialogContent="Item"
        dialogTitle="Add Item"
        addCallback={addData}
        editCallback={editData}
      />
    );
  }
};
// #endregion

export default function ItemFile() {
  const ACTION_MENU = actionMenu();
  const { data } = API_CON();

  return (
    <LSTVTable2
      title={TABLE_TITLE}
      placeholder={"Search " + TABLE_TITLE}
      tableHead={TABLE_HEAD}
      tableData={data?.data?.payload || []}
      actionMenu={ACTION_MENU}
      actionDialog={() => ACTION_DIALOG()}
      tableSettings={TABLE_SETTINGS}
    />
  );
}
