import { create } from "zustand";
import { ApiService } from "@/services";
import { useAccountStore } from "./useStore";

//#region Interfaces
interface handles {
  selectedData?: any;
  setSelectedData?: (selectedData: { [selectedData: string]: any }) => void;
  dialogType?: string | null;
  setDialogType?: (dialogType: any) => void;
  showDialog?: boolean | null;
  setShowDialog?: (showDialog: boolean) => void;
  showDeleteDialog?: boolean | null;
  setShowDeleteDialog?: (showDeleteDialog: boolean) => void;
  handleShowDialog?: (type: any, row: any) => void;
  handleDeleteShowDialog?: (type: any, row: any) => void;
}

interface addCallback {
  addUser?: (body: any, refetch?: () => void) => void;
}

interface editCallback {
  editUser?: (recid: number, body: any, refetch?: () => void) => void;
}

interface deleteCallback {
  deleteUser?: (recid: number, refetch?: () => void) => void;
}
//#endregion

//#region State/Store
export const useHandles = create<handles>((set) => ({
  selectedData: null,
  setSelectedData: (selectedData) => set({ selectedData }),
  dialogType: null,
  setDialogType: (dialogType) => set({ dialogType }),
  showDialog: false,
  setShowDialog: (showDialog) => set({ showDialog }),
  showDeleteDialog: false,
  setShowDeleteDialog: (showDeleteDialog) => set({ showDeleteDialog }),
  handleShowDialog: (type, row) => {
    set((state) => ({
      ...state,
      showDialog: true,
      selectedData: row,
      dialogType: type,
    }));
  },
  handleDeleteShowDialog: (type, row) => {
    set((state) => ({
      ...state,
      showDeleteDialog: true,
      selectedData: row,
      dialogType: type,
    }));
  },
}));

export const useAddCallback = create<addCallback>((set) => ({
  addUser: async (body, refetch) => {
    const account = useAccountStore.getState().account;

    try {
      const res = await ApiService.post("users", body, {
        headers: { Authorization: `Bearer ${account}` },
      });
      if (res.status === 200) {
        console.log("User Successfully add");
        useHandles.getState().setShowDialog!(false);
        refetch!();
      }
    } catch (e) {
      console.log(e);
    }
  },
}));

export const useEditCallback = create<editCallback>((set) => ({
  editUser: async (recid, body, refetch) => {
    const account = useAccountStore.getState().account;

    try {
      const res = await ApiService.put(`users/${recid}`, body, {
        headers: { Authorization: `Bearer ${account}` },
      });
      if (res.status === 200) {
        useHandles.getState().setShowDialog!(false);
        refetch!();
      }
    } catch (e) {
      console.log(e);
    }
  },
}));

export const useDeleteCallback = create<deleteCallback>((set) => ({
  deleteUser: async (recid, refetch) => {
    const account = useAccountStore.getState().account;

    try {
      const res = await ApiService.delete(`users/${recid}`, {
        headers: { Authorization: `Bearer ${account}` },
      });
      if (res.status === 200) {
        useHandles.getState().setShowDialog!(false);
        refetch!();
      }
    } catch (e) {
      console.log(e);
    }
  },
}));
//#endregion
