import { ApiService } from "@/services";
import { useAccountStore, useAuthStore } from "@/store/useStore";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { getKeyIcon } from "@/models/dynamic";

export const use_SystemParam = () => {
  const { account } = useAccountStore();

  const { isError, isFetched, data, isLoading, error, refetch } = useQuery<any>(
    "syspar",
    async () =>
      await ApiService.get("syspar", {
        headers: { Authorization: `Bearer ${account}` },
      })
  );

  return {
    data,
    isError,
    isFetched,
    isLoading,
    error: error as any,
    account,
    refetch,
  };
};
