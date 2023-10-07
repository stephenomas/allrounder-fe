import { HttpClient } from ".";
import Cookies from "js-cookie";
import { loginData, userRequest } from "types";
import { Mutation, useMutation } from "@tanstack/react-query";
import { useAppDispatch } from "hooks/redux";
import { actions as userActions } from "store/slices/userSlice";

const user : userRequest = {
  login : (input : loginData) => HttpClient.post('user/login', input)
}


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

