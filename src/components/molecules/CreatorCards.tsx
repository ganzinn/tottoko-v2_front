import { VFC } from 'react';
import { Stack, Text } from '@chakra-ui/react';

import { EnhancedCreatorCard } from 'containers/atoms/CreatorCard';
import { Creator } from 'feature/models/creator';
import { DataLoading } from 'components/atoms/DataLoading';

type Props = {
  isLoading?: boolean;
  isFetching?: boolean;
  creators?: Creator[];
};

export const CreatorCards: VFC<Props> = ({
  isLoading = false,
  isFetching = false,
  creators,
}) => {
  if (isLoading) return <DataLoading />;

  return (
    <>
      {creators &&
        (creators.length ? (
          <Stack spacing={1}>
            {creators.map((creator) => (
              <EnhancedCreatorCard key={creator.id} creator={creator} />
            ))}
            {isFetching && <DataLoading text="データ更新確認中..." />}
          </Stack>
        ) : (
          <>
            <Text fontWeight="bold">登録されていません</Text>
            {isFetching && <DataLoading text="データ更新確認中..." />}
          </>
        ))}
    </>
  );
};
