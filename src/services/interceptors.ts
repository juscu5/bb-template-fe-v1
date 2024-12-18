import { axiosInstance } from "./instance";
import { useTokenExpiredDialog } from "@/store/useStore";
import { useNetworkError } from "@/store/useStore";
import { useCallback } from "react";
import _ from "lodash";

const useAxiosInterceptors = () => {
  const { setTokenDialog } = useTokenExpiredDialog();
  const { setIsError } = useNetworkError();

  const debounceSetIsLoading = useCallback(_.debounce(setIsError, 300), []);
  const debounceSetTokenDialog = useCallback(
    _.debounce(setTokenDialog, 300),
    []
  );

  axiosInstance.interceptors.response.use(
    (response: any) => {
      debounceSetIsLoading(false);
      return response;
    },
    (error: any) => {
      // If Token has Expired
      if (error.response && error.response.status === 401) {
        localStorage.removeItem("account");
        debounceSetTokenDialog(true);
      }
      // If Network Error
      if (error.code && error.code === "ERR_NETWORK") {
        debounceSetIsLoading(true);
      }
      return Promise.reject(error);
    }
  );
};

export { useAxiosInterceptors };
