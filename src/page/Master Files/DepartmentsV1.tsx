import { LSTVPageRootStyle } from "@/components/Dynamic";
import { LSTVTable } from "@/components/lstv-table/LSTVTable";
import { ActionElement, FormElement, HeaderLabel } from "@/models";
import { ApiService } from "@/services";
import { useAccountStore } from "@/store/useStore";
import { useMutation, useQuery } from "react-query";
import { postDepartment } from "@/services/api/departmentsApi";
import eyeFill from "@iconify/icons-eva/eye-fill";
import trashFill from "@iconify/icons-eva/trash-fill";
import editFill from "@iconify/icons-eva/edit-fill";

const TABLE_HEAD: HeaderLabel[] = [
  {
    id: "deptdescription",
    label: "Deepartment Description",
    alignRight: false,
  },
];

const ACTION_ELEMENTS: ActionElement[] = [
  {
    label: "See employees",
    icon: eyeFill,
    callback: (row: any) => {
      console.log(row);
    },
  },
  {
    label: "Delete",
    icon: trashFill,
    callback: () => {
      console.log("Inspection lang bosss");
    },
  },
  {
    label: "Edit",
    icon: editFill,
    callback: () => {
      console.log("Edit mo to");
    },
  },
];

const FORM_ELEMENTS: FormElement[] = [
  {
    id: "deptdescription",
    label: "Department Description",
    name: "deptdescription",
    type: "text",
  },
  {
    id: "deptdescription",
    label: "Department Description",
    name: "deptdescription",
    type: "text",
  },
];

export default function DepartmentsPage() {
  const { account } = useAccountStore();

  const postDeptMutation = useMutation(postDepartment, {
    onSuccess: (data) => {
      console.log(data);
    },
    onError: (err) => {
      console.log("error");
    },
  });

  const { isError, isFetched, data, isLoading, error, refetch } = useQuery<any>(
    "departments",
    async () =>
      await ApiService.get("departments", {
        headers: { Authorization: `Bearer ${account}` },
      })
  );

  const onAdd = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries((formData as any).entries());

    const deptdescription = formJson.deptdescription;

    postDeptMutation.mutate({
      account,
      payload: {
        deptdescription,
      },
    });

    refetch();
  };

  return (
    <LSTVPageRootStyle>
      <LSTVTable
        title={"Departments"}
        placeholder={"Search department"}
        tableHead={TABLE_HEAD}
        tableData={data?.data?.payload || []}
        actionElements={ACTION_ELEMENTS}
        formElements={FORM_ELEMENTS}
        dialogContent="Please fill out the department fields"
        dialogTitle="Add Department"
        addCallback={onAdd}
      ></LSTVTable>
    </LSTVPageRootStyle>
  );
};
