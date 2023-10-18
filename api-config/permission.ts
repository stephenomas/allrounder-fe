import { HttpClient } from "api-config";
import { Branch } from "types";

export const getPermissions = () =>
  HttpClient.get("/permission");

