/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserAuth } from 'feature/models/user';

const initialState = null as UserAuth;

export const userAuthSlice = createSlice({
  name: 'userAuth',
  initialState,
  reducers: {
    setUserAuth: (state, action: PayloadAction<UserAuth>) => action.payload,
    // {
    //   Object.assign(state, action.payload);
    //   // state.tokens = action.payload.tokens;
    //   // state.loginUser = action.payload.loginUser;
    // },
  },
});
