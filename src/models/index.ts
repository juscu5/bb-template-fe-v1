export interface KeyIcon {
  [key: string]: JSX.Element;
}

import { IconifyIcon } from "@iconify/react";

export interface IUser {
  id: string;
  avatarUrl: string;
  name: string;
  company: string;
  isVerified: boolean;
  status: string | undefined;
  role: string | undefined;
}

export interface IPost {
  id: string;
  cover: string;
  title: string;
  view: number;
  comment: number;
  share: number;
  favorite: number;
  createdAt: Date;
  author: {
    name: string;
    avatarUrl: string;
  };
}

export interface IAccount {
  displayName: string;
  email: string;
  photoURL: string;
  role: string | undefined;
}

export interface IProduct {
  id: string;
  cover: string;
  name: string;
  price: number;
  priceSale: number | null;
  colors: string[];
  status: string | undefined;
}

export interface NavItemConfig {
  title: string;
  path: string;
  icon: JSX.Element;
  info?: string;
  children?: any;
}

export interface News {
  image: any;
  title: any;
  description: any;
  postedAt: any;
}

export interface Site {
  icon: any;
  value: any;
  name: any;
}

export interface HeaderLabel {
  id: string;
  label: string;
  alignRight: boolean;
}

export interface HeaderLabel2 {
  id: string;
  header: string;
  size: number;
  format?: string;
  align?: "left" | "center" | "right";
  currency?: string;
  decimalCnt?: number;
  type:
    | "text"
    | "date"
    | "monetary"
    | "number"
    | "email"
    | "password"
    | "check"
    | "cndn";
  cndntype?: number;
}

export interface ActionElement {
  label: string;
  icon: IconifyIcon;
  callback?: (row: any) => void;
}

export interface ActionMenu {
  label: string;
  icon: IconifyIcon;
  type: "Edit" | "View" | "Delete" | "Access";
  callback?: (type: "Edit" | "View" | "Delete" | "Access", row: any) => void;
}

export interface FormElement {
  label: string;
  id: string;
  name: string;
  type:
    | "text"
    | "date"
    | "monetary"
    | "number"
    | "email"
    | "password"
    | "select"
    | "check"
    | "switch";
  switchStyle?: "MUI" | "Android" | "IOS" | "Ant";
  selectOpt?: any[];
  value?: any;
  hidden?: boolean;
  disabled?: boolean;
  required?: boolean;
  variant?: string;
  validation?: boolean;
  validationText?: string;
}

export interface TableSettings {
  stripeRows?: boolean;
  stripeColumns?: boolean;
  stripeColor?: string;
  addButton?: boolean;
  sysParam?: boolean;
  printButton?: boolean;
  columnAction?: boolean;
  columnOrdering?: boolean;
  columnPinning?: boolean;
}

export interface FormButton {
  label: string;
  callback?: () => void;
}
