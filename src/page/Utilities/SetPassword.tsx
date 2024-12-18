import LSTVForm from "@/components/lstv-dialog/LSTVForm";
import { LSTVPageRootStyle } from "@/components/Dynamic";
import { FormButton, FormElement } from "@/models";
import { usePassValidation } from "@/store/useStore";

const FORM_TITLE = "Setup Password";

const formElements = (): FormElement[] => {
  const { oldpass, newpass, reNewpass } = usePassValidation();
  return [
    {
      id: "oldpass",
      label: "Type Old Password",
      name: "oldpass",
      type: "password",
      validation: oldpass!,
      validationText: "Incorrect Password",
    },
    {
      id: "newpass",
      label: "Type New Password",
      name: "newpass",
      type: "password",
      validation: newpass!,
      validationText: "Password Mismatch",
    },
    {
      id: "reNewpass",
      label: "Re-type New Password",
      name: "reNewpass",
      type: "password",
      validation: reNewpass!,
      validationText: "Password Mismatch",
    },
  ];
};

const FORM_BUTTON: FormButton[] = [
  {
    label: "save",
    callback: () => {},
  },
];

const SetPassword = (): JSX.Element => {
  const FORM_ELEMENTS = formElements();
  return (
    <LSTVPageRootStyle style={{ alignItems: "center", marginTop: "-150px" }}>
      <LSTVForm title={FORM_TITLE} formElements={FORM_ELEMENTS} />
    </LSTVPageRootStyle>
  );
};

export default SetPassword;
