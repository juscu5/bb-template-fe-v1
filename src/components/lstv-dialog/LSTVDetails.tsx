import { Icon } from "@iconify/react";
import { Box, Button, Container, Divider, Stack } from "@mui/material";
import LSTVTabs from "@/components/LSTVTabs";
import React from "react";
import { TabListContentProps } from "@/models/tabs";
import { setSysPar } from "@/store/useSysparStore";
import { setSysParam } from "@/store/useSysparStore";
import saveFill from "@iconify/icons-eva/save-fill";
import ItemDetail from "../lstv-detail/ItemDetail";
import OtherInfo from "../lstv-detail/OtherInfo";

interface LSTVDetailsProps {
  dialogType: string;
  setGrandTotal?: (grandTotal: number | null) => void;
  setSalesItem: (salesItem: any[] | []) => void;
  docNum: string;
  setRemovedItem: (removedItem: any[] | []) => void;
}

// #region API_CON
const API_CON = () => {
  const loadData = [{ data: "test", data2: "test1" }];
  return {
    loadData,
  };
};
// #endregion

export default function LSTVDetails({
  dialogType,
  setGrandTotal,
  setSalesItem,
  docNum,
  setRemovedItem
}: LSTVDetailsProps) {
  const { loadData } = API_CON();
  const [editedData, setEditedData] = React.useState<any[]>([]);
  const { sysParam } = setSysPar();
  const { updateSysParam } = setSysParam();

  // #region TabsPage
  const TabsListContent: TabListContentProps[] = [
    {
      tabsName: "Page 1",
      tabsContent: (
        <ItemDetail
          dialogType={dialogType!}
          setGrandTotal={setGrandTotal}
          setSalesItem={setSalesItem}
          docNum={docNum}
          setRemovedItem={setRemovedItem}
        />
      ),
    },
    {
      tabsName: "Page 2",
      tabsContent: <OtherInfo />,
    },
  ];
  // #endregion

  const handleSave = () => {
    updateSysParam(sysParam[0]);
  };

  const save = (
    <Button
      variant="contained"
      color="success"
      startIcon={<Icon icon={saveFill} />}
      onClick={() => handleSave()}
    >
      Save
    </Button>
  );

  return (
    <Box title="LSTV Details">
      <Container maxWidth={false}>
        {/* <LSTVPageTitle title="System Parameters" element={save} /> */}
        <Stack mb={2} />
        {/* <Divider>Item Details</Divider> */}
        <Stack mb={1} />
        <LSTVTabs
          load={loadData}
          data={editedData}
          setData={setEditedData}
          tabsListContent={TabsListContent}
        />
      </Container>
    </Box>
  );
}
