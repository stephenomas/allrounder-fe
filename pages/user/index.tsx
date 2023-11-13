import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { ButtonSpinner } from "components/loaders";
//import { yupResolver } from "@hookform/resolvers/yup";
import LoadingOverlay from "react-loading-overlay-ts";
import { User as IUser } from "types";
import {
  addBranch as addBranchFn,
  getBranches,
  toggleBranch,
  updateBranch as updateBranchFn,
} from "api-config/branch";
import * as yup from "yup";
import { Branch as IBranch } from "types";
import {
  TableRow,
  TableCell,
  Button,
  Badge,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Label,
  Input,
  HelperText,
  Select,
  Alert,
} from "@roketid/windmill-react-ui";
import { EditIcon, TrashIcon } from "icons";
import PageTitle from "example/components/Typography/PageTitle";
import SectionTitle from "example/components/Typography/SectionTitle";
import CTA from "example/components/CTA";
import response, { ITableData } from "utils/demo/tableData";
import Layout from "containers/Layout";
import {
  QueryKey,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import TableComponent from "components/table";
import { nigerianStates } from "utils/constants";
import Link from "next/link";
import { user } from "api-config/user";


function Users() {
  const queryClient = useQueryClient();
  const notify = (message: string) => toast.success(message);
  const {
    mutate: toggle,
    isLoading: toggleLoading,
    error: toggleError,
    data: toggleData,
  } = useMutation(toggleBranch, {
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries(["users"]);
    },
    onError: (error) => {
      toast.error((error as any).response.data.message);
    },
  });


  const [currentPage, setCurrentPage] = useState(1);
  const { isLoading, isError, data, error } = useQuery(
    ["users", currentPage],
    () => user.index(currentPage)
  );

  const headers = [
    "Name",
    "Email",
    "Phone",
    "Branch",
    "Type",
    "Status",
    "Date Created",
    "Actions",
  ];

  return (
    <LoadingOverlay active={toggleLoading} spinner>
      <Layout>
        <PageTitle>User</PageTitle>
        <ToastContainer />
        <div className="flex justify-between">
          <SectionTitle>Users List</SectionTitle>
          <Link href={"user/create"} passHref>
            <Button className="w-20 mb-3 background-primary-color">
              <span className="mr-1" aria-hidden="true">
                +
              </span>
              User
            </Button>
          </Link>
        </div>

        <TableComponent
          loading={isLoading}
          controls={{
            resultsPerPage: data?.data.perPage,
            totalResults: data?.data.totalCount,
            currentPage,
            setCurrentPage,
          }}
          headers={headers}
        >
          {data &&
            data.data.users.map((user: IUser, i: number) => (
              <TableRow key={i}>
                <TableCell>
                  <span className="text-sm font-bold"> {user.name}</span>
                </TableCell>
                <TableCell>
                  <span className="text-sm"> {user.email}</span>
                </TableCell>
                <TableCell>
                  <span className="text-sm"> {user.phone}</span>
                </TableCell>
                <TableCell>
                  <span className="text-sm"> {user.branch!.name}</span>
                </TableCell>
                <TableCell>
                  <span className="text-sm">
                    {" "}
                    {user.role == 1 ? "Super Administrator" : "Staff"}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge type={user.status ? "success" : "danger"}>
                    {user.status ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className="text-sm">
                    {new Date(user.createdAt!).toLocaleDateString() ?? ""}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-4">
                    <Link href={`user/${user.id}`} passHref>
                      <Button layout="link" size="small" aria-label="Edit">
                        <EditIcon className="w-5 h-5" aria-hidden="true" />
                      </Button>
                    </Link>
                    <Button
                      className={`${
                        user.status ? "bg-red-600" : "bg-green-500"
                      } text-white dark:text-white`}
                      layout="link"
                      size="small"
                      aria-label="Delete"
                    >
                      {user.status ? "Disable" : "Enable"}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
        </TableComponent>
      </Layout>
    </LoadingOverlay>
  );
}

export default Users;
