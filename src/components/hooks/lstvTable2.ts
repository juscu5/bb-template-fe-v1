import React, { useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import { dialog } from "electron";
import { FormElement } from "@/models";
import { MRT_RowData } from "material-react-table";

export const use_LSTVTable2Hooks = <T>() => {
  const [data, setData] = useState<T[]>([]);
  const [selectedData, setSelectedData] = useState<{
    [T: string]: any;
  } | null>(null);
  const [dialogType, setDialogType] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [addButton, setAddButton] = useState(false);

  const authorizationData = JSON.parse(localStorage.getItem("account") ?? "{}");
  const token = authorizationData?.state?.account ?? "";

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const handleOpenDialog = (type: any, row: T[]) => {
    setSelectedData(row);
    setDialogType(type);
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedData(null);
    setDialogType(null);
  };

  const handleAddUser = () => {
    const params: any[] = [];
    handleOpenDialog("add", params);
  };

  const handleConfirmDelete = async () => {
    try {
      const res = await axios.delete(
        `http://localhost:8080/api/employees/${selectedData!.recid}`,
        { headers }
      );
      setData((prevData) => prevData.filter((emp) => emp !== selectedData));
      setDialogOpen(false);
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };

  return {
    data,
    setData,
    open,
    setOpen,
    selectedData,
    setSelectedData,
    dialogType,
    setDialogType,
    setDialogOpen,
    handleOpenDialog,
    handleCloseDialog,
    handleAddUser,
    handleConfirmDelete,
    dialogOpen,
    addButton,
    setAddButton,
  };
};
