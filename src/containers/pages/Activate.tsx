import { useEffect, useState, VFC } from 'react';
import { useSearchParams } from 'react-router-dom';

import { Activate } from 'components/pages/Activate';
import { ApiError } from 'feature/api';
import { setUserAuth, useAppDispatch } from 'store';
import { activate } from 'feature/api/users/activate';

export const EnhancedActivate: VFC = () => {
  const [isActivated, setIsActivated] = useState(false);
  const [apiMessages, setApiMessages] = useState<string[]>();
  const [tokenValidMessage, setTokenValidMessage] = useState<string>();
  const dispatch = useAppDispatch();

  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token || token.split('.').length !== 3) {
      setTokenValidMessage('不正なURLです');

      return;
    }
    const load = async () => {
      try {
        const { success, userAuth } = await activate({ token });
        if (success) {
          dispatch(setUserAuth(userAuth));
          setIsActivated(true);
        }
      } catch (error) {
        if (error instanceof ApiError) {
          setApiMessages(error.displayMessages);
        } else {
          // eslint-disable-next-line no-console
          console.error(error);
        }
      }
    };
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <Activate
      apiMessages={apiMessages}
      tokenValidMessage={tokenValidMessage}
      isActivated={isActivated}
    />
  );
};
