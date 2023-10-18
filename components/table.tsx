import React, {useState, useEffect, Dispatch, SetStateAction, useRef} from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import {
  Table,
  TableHeader,
  TableCell,
  TableBody,
  TableRow,
  TableFooter,
  TableContainer,
  Badge,
  Avatar,
  Button,
  Pagination,
} from "@roketid/windmill-react-ui";

import { EditIcon, TrashIcon } from "icons";

interface ITableProps {
  controls: {
    resultsPerPage: number;
    totalResults: number;
    currentPage: number;
    setCurrentPage: Dispatch<SetStateAction<number>>;
  };
  loading: boolean;
  headers: string[];
}



const TableComponent: React.FC<ITableProps> = ({controls, headers, loading, children}) => {

   const prevStateRef = useRef({
    total : 0,
    perpage : 0
   });
  // pagination change control
  function onPageChangeTable(p: number) {
    controls.setCurrentPage(p);

  }

  useEffect(() => {
    prevStateRef.current = {total : controls.totalResults, perpage : controls.resultsPerPage};
  },);


  return (
    <TableContainer className="mb-8">
      <Table>
        <TableHeader>
          <tr>
            {headers.map((header, i) => (
              <TableCell key={i}>{header}</TableCell>
            ))}
          </tr>
        </TableHeader>
        <TableBody>
          {!loading ? children : <SkeletonTable header={headers} numRows={5} />}
        </TableBody>
      </Table>
      <TableFooter>
        <Pagination
          totalResults={controls.totalResults || prevStateRef.current.total}
          resultsPerPage={controls.resultsPerPage || prevStateRef.current.perpage}
          onChange={onPageChangeTable}
          label="Table navigation"
        />
      </TableFooter>
    </TableContainer>
  );
};



const SkeletonTable : React.FC<{header: string[], numRows:number}> = ({ header, numRows }) => {
  // Create an array with the same length as the header to determine the column count
  const numColumns = header.length;

  // Create an array with `numRows` elements to generate rows
  const skeletonRows = Array.from({ length: numRows }, (_, index) => (
    <TableRow key={index}>
      {Array.from({ length: numColumns }, (__, columnIndex) => (
        <TableCell key={columnIndex}>
          <SkeletonTheme baseColor="#585957" highlightColor="#b7b8b6">
            <Skeleton height={20} width={"80%"} />
          </SkeletonTheme>
        </TableCell>
      ))}
    </TableRow>
  ));

  return <>{skeletonRows}</>;
};




export default TableComponent;



