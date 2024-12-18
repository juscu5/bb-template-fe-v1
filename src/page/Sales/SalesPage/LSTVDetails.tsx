import { Box, Container } from "@mui/material";
import LSTVTabs from "@/components/LSTVTabs";
import React from "react";
import { TabListContentProps } from "@/models/tabs";
import ItemDetail from "./ItemDetail";
import OtherInfo from "./OtherInfo";

interface LSTVDetailsProps {
  dialogType: string;
  setGrandTotal?: (grandTotal: number | null) => void;
  setSalesItem: (salesItem: any[] | []) => void;
  docNum: string;
  setRemovedItem: (removedItem: any[] | []) => void;
  initializeItem: boolean;
  setInitializeItem: (initializeItem: boolean) => void;
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
  setRemovedItem,
  initializeItem,
  setInitializeItem,
}: LSTVDetailsProps) {
  const { loadData } = API_CON();
  const [editedData, setEditedData] = React.useState<any[]>([]);

  // #region TabsPage
  const TabsListContent: TabListContentProps[] = [
    {
      tabsName: "Items",
      tabsContent: (
        <ItemDetail
          dialogType={dialogType!}
          setGrandTotal={setGrandTotal}
          setSalesItem={setSalesItem}
          docNum={docNum}
          setRemovedItem={setRemovedItem}
          initializeItem={initializeItem}
          setInitializeItem={setInitializeItem}
        />
      ),
    },
    {
      tabsName: "Additional",
      tabsContent: <OtherInfo />,
    },
  ];
  // #endregion

  return (
    <Box title="LSTV Details">
      <Container maxWidth={false}>
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
