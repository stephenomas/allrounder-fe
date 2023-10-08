import { AxiosResponse } from "axios";

export interface userRequest {
  [key: string]: (...args: any[]) => Promise<AxiosResponse<any>>;
}

export type loginData = {
  email: string,
  password: string

};

export type User = {
  id: string | null,
  name: string | null,
  email: string | null,
  phone: string | null,
  branch: string | null,
  role: Number | null,
  photo?: string | null,
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