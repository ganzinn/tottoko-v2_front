import { VFC } from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';

import { Creators } from 'components/pages/Creators';
import { getCreators } from 'feature/api/creator/getCreators';
import { Creator } from 'feature/models/creator';
import { ApiError } from 'feature/api';
import { useLogout } from 'feature/hooks/useLogout';

export const EnhancedCreators: VFC = () => {
  const { data, error, isLoading, isFetching } = useQuery<
    { creators?: Creator[] },
    ApiError
  >(['creators'], getCreators);

  useLogout(error);

  const creatorEntryLinkProps = {
    as: Link,
    to: '/users/me/creators/entry',
  };

  return (
    <Creators
      apiMessages={error?.action === 'none' ? error.displayMessages : undefined}
      isLoading={isLoading}
      isFetching={isFetching}
      creators={data?.creators}
      {...{ creatorEntryLinkProps }}
    />
  );
};
