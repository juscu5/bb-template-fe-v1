import LSTVPageTitle from "@/components/lstv-layout/title/LSTVPageTitle";
import { Icon } from "@iconify/react";
import { Box, Button, Container, Divider, Stack } from "@mui/material";
import LSTVTabs from "@/components/LSTVTabs";
import React from "react";
import { TabListContentProps } from "@/models/tabs";
import LSTVDateLock from "@/components/lstv-syspar/LSTVDateLock";
import LSTVDocnum from "@/components/lstv-syspar/LSTVDocnum";
import { setSysPar } from "@/store/useSysparStore";
import { setSysParam } from "@/store/useSysparStore";
import saveFill from "@iconify/icons-eva/save-fill";

// #region API_CON
const API_CON = () => {
  const loadData = [{ data: "test", data2: "test1" }];
  return {
    loadData,
  };
};
// #endregion

// #region TabsPage
const TabsListContent: TabListContentProps[] = [
  {
    tabsName: "Page 1",
    tabsContent: <LSTVDocnum />,
  },
  {
    tabsName: "Page 2",
    tabsContent: <LSTVDateLock />,
  },
];
// #endregion

export default function SystemParameters() {
  const { loadData } = API_CON();
  const [editedData, setEditedData] = React.useState<any[]>([]);
  const { sysParam } = setSysPar();
  const { updateSysParam } = setSysParam();

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
    <Box title="System Parameters">
      <Container maxWidth={false}>
        <LSTVPageTitle title="System Parameters" element={save} />
        <Stack mb={2} />
        <Divider>System Parameters</Divider>
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
