import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "types";

type userState = {
  user : User
}

const InitialState = {
  
};
const userSlice = createSlice({
  name: 'user',
  initialState : InitialState,
  reducers : {
    login : (state, action : PayloadAction<any>) =>{
      const user  =  action.payload

    }
  },
  extraReducers: builder => {

  }

})
const userReducer = userSlice.reducer

export const actions = userSlice.actions
export default userReducer

