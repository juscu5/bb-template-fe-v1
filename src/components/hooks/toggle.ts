import React from "react";

export const use_Toggle = () => {
  const [open2, setOpen2] = React.useState(false);
  const [open3, setOpen3] = React.useState(false);
  const toggleDrawer2 = (newOpen: boolean) => () => {
    setOpen2(newOpen);
  };
  const toggleDrawer3 = (newOpen: boolean) => () => {
    setOpen3(newOpen);
  };
  return {
    open2,
    setOpen2,
    toggleDrawer2,
    open3,
    setOpen3,
    toggleDrawer3,
  };
};
