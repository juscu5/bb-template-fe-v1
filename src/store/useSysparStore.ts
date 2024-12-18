import { create } from "zustand";
import { ApiService } from "@/services";
import { useAccountStore, useAlertStatus, useCreateLog } from "./useStore";
import { enqueueSnackbar } from "notistack";

interface SetSysPar {
  sysParam: any[];
  setSysParam: (sysParam: any[]) => void;
}

interface SetSysParam {
  updateSysParam: (maxRec: any) => void;
}

export const setSysPar = create<SetSysPar>((set) => ({
  sysParam: [{}],
  setSysParam: (sysParam) => set({ sysParam }),
}));

export const setSysParam = create<SetSysParam>((set) => ({
  updateSysParam: async (sysPar) => {
    const module = "SystemParam";
    const activity = "Edit System Parameters";
    const account = useAccountStore.getState().account;
    let remarks = "";
    try {
      const res = await ApiService.put("syspar", sysPar, {
        headers: { Authorization: `Bearer ${account}` },
      });
      if (res.status === 200) {
        remarks = "System Parameters Updated";
        useCreateLog.getState().createLogs(module, activity, remarks);
        enqueueSnackbar("System Parameters Update", {
          variant: "success",
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "right",
          },
        });
      } else {
        remarks = "System Parameters Update Failed";
        useCreateLog.getState().createLogs(module, activity, remarks);
        enqueueSnackbar("System Parameters Update Failed", {
          variant: "error",
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "right",
          },
        });
      }
    } catch (e) {
      remarks = "User Activity Log Update Connection Failed";
      useCreateLog.getState().createLogs(module, activity, remarks);
      enqueueSnackbar("System Parameters Update Failed, Network Error: " + e, {
        variant: "error",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "right",
        },
      });
    }
  },
}));
