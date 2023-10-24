import React, { useState } from "react";

import {
  Input,
  HelperText,
  Label,
  Select,
  Button, Alert
} from "@roketid/windmill-react-ui";
import CTA from "example/components/CTA";
import PageTitle from "example/components/Typography/PageTitle";
import SectionTitle from "example/components/Typography/SectionTitle";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import Layout from "containers/Layout";
import { MailIcon } from "icons";
import { getBranches } from "api-config/branch";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getPermissions } from "api-config/permission";
import { Branch, createUserForm, Permission } from "types";
import Joi, { Schema } from "joi";
import * as yup from "yup";
import { user } from "api-config/user";
import { ButtonSpinner } from "components/loaders";
import MyAlert from "components/alert";
import { joiResolver } from "@hookform/resolvers/joi";
import { Formik, Form, Field, useFormik } from "formik";



function Create() {
  const createFormSchema = yup.object({
    name: yup.string().required(),
    email: yup.string().email().required(),
    password: yup.string().min(8, "Password must be at least 8 characters").required("Password is required"),
    confirmPassword: yup.string().oneOf([yup.ref("password"), undefined], "Passwords must match").required("Confirm Password is required"),
    phone: yup.string().required().min(11, "Phone number must be 11 digit").max(11, "Phone number must be 11 digit"),
    branch: yup.string().required(),
    role: yup.number().required(),
    permissions: yup.array()
  });

   const initialValues: createUserForm =  {
     name: "",
     email: "",
     password: "",
     confirmPassword: "",
     phone: "",
     branch : "",
     role : 1,
     permissions:[]

   };
  const formik = useFormik({
    initialValues,
    validationSchema: createFormSchema,
    onSubmit: (data :any) => submitForm.mutate(data),
  });

  const branches =  useQuery(['branches'], () => getBranches())
  const permissions = useQuery(["permissions"], getPermissions);
  const submitForm = useMutation(user.create,{
    onSuccess: (data) => {
      formik.handleReset
      formik.resetForm()
      setPermissionState(false);
    }
  })

  
  const selectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    permissionBox(e);
    formik.handleChange(e);
  };
  const [permissionState, setPermissionState] = useState(false)
  const permissionBox = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    value == "2" ? setPermissionState(true) : setPermissionState(false);
  };  
  return (
    <Layout>
      <PageTitle>Create User</PageTitle>

      <SectionTitle>User Info</SectionTitle>
      <div className="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
        {<MyAlert element={submitForm} message={"User Created Successfully"} />}

        <form onSubmit={formik.handleSubmit}>
          <div className="grid md:grid-cols-2 md:space-x-2 ">
            <Label className="mt-5">
              <span>Full Name</span>
              <Input
                name="name"
                className="mt-1"
                value={formik.values.name}
                onChange={formik.handleChange}
              />
              {formik.touched.name && formik.errors.name && (
                <HelperText valid={false}>{formik.errors.name}</HelperText>
              )}
            </Label>
            <Label className="mt-5">
              <span>Email</span>
              <Input
                name="email"
                className="mt-1"
                type="email"
                value={formik.values.email}
                onChange={formik.handleChange}
              />
              {formik.touched.email && formik.errors.email && (
                <HelperText valid={false}>{formik.errors.email}</HelperText>
              )}
            </Label>
          </div>
          <div className="grid  md:grid-cols-2 md:space-x-2 ">
            <Label className="mt-5">
              <span>Password</span>
              <Input
                name="password"
                className="mt-1"
                type="password"
                value={formik.values.password}
                onChange={formik.handleChange}
              />
              {formik.touched.password && formik.errors.password && (
                <HelperText valid={false}>{formik.errors.password}</HelperText>
              )}
            </Label>
            <Label className="mt-5">
              <span>Confirm Password</span>
              <Input
                name="confirmPassword"
                className="mt-1"
                type="password"
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
              />
              {formik.touched.confirmPassword &&
                formik.errors.confirmPassword && (
                  <HelperText valid={false}>
                    {formik.errors.confirmPassword}
                  </HelperText>
                )}
            </Label>
          </div>
          <div className="grid md:grid-cols-2 md:space-x-2 ">
            <Label className="mt-5">
              <span>Phone</span>
              <Input
                name="phone"
                className="mt-1"
                value={formik.values.phone}
                onChange={formik.handleChange}
              />
              {formik.touched.phone && formik.errors.phone && (
                <HelperText valid={false}>{formik.errors.phone}</HelperText>
              )}
            </Label>
            <Label className="mt-5">
              <span>Role</span>
              <Select
                name="role"
                value={formik.values.role}
                className="mt-1"
                onChange={selectChange}
              >
                <option value="1">Super Administrator</option>
                <option value="2">Staff</option>
              </Select>
              {formik.touched.role && formik.errors.role && (
                <HelperText valid={false}>{formik.errors.role}</HelperText>
              )}
            </Label>
          </div>
          <div className="grid md:grid-cols-2 md:space-x-2 ">
            <Label className="mt-5">
              <span>Branch</span>
              <Select
                name="branch"
                className="mt-1"
                value={formik.values.branch}
                onChange={formik.handleChange}
              >
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
              {formik.touched.branch && formik.errors.branch && (
                <HelperText valid={false}>{formik.errors.branch}</HelperText>
              )}
            </Label>
            {permissionState ? (
              <Label className="mt-5">
                <span>Permission</span>
                <Select
                  className="mt-1"
                  multiple
                  name="permissions"
                  value={formik.values.permissions}
                  onChange={formik.handleChange}
                >
                  {permissions.data
                    ? permissions.data.data.map(
                        (permission: Permission, i: number) => (
                          <option key={i} value={permission.id}>
                            {permission.name}
                          </option>
                        )
                      )
                    : null}
                </Select>
                {formik.touched.permissions && formik.errors.permissions && (
                  <HelperText valid={false}>{formik.errors.permissions}</HelperText>
                )}
              </Label>
            ) : null}
          </div>
          <div className="mt-10 ">
            <Button className="background-primary-color w-50" type="submit">
              {submitForm.isLoading ? (
                <ButtonSpinner />
              ) : (
                <span>
                  Create account
                  <span className="ml-2" aria-hidden="true">
                    +
                  </span>
                </span>
              )}
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
}

export default Create;
