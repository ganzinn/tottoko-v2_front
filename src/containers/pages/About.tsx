import { VFC } from 'react';
import { useNavigate } from 'react-router-dom';

import { About } from 'components/pages/About';

export const EnhancedAbout: VFC = () => {
  const navigate = useNavigate();

  const signUpOnClick = () => navigate('/users/sign_up');
  const loginOnClick = () => navigate('/users/sessions/login');

  return <About signUpOnClick={signUpOnClick} loginOnClick={loginOnClick} />;
};
