import { useEffect, useState, VFC } from 'react';

import { refresh } from 'feature/api/users/refresh';
import { useAppDispatch, setUserAuth } from 'store';
import { DataLoading } from 'components/atoms/DataLoading';
// import { ApiError } from 'api';

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
        // if (error instanceof ApiError) console.error(error.message);
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
