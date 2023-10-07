import React, { useState, useEffect } from "react";
import { Branch as IBranch } from "types";
import { TableRow, TableCell, Button, Badge } from "@roketid/windmill-react-ui";
import { EditIcon, TrashIcon } from "icons";
import PageTitle from "example/components/Typography/PageTitle";
import SectionTitle from "example/components/Typography/SectionTitle";
import CTA from "example/components/CTA";
import response, { ITableData } from "utils/demo/tableData";
import Layout from "example/containers/Layout";
import { QueryKey, useQuery } from "@tanstack/react-query";
import { getBranches } from "api-config/branch";
import TableComponent from "components/table";
// make a copy of the data, for the second table
const response2 = response.concat([]);

function Branch() {

 const { isLoading, isError, data, error } = useQuery(["branches"], getBranches);

  // pagination setup
  const controls = {
    resultsPerPage: 10,
    totalResults: 15
  }
  const headers = [
    'Name',
    'Address',
    'State',
    'Status',
    'Date Created',
    'Actions'
  ]



  return (
    <Layout>
      <PageTitle>Branch</PageTitle>

      <CTA />

      <SectionTitle>Branches List</SectionTitle>
      <TableComponent loading={isLoading} controls={controls} headers={headers}>
        {data &&
          data.data.map((branch: IBranch, i: number) => (
            <TableRow key={i}>
              <TableCell>
                <span className="text-sm font-bold"> {branch.name}</span>
              </TableCell>
              <TableCell>
                <span className="text-sm"> {branch.address}</span>
              </TableCell>
              <TableCell>
                <span className="text-sm"> {branch.state}</span>
              </TableCell>
              <TableCell>
                <Badge type={branch.status ? "success" : "danger"}>
                  {branch.status ? 'Active' : 'Inactive'}
                </Badge>
              </TableCell>
              <TableCell>
                <span className="text-sm">
                  {new Date(branch.createdAt).toLocaleDateString() ?? ''}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-4">
                  <Button layout="link" size="small" aria-label="Edit">
                    <EditIcon className="w-5 h-5" aria-hidden="true" />
                  </Button>
                  <Button layout="link" size="small" aria-label="Delete">
                    <TrashIcon className="w-5 h-5" aria-hidden="true" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
      </TableComponent>
    </Layout>
  );
}

export default Branch;
