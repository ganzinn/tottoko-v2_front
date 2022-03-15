import { useEffect, useState, VFC } from 'react';

import { refresh } from 'feature/api/users/refresh';
import { useAppDispatch, setUserAuth } from 'store';
import { isErrMessages } from 'feature/api';
import { DataLoading } from 'components/atoms/DataLoading';

type Type = {
  children: JSX.Element;
};

export const UserAuthProvider: VFC<Type> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const load = async () => {
      try {
        const { userAuth } = await refresh();
        if (userAuth) {
          dispatch(setUserAuth(userAuth));
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        if (isErrMessages(error)) console.error(error[0]);
      } finally {
        setIsLoading(() => false);
      }
    };
    void load();
  }, [dispatch]);

  return (
    <>
      {isLoading ? (
        <DataLoading text="ログイン情報確認中..." py={8} />
      ) : (
        children
      )}
    </>
  );
};
