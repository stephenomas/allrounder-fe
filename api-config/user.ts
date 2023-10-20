import { HttpClient } from ".";
import Cookies from "js-cookie";
import { loginData, userRequest } from "types";
import { Mutation, useMutation } from "@tanstack/react-query";
import { useAppDispatch } from "hooks/redux";
import { actions as userActions } from "store/slices/userSlice";

const URL_PREFIX = 'user'

export const user: userRequest = {
  login: (input: loginData) => HttpClient.post(`${URL_PREFIX}/login`, input),
  logout: () => HttpClient.post(`${URL_PREFIX}/logout`),
  create: (input: any) => HttpClient.post(`${URL_PREFIX}/register`, input),
  index: (page: number) => HttpClient.get(`${URL_PREFIX}`, page),
  show: (user: string) => HttpClient.get(`${URL_PREFIX}/${user}`),
  update: (user: string, input: any) => HttpClient.put(`${URL_PREFIX}/${user}`,input),
};


export const useLogin = () => {
  const dispatch = useAppDispatch()
  const { mutate, isLoading, error, data } = useMutation(user.login, {
    onSuccess: (data) => {
      Cookies.set('AUTH_TOKEN', data.data.token)
      dispatch(userActions.login(data.data.user))
    },
  });

  return {
    mutate,
    isLoading,
    error,
    data,
  };
};

export const useLogout = () => {
  const dispatch = useAppDispatch();
  const { mutate, isLoading, error, data } = useMutation(user.logout, {
    onSuccess: (data) => {
      Cookies.remove("AUTH_TOKEN");
      ///dispatch(userActions.login(data.data.user));
    },
  });

  return {
    mutate,
    isLoading,
    error,
    data,
  };
};

