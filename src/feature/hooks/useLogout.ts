import { useEffect } from 'react';
import { useQueryClient } from 'react-query';
import { useLocation, useNavigate } from 'react-router-dom';
import { useToast } from '@chakra-ui/react';

import { ApiError } from 'feature/api';
import { setUserAuth, useAppDispatch } from 'store';

export const useLogout = (error: ApiError | null) => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const toast = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    if (error?.action === 'logout') {
      dispatch(setUserAuth(null));
      queryClient.clear();
      toast({
        title: error.displayMessages,
        status: 'error',
        isClosable: true,
      });
      navigate('/users/sessions/login', { state: { from: location } });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);
};
