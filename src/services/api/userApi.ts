import { ApiService } from "..";
import { useAccountStore } from "@/store/useStore";
import { serverURL } from "@/config";

export interface LoginResponse {
  code: number;
  status: string;
  payload: {
    BearerToken: string;
  };
}

export interface ProfileResponse {
  status: string;
  code: number;
  payload: {};
}

export const loginUser = async (credentials: {
  usrcde: string;
  usrpwd: string;
}): Promise<LoginResponse> => {
  const response = await fetch(serverURL + "users/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    throw new Error(`Network response was not ok: ${response.statusText}`);
  }

  const data = await response.json();
  return data;
};

export const isLoggedIn = async (account: string): Promise<ProfileResponse> => {
  const response = await ApiService.get("users/me", {
    headers: { Authorization: `Bearer ${account}` },
  });

  const data = await response.data;
  return data;
};

export const changePass = async (credentials: {
  usrcde: string;
  usrpwd: string;
  newpass: string;
}): Promise<any> => {
  const account = useAccountStore.getState().account;
  console.log(JSON.stringify(credentials));
  console.log(credentials);
  // const response = await fetch("http://localhost:8080/api/users/changepass", {
  //   method: "POST",
  //   // headers: { Authorization: `Bearer ${account}` },
  //   body: JSON.stringify(credentials),
  // });

  const response = await ApiService.post("users/changepass", credentials, {
    headers: { Authorization: `Bearer ${account}` },
  });

  // if (!response.ok) {
  //   throw new Error(`Network response was not ok: ${response.statusText}`);
  // }
  // const data = await response.json();
  return response.data;
};
