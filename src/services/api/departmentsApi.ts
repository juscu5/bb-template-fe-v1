import { ApiService } from "..";


export const postDepartment = async ( { account, payload }: { account: string, payload: any }) => {
    const response = await ApiService.post("departments/", payload, {headers: {"Authorization": `Bearer ${account}`}});
    
    return response.status==200;
}