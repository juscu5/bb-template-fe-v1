import { ApiService } from "..";

export const postActivityLog = async ({
  account,
  payload,
}: {
  account: string;
  payload: any;
}) => {
  const response = await ApiService.post("useractivitylog/", payload, {
    headers: { Authorization: `Bearer ${account}` },
  });
  return response.status == 200;
};
