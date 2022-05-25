import { VFC } from 'react';
import { useLocation, Navigate } from 'react-router-dom';

import { isUserAuthSelector, useAppSelector } from 'store';

export const RootRedirect: VFC = () => {
  const isUserAuth = useAppSelector(isUserAuthSelector);
  const location = useLocation();

  if (!isUserAuth) {
    return <Navigate to="/about" state={{ from: location }} replace />;
  }

  return <Navigate to="/users/me/works" replace />;
};
