import { VFC } from 'react';
import { useNavigate } from 'react-router-dom';

import { Header } from 'components/organisms/Header';
import { useAppSelector } from 'store';

export const EnhancedHeader: VFC = () => {
  const userAuth = useAppSelector((state) => state.userAuth);
  const navigate = useNavigate();

  const headerProps = {
    loginUser: userAuth?.loginUser,
    logoOnClick: () => navigate('/'),
    signUpOnClick: () => navigate('/users/sign_up'),
    loginOnClick: () => navigate('/users/sessions/login'),
    workEntryOnClick: () => navigate('/users/me/works/entry'),
    familySettingOnClick: () => navigate('/users/me/creators'),
    profileOnClick: () => navigate('/users/me'),
    logoutOnClick: () => navigate('/users/sessions/logout'),
  };

  return <Header {...headerProps} />;
};
