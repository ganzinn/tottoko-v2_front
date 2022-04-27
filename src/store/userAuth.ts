import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LoginUser, UserAuth } from 'feature/models/user';

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
    updateMyprofile: (state, action: PayloadAction<Omit<LoginUser, 'id'>>) => {
      if (state === null) return null;

      return {
        ...state,
        loginUser: {
          ...state.loginUser,
          ...action.payload,
          // name: action.payload.name,
          // email: action.payload.email,
          // avatarUrl: action.payload.avatarUrl,
        },
      };
    },
  },
});
