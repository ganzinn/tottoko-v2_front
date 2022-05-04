import { useEffect, VFC } from 'react';
import { useNavigate } from 'react-router-dom';

import { About } from 'components/pages/About';
import { useAppSelector } from 'store';

export const EnhancedAbout: VFC = () => {
  const userAuth = useAppSelector((state) => state.userAuth);
  const navigate = useNavigate();

  useEffect(() => {
    if (userAuth) {
      navigate('/', { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userAuth]);

  const signUpOnClick = () => navigate('/users/sign_up');
  const loginOnClick = () => navigate('/users/sessions/login');

  return <About signUpOnClick={signUpOnClick} loginOnClick={loginOnClick} />;
};
