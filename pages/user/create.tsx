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



function Create() {
  // const createFormSchema = yup.object({
  //   name: yup.string().required(),
  //   email: yup.string().email().required(),
  //   password: yup.string().min(8, "Password must be at least 8 characters").required("Password is required"),
  //   confirmPassword: yup.string().oneOf([yup.ref("password"), undefined], "Passwords must match").required("Confirm Password is required"),
  //   phone: yup.string().required().min(11, "Phone number must be 11 digit").max(11, "Phone number must be 11 digit"),
  //   branch: yup.string().required(),
  //   role: yup.number().required(),
  //   permissions: yup.array()
  // });

  // const {
  //   register,
  //   setValue,
  //   handleSubmit,
  //   formState: { errors },
  //   reset,
  // } = useForm<createUserForm>({
  //   resolver: yupResolver(createFormSchema),
  // }); 

  const createFormSchema: Schema<createUserForm> = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required().messages({
      "string.min": "Password must be at least 8 characters",
    }),
    confirmPassword: Joi.string()
      .valid(Joi.ref("password"))
      .required(),
    phone: Joi.string().required().min(11).max(11).messages({
      "string.min": "Phone number must be 11 digits",
      "string.max": "Phone number must be 11 digits",
    }),
    branch: Joi.string().required(),
    role: Joi.number().required(),
    permissions: Joi.array().items(Joi.string()),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<createUserForm>({
    resolver: joiResolver(createFormSchema),
  });
  const branches =  useQuery(['branches'], () => getBranches())
  const permissions = useQuery(["permissions"], getPermissions);
  const submitForm = useMutation(user.create,{
    onSuccess: (data) => {
      reset()
      setPermissionState(false);
    }
  })

  
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
        {<MyAlert element={submitForm} message={'User Created Successfully'}/>}
        <form onSubmit={handleSubmit((data) => submitForm.mutate(data))}>
          <div className="grid md:grid-cols-2 md:space-x-2 ">
            <Label className="mt-5">
              <span>Full Name</span>
              <Input className="mt-1" {...register("name")} />
              <HelperText valid={false}>{errors.name?.message}</HelperText>
            </Label>
            <Label className="mt-5">
              <span>Email</span>
              <Input className="mt-1" type="email" {...register("email")} />
              <HelperText valid={false}>{errors.email?.message}</HelperText>
            </Label>
          </div>
          <div className="grid  md:grid-cols-2 md:space-x-2 ">
            <Label className="mt-5">
              <span>Password</span>
              <Input
                className="mt-1"
                type="password"
                {...register("password")}
              />
              <HelperText valid={false}>{errors.password?.message}</HelperText>
            </Label>
            <Label className="mt-5">
              <span>Confirm Password</span>
              <Input
                className="mt-1"
                type="password"
                {...register("confirmPassword")}
              />
              <HelperText valid={false}>
                {errors.confirmPassword?.message}
              </HelperText>
            </Label>
          </div>
          <div className="grid md:grid-cols-2 md:space-x-2 ">
            <Label className="mt-5">
              <span>Phone</span>
              <Input className="mt-1" {...register("phone")} />
              <HelperText valid={false}>{errors.phone?.message}</HelperText>
            </Label>
            <Label className="mt-5">
              <span>Role</span>
              <Select
                {...register("role")}
                className="mt-1"
                onChange={permissionBox}
              >
                <option value="1">Super Administrator</option>
                <option value="2">Staff</option>
              </Select>
              <HelperText valid={false}>{errors.role?.message}</HelperText>
            </Label>
          </div>
          <div className="grid md:grid-cols-2 md:space-x-2 ">
            <Label className="mt-5">
              <span>Branch</span>
              <Select className="mt-1" {...register("branch")}>
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
              <HelperText valid={false}>{errors.branch?.message}</HelperText>
            </Label>
            {permissionState ? (
              <Label className="mt-5">
                <span>Permission</span>
                <Select className="mt-1" multiple {...register("permissions")}>
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
                <HelperText valid={false}>
                  {errors.permissions?.message}
                </HelperText>
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
