import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { ButtonSpinner } from "components/loaders";
import { Formik, Field, Form, ErrorMessage } from "formik";
import LoadingOverlay from "react-loading-overlay-ts";
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
  Alert
} from "@roketid/windmill-react-ui";
import { EditIcon, TrashIcon } from "icons";
import PageTitle from "example/components/Typography/PageTitle";
import SectionTitle from "example/components/Typography/SectionTitle";
import CTA from "example/components/CTA";
import response, { ITableData } from "utils/demo/tableData";
import Layout from "containers/Layout";
import { QueryKey, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import TableComponent from "components/table";
import { nigerianStates } from "utils/constants";
import Joi, { Schema } from "joi";
import MyAlert from "components/alert";
import { updateBranch } from '../api-config/branch';

type ModalProps = {
  isModalOpen: boolean;
  closeModal: () => void;
  branch?: IBranch;
};
function Branch() {
  const queryClient = useQueryClient()
  const notify = (message : string) => toast.success(message);
  const {mutate:toggle, isLoading: toggleLoading, error:toggleError, data:toggleData} =  useMutation(toggleBranch, {
    onSuccess : (data) => {
      toast.success(data.message)
      queryClient.invalidateQueries(["branches"])
      
    },
    onError : (error) => {
      toast.error((error as any).response.data.message)
    }
  })

  const [modal, setModal] = useState({
  state : false,
  modal : {}
  });

   function openAddModal(branch : IBranch| boolean) {
    branch
      ? setModal({
          state: true,
          modal: (
            <AddModal
              isModalOpen={true}
              closeModal={closeAddModal}
              branch={branch as IBranch}
            />
          ),
        })
  
        
      : setModal({
          state: true,
          modal: (
            <AddModal
              isModalOpen={true}
              closeModal={closeAddModal}
            />
          ),
        });
   }


   function closeAddModal() {
     setModal({...modal, state:false});
   }

  

  const [currentPage, setCurrentPage] = useState(1);
  const { isLoading, isError, data, error } = useQuery(["branches", currentPage], () => getBranches(currentPage));

  
  const headers = [
    'Name',
    'Address',
    'State',
    'Status',
    'Date Created',
    'Actions'
  ]




  return (
    <LoadingOverlay
      active={toggleLoading}
      spinner
     
    >
      <Layout>
        <PageTitle>Branch</PageTitle>
        <ToastContainer />
        <div className="flex justify-between">
          <SectionTitle>Branches List</SectionTitle>
          <Button
            className="w-20 mb-3 background-primary-color"
            onClick={() => openAddModal(false)}
          >
            <span className="mr-1" aria-hidden="true">
              +
            </span>
            Branch
          </Button>
          {modal.state ? modal.modal : ""}
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
            data.data.branches.map((branch: IBranch, i: number) => (
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
                    {branch.status ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className="text-sm">
                    {new Date(branch.createdAt!).toLocaleDateString() ?? ""}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-4">
                    <Button
                      onClick={() => openAddModal(branch)}
                      layout="link"
                      size="small"
                      aria-label="Edit"
                    >
                      <EditIcon className="w-5 h-5" aria-hidden="true" />
                    </Button>
                    <Button
                      onClick={() => toggle(branch)}
                      className={`${
                        branch.status ? "bg-red-600" : "bg-green-500"
                      } text-white dark:text-white`}
                      layout="link"
                      size="small"
                      aria-label="Delete"
                    >
                      { branch.status ? (
                        "Disable"
                      ) : (
                        "Enable"
                      )}
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


const AddModal : React.FC<ModalProps> =  ({isModalOpen, closeModal, ...props}) => {
  const queryClient  = useQueryClient();
  const branchSchema =
    yup.object().shape({
      name: yup.string().required(),
      state: yup.string().required(),
      address: yup.string().required()
    });
   
  const initialValues : IBranch = props.branch || {
    name: "",
    state: "",
    address: "",
  };

   const addBranch = useMutation(addBranchFn,{
    onSuccess : (data) => {
       queryClient.invalidateQueries(["branches"]);
      
    },
    onError : (data) => {

    }
   });
  const updateBranch = useMutation(updateBranchFn, {
    onSuccess: (data) => {
      queryClient.invalidateQueries(["branches"]);
    },
  });
   const submitForm =(data :any) => {
  
    if(props.branch){
      updateBranch.mutate(data)
    }else{
      addBranch.mutate(data);
    }
 
   };

  return (
    <Modal isOpen={isModalOpen} onClose={closeModal}>
      <Formik
        initialValues={initialValues}
        validationSchema={branchSchema}
        onSubmit={submitForm}
      >
        {({ values, handleChange, isSubmitting, touched, errors }) => (
          <Form>
            <ModalHeader>{props.branch ? "Edit" : "New"} Branch</ModalHeader>
            {<MyAlert element={addBranch} message={"Branch Created Successfully"} />}

            {<MyAlert element={updateBranch} message={"Branch Updated Successfully"} />}

            <ModalBody>
              <div className="grid grid-col-1 md:grid-cols-2 gap-4">
                {props.branch ? (
                  <Field
                    type="text"
                    name="id"
                    hidden={true}
                    value={props.branch.id}
                  />
                ) : (
                  ""
                )}
                <Label>
                  <span>Branch Name</span>
                  <Input
                    className="mt-1"
                    name="name"
                    type="text"
                    value={values.name}
                    onChange={handleChange}
                  />
                  {touched.name && errors.name && (
                    <HelperText valid={false}>{errors.name}</HelperText>
                  )}
                </Label>
                <Label>
                  <span>Branch Address</span>
                  <Input
                    type="text"
                    className="mt-1"
                    name="address"
                    value={values.address}
                    onChange={handleChange}
                  />
                  {touched.address && errors.address && (
                    <HelperText valid={false}>{errors.address}</HelperText>
                  )}
                </Label>
              </div>
              <Label className="mt-4">
                <span>Select State</span>
                <Select className="mt-1" name="state" onChange={handleChange}>
                  {props.branch ? <option> {props.branch.state}</option> : ""}
                  {nigerianStates.map((state, i) => (
                    <option key={i} value={state}>
                      {state}
                    </option>
                  ))}
                </Select>
              </Label>
            </ModalBody>
            <ModalFooter>
              <div className="hidden sm:block">
                <Button layout="outline" onClick={closeModal}>
                  Cancel
                </Button>
              </div>
              <div className="hidden sm:block">
                <Button type="submit">
                  {" "}
                  {addBranch.isLoading || updateBranch.isLoading ? (
                    <ButtonSpinner />
                  ) : (
                    "Submit"
                  )}
                </Button>
              </div>
              <div className="block w-full sm:hidden">
                <Button
                  block
                  size="large"
                  layout="outline"
                  onClick={closeModal}
                >
                  Cancel
                </Button>
              </div>
              <div className="block w-full sm:hidden">
                <Button type="submit" block size="large">
                  {addBranch.isLoading || updateBranch.isLoading ? (
                    <ButtonSpinner />
                  ) : (
                    "Submit"
                  )}
                </Button>
              </div>
            </ModalFooter>
          </Form>
        )}
      </Formik>
    </Modal>
  );
}


export default Branch;
