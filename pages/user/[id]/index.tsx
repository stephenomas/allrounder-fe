import React, { useState } from "react";
import {
  Input,
  HelperText,
  Label,
  Select,
  Button,
  Alert,
} from "@roketid/windmill-react-ui";
import CTA from "example/components/CTA";
import PageTitle from "example/components/Typography/PageTitle";
import SectionTitle from "example/components/Typography/SectionTitle";
import { useForm } from "react-hook-form";
import Layout from "containers/Layout";
import { MailIcon } from "icons";
import { getBranches } from "api-config/branch";
import { useMutation, useQuery, QueryClient, useQueryClient } from '@tanstack/react-query';
import { getPermissions } from "api-config/permission";
import { Branch, createUserForm, Permission, User } from "types";
import * as yup from "yup";
import { user as userAPI, user } from 'api-config/user';
import { ButtonSpinner } from "components/loaders";
import MyAlert from "components/alert";
import { GetServerSidePropsContext } from "next";
import { parse } from "cookie";
import { baseUrl } from "utils/constants";
import { editUserForm } from '../../../types/index';
import { Formik, Field, Form, ErrorMessage } from "formik";




const EditUser = ({user} : {user :User}) => {
  const queryClient = useQueryClient()
  
 
  const editFormSchema = yup.object().shape({
    name: yup.string().required(),
    email: yup.string().email().required(),
    password: yup.lazy((value) => {
    if (value && value.length > 0) {
      return yup.string()
        .min(8, 'Password must be at least 8 characters')
        .required('Password is required');
    }
    return yup.string().notRequired();
  }),
    confirmPassword: yup.string().oneOf([yup.ref('password')], 'Passwords must match'),
    phone: yup
      .string()
      .required()
      .min(11, "Phone number must be 11 digit")
      .max(11, "Phone number must be 11 digit"),
    branch: yup.string().required(),
    role: yup.number().required(),
    permissions: yup.array(),
  });
  const userData = useQuery(['userData', user.id], () => userAPI.show(user.id), {
    initialData :{ data: {data :user}, status: 200, statusText: 'OK', headers: {}, config: {} }
  });
 console.log(userData.data.data?.data);
  const initialValues: Partial<createUserForm> = {
    name: userData.data.data.data?.name,
    email: userData.data.data.data?.email,
    phone: userData.data.data.data?.phone,
    role: userData.data.data.data?.role,
    branch: userData.data.data.data?.branch.id,
    permissions: userData.data.data.data?.permissions,
  };
 
  
  const branches = useQuery(["branches"], () => getBranches());
  const permissions = useQuery(["permissions"], getPermissions);

  const submitForm = useMutation((variables : {id:string, input: any}) => userAPI.update(variables.id, variables.input), {
    onSuccess: (data) => {
      queryClient.invalidateQueries(['userData'])
      setPermissionState(userData.data.data.role == 2);
    },
  });

  const [permissionState, setPermissionState] = useState(userData.data.data.data?.role == 2);
  const permissionBox = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    value == "2" ? setPermissionState(true) : setPermissionState(false);
  };

  const submitFormFn = (data : {[key:string]: any}) => {
        const finalData = Object.keys(data)
          .filter(
            (key) =>
              data[key] !== null && data[key] !== undefined && data[key] !== ""
          )
          .reduce((result :any, key) => {
            result[key] = data[key];
            return result;
          }, {});
     
        submitForm.mutate({ id: user.id, input: finalData });
  }


  
  
  return (
    <Layout>
      <PageTitle>Edit User</PageTitle>

      <SectionTitle>User Info</SectionTitle>
      <div className="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
        {<MyAlert element={submitForm} message={"User Updated Successfully"} />}
        <Formik
          initialValues={initialValues}
          validationSchema={editFormSchema}
          onSubmit={submitFormFn}
        >
          {({ values, handleChange, isSubmitting, touched, errors }) => (
            <Form>
              <div className="grid md:grid-cols-2 md:space-x-2 ">
                <Label className="mt-5">
                  <span>Full Name</span>

                  <Input
                    className="mt-1"
                    name="name"
                    value={values.name}
                    onChange={handleChange}
                  />
                  <HelperText valid={false}>{errors.name}</HelperText>
                </Label>
                <Label className="mt-5">
                  <span>Email</span>
                  <Input
                    disabled
                    className="mt-1"
                    type="email"
                    name="email"
                    value={values.email}
                  />
                  <HelperText valid={false}>{errors.email}</HelperText>
                </Label>
              </div>
              <div className="grid  md:grid-cols-2 md:space-x-2 ">
                <Label className="mt-5">
                  <span>Password</span>
                  <Input
                    className="mt-1"
                    type="password"
                    name="password"
                    value={values.password}
                    onChange={handleChange}
                  />
                  <HelperText valid={false}>{errors.password}</HelperText>
                </Label>
                <Label className="mt-5">
                  <span>Confirm Password</span>
                  <Input
                    className="mt-1"
                    type="password"
                    name="confirmpassword"
                    value={values.confirmPassword}
                    onChange={handleChange}
                  />
                  <HelperText valid={false}>
                    {errors.confirmPassword}
                  </HelperText>
                </Label>
              </div>
              <div className="grid md:grid-cols-2 md:space-x-2 ">
                <Label className="mt-5">
                  <span>Phone</span>
                  <Input
                    className="mt-1"
                    name="phone"
                    value={values.phone}
                    onChange={handleChange}
                  />
                  <HelperText valid={false}>{errors.phone}</HelperText>
                </Label>
                <Label className="mt-5">
                  <span>Role</span>
                  <Select
                    name="role"
                    value={values.role}
                    className="mt-1"
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                      permissionBox(e);
                      handleChange(e);
                    }}
                  >
                    {/* <option value={userData.data.data?.data?.role}>{userData.data.data?.data?.role == 1 ? 'Super Administrator' : 'Staff'}</option> */}
                    <option value="1">Super Administrator</option>
                    <option value="2">Staff</option>
                  </Select>
                  <HelperText valid={false}>{errors.role}</HelperText>
                </Label>
              </div>
              <div className="grid md:grid-cols-2 md:space-x-2 ">
                <Label className="mt-5">
                  <span>Branch</span>
                  <Select
                    className="mt-1"
                    name="branch"
                    value={values.branch}
                    onChange={handleChange}
                  >
                    <option
                      value={
                        userData.data
                          ? userData.data.data?.data?.branch?.id
                          : null
                      }
                    >
                      {userData.data
                        ? userData.data.data?.data?.branch?.name
                        : null}
                    </option>
                    {branches.data
                      ? branches.data.data.branches.map(
                          (branch: Branch, i: number) => (
                            <option key={i} value={branch.id}>
                              {branch.name}
                            </option>
                          )
                        )
                      : null}
                    <option></option>
                  </Select>
                  <HelperText valid={false}>{errors.branch}</HelperText>
                </Label>
                {permissionState ? (
                  <Label className="mt-5">
                    <span>Permission</span>
                    <Select
                      className="mt-1"
                      multiple
                      name="permissions"
                      value={values.permissions}
                      onChange={handleChange}
                    >
                      {permissions.data
                        ? permissions.data.data.map(
                            (permission: Permission, i: number) => (
                              <option
                                selected={user.permissions.includes(
                                  permission.id
                                )}
                                key={i}
                                value={permission.id}
                              >
                                {permission.name}
                              </option>
                            )
                          )
                        : null}
                    </Select>
                    <HelperText valid={false}>{errors.permissions}</HelperText>
                  </Label>
                ) : null}
              </div>
              <div className="mt-10 ">
                <Button className="background-primary-color w-50" type="submit">
                  {submitForm.isLoading ? (
                    <ButtonSpinner />
                  ) : (
                    <span>Edit account</span>
                  )}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </Layout>
  );
}

export const getServerSideProps = async (context : GetServerSidePropsContext) => {
  const { req } = context;
  const id = context.params?.id
  const cookies = parse(req.headers.cookie || "");
  const authToken = cookies.AUTH_TOKEN;
    try{

      const res = await fetch(`${baseUrl}/user/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });

      const data = await res.json();
        if(data.data){
            return {
              props: {
                user: data.data,
              },
            };
        }else{
          return {
            redirect: {
              destination: "/user/",
              permanent: false,
            },
          };
        }
      
    }catch(error){
      
     return {
       redirect: {
         destination: "/user/",
         permanent: false,
       },
     };
    }
  

}

export default EditUser