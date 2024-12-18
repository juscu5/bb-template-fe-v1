import { TabListContentProps } from "@/models/tabs";
import {
  AppBar,
  Box,
  Container,
  Divider,
  Paper,
  Tab,
  Tabs,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useEffect } from "react";
import SwipeableViews from "react-swipeable-views";

interface TabPanelProps {
  children?: React.ReactNode;
  dir?: string;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function allyProps(index: number) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

interface LSTVTabsProps {
  load: any[];
  data: any[];
  setData: (data: any[]) => void;
  tabsListContent: TabListContentProps[];
}

const LSTVTabs = ({ load, data, setData, tabsListContent }: LSTVTabsProps) => {
  const theme = useTheme();
  const [value, setValue] = React.useState(0);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index: number) => {
    setValue(index);
  };

  return (
    <Paper variant="outlined" sx={{ border: "none" }}>
      <Box>
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="inherit"
          variant="standard"
          aria-label="full width tabs example"
        >
          {tabsListContent.map((list: any, idx: number) => (
            <Tab label={list.tabsName} {...allyProps(idx)} />
          ))}
        </Tabs>
      </Box>
      <Box width="100%">
        <SwipeableViews
          axis={theme.direction === "rtl" ? "x-reverse" : "x"}
          index={value}
          onChangeIndex={handleChangeIndex}
        >
          {tabsListContent.map((list: any, idx: number) => (
            <TabPanel value={value} index={idx} dir={theme.direction}>
              {list.tabsContent}
            </TabPanel>
          ))}
        </SwipeableViews>
      </Box>
    </Paper>
  );
};

export default LSTVTabs;
