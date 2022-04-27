import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

import { userAuthSlice } from 'store/userAuth';

export const store = configureStore({
  reducer: {
    userAuth: userAuthSlice.reducer,
  },
});
export type StoreType = typeof store;

export const { setUserAuth, updateMyprofile } = userAuthSlice.actions;

type RootState = ReturnType<typeof store.getState>;
type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const isUserAuthSelector = (state: RootState): boolean =>
  state.userAuth !== null;
