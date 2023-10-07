import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "types";

type userState = {
  user : User
}

const InitialState : User = {
   id: null,
    name: null,
    email:null,
    phone:  null,
    branch:  null,
    role: null,
    photo: null,
    permissions: []
};
const userSlice = createSlice({
  name: 'user',
  initialState : InitialState,
  reducers : {
    login : (state, action : PayloadAction<any>) =>{
      const user  =  action.payload
      state.id = user.id;
      state.name = user.name;
      state.email = user.email;
      state.phone = user.phone;
      state.branch = user.branch;
      state.role = user.role;
      state.photo = user.photo;
      state.permissions = user.permissions;
    }
  },
  extraReducers: builder => {

  }

})
const userReducer = userSlice.reducer

export const actions = userSlice.actions
export default userReducer

