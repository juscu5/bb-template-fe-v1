import axios from "axios";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { postActivityLog } from "@/services/api/activityLogApi";
import { ApiService } from "@/services";
import { getCurrentTimeString } from "@/utils/CurrentTimeString";

//#region Interface
interface AuthState {
  user: any | null;
  setUser: (user: any) => void;
}

interface AccountState {
  account: any | null;
  setAccount: (account: any) => void;
}

interface CreateLog {
  createLogs: (module: string, activity: string, remarks: string) => void;
}

interface Logout {
  logMeOut: () => void;
}

interface StoreState {
  isLoggedIn: boolean;
  bearerToken: string | null;
  loginUser: (credentials: { usrcde: string; usrpwd: string }) => Promise<void>;
  checkLogin: () => Promise<void>;
}

interface PasswordValidation {
  oldpass: boolean | null;
  setOldpass: (oldpass: boolean) => void;
  newpass: boolean | null;
  setNewpass: (newpass: boolean) => void;
  reNewpass: boolean | null;
  setReNewPass: (reNewpass: boolean) => void;
}

interface SetPassword {
  setpass: () => void;
}

interface SetSysPar {
  setMaxRec: (maxRec: any) => void;
}

interface AlertStatus {
  alert: boolean;
  setAlert: (alert: boolean) => void;
}

interface TokenExpired {
  tokenDialog: boolean;
  setTokenDialog: (tokenDialog: boolean) => void;
}

interface NetworkError {
  isError: boolean;
  setIsError: (isError: boolean) => void;
}

//#endregion

//#region State/Store
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));

export const useAccountStore = create<AccountState>()(
  persist<AccountState>(
    (set) => ({
      account: null,
      setAccount: (account) => set({ account }),
    }),
    {
      name: "account",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export const useCreateLog = create<CreateLog>((set) => ({
  createLogs: (module, activity, remarks) => {
    const user = useAuthStore.getState().user;
    const account = useAccountStore.getState().account;
    const payload = {
      modcde: module,
      usrcde: user?.usrcde,
      usrname: user?.usrcde,
      usrdte: new Date(),
      usrtim: getCurrentTimeString(),
      trndte: new Date(),
      module: module,
      activity: activity,
      remarks: remarks,
    };
    postActivityLog({ account, payload });
  },
}));

export const useLogout = create<Logout>((set) => ({
  logMeOut: () => {
    const user = useAuthStore.getState().user;
    const account = useAccountStore.getState().account;
    const module = "logout";
    const activity = "Logging Out";
    const remarks = "Logout Successful";

    localStorage.removeItem("account");
    useCreateLog.getState().createLogs(module, activity, remarks);
    window.location.reload();
  },
}));

export const useMeStore = create<StoreState>((set) => ({
  isLoggedIn: false,
  bearerToken: null,

  loginUser: async (credentials) => {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/users/login",
        credentials,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (
        response.data &&
        response.data.payload &&
        response.data.payload.BearerToken
      ) {
        set({
          bearerToken: response.data.payload.BearerToken,
          isLoggedIn: true,
        });

        localStorage.setItem("account", response.data.payload.BearerToken);
      }
    } catch (error: any) {
      console.error("Failed to login:", error.response || error);
      throw new Error("Failed to login");
    }
  },

  checkLogin: async () => {
    const bearerToken = localStorage.getItem("account");
    if (!bearerToken) {
      set({ isLoggedIn: false });
      return;
    }

    try {
      const response = await axios.get("http://localhost:8080/api/users/me", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${bearerToken}`,
        },
      });

      if (response.status === 200) {
        set({ isLoggedIn: true });
      } else {
        set({ isLoggedIn: false });
      }
    } catch (error: any) {
      console.error("Failed to check login status:", error?.response || error);
      set({ isLoggedIn: false });
    }
  },
}));

export const usePassValidation = create<PasswordValidation>((set) => ({
  oldpass: true,
  setOldpass: (oldpass) => set({ oldpass }),
  newpass: null,
  setNewpass: (newpass) => set({ newpass }),
  reNewpass: null,
  setReNewPass: (reNewpass) => set({ reNewpass }),
}));

export const setPassword = create<SetPassword>((set) => ({
  setpass: () => {},
}));

export const setSysPar = create<SetSysPar>((set) => ({
  setMaxRec: async (maxRec) => {
    const data = {
      userlogmaxrec: parseInt(maxRec),
    };
    const module = "User Activity Log";
    const activity = "Edit Max Records of Logs";
    const account = useAccountStore.getState().account;
    try {
      const res = await ApiService.put("syspar", data, {
        headers: { Authorization: `Bearer ${account}` },
      });
      if (res.status === 200) {
        const remarks = "Logs Max Records Updated";
        useCreateLog.getState().createLogs(module, activity, remarks);
        useAlertStatus.getState().setAlert(true);
      } else {
        const remarks = "Logs Max Records Update Failed";
        useCreateLog.getState().createLogs(module, activity, remarks);
      }
    } catch (e) {
      console.log(e);
      const remarks = "User Activity Log Update Connection Failed";
      useCreateLog.getState().createLogs(module, activity, remarks);
    }
  },
}));

export const useAlertStatus = create<AlertStatus>((set) => ({
  alert: false,
  setAlert: (alert) => set({ alert }),
}));

export const useTokenExpiredDialog = create<TokenExpired>((set) => ({
  tokenDialog: false,
  setTokenDialog: (tokenDialog) => set({ tokenDialog }),
}));

export const useNetworkError = create<NetworkError>((set) => ({
  isError: false,
  setIsError: (isError) => set({ isError }),
}));
//#endregion
