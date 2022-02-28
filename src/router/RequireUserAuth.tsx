import { VFC } from 'react';
import { useLocation, Navigate } from 'react-router-dom';

import { isUserAuthSelector, useAppSelector } from 'store';

type Type = {
  children: JSX.Element;
};

export const RequireUserAuth: VFC<Type> = ({ children }) => {
  const isUserAuth = useAppSelector(isUserAuthSelector);
  const location = useLocation();

  if (!isUserAuth) {
    return <Navigate to="/users/sessions/login" state={{ from: location }} />;
  }

  return children;
};
