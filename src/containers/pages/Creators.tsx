import { useEffect, VFC } from 'react';
import { useQuery } from 'react-query';
import { Link, useNavigate } from 'react-router-dom';

import { Creators } from 'components/pages/Creators';
import { useAppSelector } from 'store';
import { getCreators } from 'feature/api/creator/getCreators';
import { Creator } from 'feature/models/creator';

export const EnhancedCreators: VFC = () => {
  const userAuth = useAppSelector((state) => state.userAuth);
  const accessToken = userAuth?.accessToken;
  const email = userAuth?.loginUser?.email;

  const navigate = useNavigate();

  useEffect(() => {
    if (!accessToken) navigate('/users/sessions/login');
  }, [accessToken, navigate]);

  const { data, error, isLoading, isFetching } = useQuery<
    { creators?: Creator[] },
    string[]
  >([email, 'creators'], () => getCreators({ accessToken }), {
    enabled: !!accessToken,
  });

  const creatorEntryLinkProps = {
    as: Link,
    to: '/users/me/creators/entry',
  };

  return (
    <Creators
      apiMessages={error}
      isLoading={isLoading}
      isFetching={isFetching}
      creators={data?.creators}
      {...{ creatorEntryLinkProps }}
    />
  );
};
