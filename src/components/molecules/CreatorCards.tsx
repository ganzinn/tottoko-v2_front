import { VFC } from 'react';
import { Box, CircularProgress, Stack, Text } from '@chakra-ui/react';

import { EnhancedCreatorCard } from 'containers/atoms/CreatorCard';
import { Creator } from 'feature/models/creator';

const DataProgress: VFC<{ text?: string }> = ({ text = 'データ更新中...' }) => (
  <Box display="flex" justifyContent="center" gap={1}>
    <Text>{text}</Text>
    <CircularProgress isIndeterminate size={6} />
  </Box>
);

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
  if (isLoading) return <DataProgress text="データ取得中..." />;

  return (
    <>
      {creators &&
        (creators.length ? (
          <Stack spacing={1}>
            {creators.map((creator) => (
              <EnhancedCreatorCard key={creator.id} creator={creator} />
            ))}
            {isFetching && <DataProgress />}
          </Stack>
        ) : (
          <>
            <Text fontWeight="bold">登録されていません</Text>
            {isFetching && <DataProgress />}
          </>
        ))}
    </>
  );
};
