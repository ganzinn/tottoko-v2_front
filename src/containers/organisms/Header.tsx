import { useState, VFC } from 'react';
import { useDisclosure } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

import { Header } from 'components/organisms/Header';
import { useAppSelector, useAppDispatch, setUserAuth } from 'store';
import { logout } from 'feature/api/users/logout';
import { ApiError } from 'feature/api';
import { useQueryClient } from 'react-query';

export const EnhancedHeader: VFC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [apiMessages, setApiMessages] = useState(null as string[] | null);
  const userAuth = useAppSelector((state) => state.userAuth);
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const {
    isOpen: isModalOpen,
    onOpen: onModalOpen,
    onClose: onModalClose,
  } = useDisclosure();

  const logoutOnClick = async () => {
    setIsLoading(() => true);
    try {
      await logout();
      navigate('/');
      dispatch(setUserAuth(null));
      queryClient.clear();
      onModalClose();
    } catch (error) {
      // 401以外のエラーはrefreshTokenが削除せないため、メッセージ表示
      if (error instanceof ApiError) {
        setApiMessages(error.displayMessages);
      } else {
        // eslint-disable-next-line no-console
        console.error(error);
      }
    } finally {
      setIsLoading(() => false);
    }
  };

  const headerProps = {
    loginUser: userAuth?.loginUser,
    logoOnClick: () => navigate('/'),
    signUpOnClick: () => navigate('/users/sign_up'),
    loginOnClick: () => navigate('/users/sessions/login'),
    workEntryOnClick: () => navigate('/users/me/works/entry'),
    familySettingOnClick: () => navigate('/users/me/creators'),
    profileOnClick: () => navigate('/users/me'),
    apiMessages,
    isModalOpen,
    onModalOpen,
    onModalClose,
    logoutOnClick,
    isLoading,
  };

  return <Header {...headerProps} />;
};
