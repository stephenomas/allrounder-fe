import { AxiosResponse } from "axios";
import { Maybe } from "yup";

export interface userRequest {
  [key: string]: (...args: any[]) => Promise<AxiosResponse<any>>;
}

export type loginData = {
  email: string,
  password: string

};

export type User = {
  id: string ,
  name: string,
  email: string,
  phone: string,
  branch: Branch,
  role: number,
  photo?: string,
  status: boolean,
  createdAt?: string,
  permissions: string[]
};

export type Branch = {
  name : string,
  address : string,
  state: string,
  id?: string,
  createdAt?: string,
  status? : boolean

}

export type Permission = {
  name : string,
  id: string
}

export type createUserForm = {
  name: string;
  role: number;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  branch: any;
  permissions?: string[];
};

export type editUserForm = {
  name: string;
  role: number;
  email: string;
  password?: Maybe< string | undefined>;
  confirmPassword?: string;
  phone: string;
  branch: any;
  permissions?: string[];
};