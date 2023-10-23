import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from 'yup';
import { useForm } from "react-hook-form";
import {
  Label,
  Input,
  Button,
  WindmillContext, Alert
} from "@roketid/windmill-react-ui";
import { GithubIcon, TwitterIcon } from "icons";
import { loginData } from '../types/index';
import { useLogin } from '../api-config/user';
import { ButtonSpinner } from "components/loaders";
import Cookies from "js-cookie";
import { PageLoader } from '../components/loaders';
import Joi, { Schema } from "joi";
import { joiResolver } from "@hookform/resolvers/joi";


export const getStaticProps = (context: any) => {
  const jwt = context.req?.cookies?.AUTH_TOKEN;
  if (jwt) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};

function LoginPage() {
//   const loginSchema = yup.object({
//   email: yup.string().required().email(),
//   password: yup.string().required(),
// });

const loginSchema: Schema<loginData> = Joi.object({
  email: Joi.string().required().email(),
  password: Joi.string().required(),
});
  const { mode } = useContext(WindmillContext);
  const [check, setCheck] = useState(true);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<loginData>({
    resolver: joiResolver(loginSchema),
  });
  // const { register,setValue,handleSubmit,formState: { errors },} = useForm<loginData>({
  //   resolver :yupResolver(loginSchema)
  // });
  const {mutate:login, isLoading, error, data:submitData} = useLogin();
  const submitForm = handleSubmit((data) => {
      login(data)
    })

  useEffect(() =>{

    const  checkAuthentication = async () => {
      if (submitData || Cookies.get("AUTH_TOKEN")) {
        await router.push("/"); // Use await to ensure the redirection is complete
      
      } 
      setCheck(false); // Set loading state to false after the check
    };
    checkAuthentication();
  })

  if(check){
    return null;
  }


  // useEffect(() => {
  //    if (submitData) {
  //      router.push("/");
  //     // console.log(submitData)
  //    }
  // }, [submitData])


  const imgSource =
    mode === "dark"
      ? "/assets/img/login-office-dark.jpeg"
      : "/assets/img/login-office.jpeg";

  return (
    <div className="flex items-center min-h-screen p-6 bg-gray-50 dark:bg-gray-900">
      <div className="flex-1 h-full max-w-4xl mx-auto overflow-hidden bg-white rounded-lg shadow-xl dark:bg-gray-800">
        <div className="flex flex-col overflow-y-auto md:flex-row">
          <div className="relative h-32 md:h-auto md:w-1/2">
            <Image
              aria-hidden="true"
              className="hidden object-cover w-full h-full"
              src={imgSource}
              alt="Office"
              layout="fill"
            />
          </div>
          <main className="flex items-center justify-center p-6 sm:p-12 md:w-1/2">
            <div className="w-full">
              <h1 className="mb-4 text-xl font-semibold text-gray-700 dark:text-gray-200">
                Login
              </h1>
              {error ? (<Alert type="danger">
                  {(error as any).response?.data?.message
                    ? (error as any).response.data.message
                    : "Server Error. Try again"}
              </Alert>): ''
               
              }
              <p className="mt-3 text-red-600 font-bold">
                
              </p>
              <form onSubmit={submitForm}>
                <Label>
                  <span>Email</span>
                  <Input
                    className="mt-1"
                    type="email"
                    placeholder="john@doe.com"
                    {...register("email")}
                  />
                  <p>{errors.email?.message}</p>
                </Label>

                <Label className="mt-4">
                  <span>Password</span>
                  <Input
                    className="mt-1"
                    type="password"
                    placeholder="***************"
                    {...register("password")}
                  />
                  <p>{errors.password?.message}</p>
                </Label>

                <Button
                  className="mt-4 background-primary-color"
                  block
                  type="submit"
                >
                  {isLoading ? <ButtonSpinner /> : "Log In"}
                </Button>
              </form>
              <hr className="my-8" />

              <p className="mt-4">
                <Link href="/example/forgot-password">
                  <a className="text-sm text-primary-color font-medium dark:text-primary-color hover:underline">
                    Forgot your password?
                  </a>
                </Link>
              </p>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
