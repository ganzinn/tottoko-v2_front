import { VFC } from 'react';
import { Heading, Spacer, Center, Box } from '@chakra-ui/react';

import { Card } from 'components/atoms/Card';
import { Creator } from 'feature/models/creator';
import { BaseLink, BaseLinkProps } from 'components/atoms/BaseLink';
import { ApiMessagesArea } from 'components/atoms/ApiMessagesArea';
import { CreatorCards } from 'components/molecules/CreatorCards';

type Props = {
  apiMessages?: string[] | null;
  isLoading?: boolean;
  isFetching?: boolean;
  creators?: Creator[];
  creatorEntryLinkProps?: BaseLinkProps;
};

export const Creators: VFC<Props> = ({
  apiMessages,
  isFetching,
  isLoading,
  creators,
  creatorEntryLinkProps = {},
}) => (
  <Center>
    <Card width="xl" px={8} py={8}>
      <Heading as="h3" fontSize={26} textAlign="center">
        お子さま一覧
      </Heading>
      <Spacer h={6} />
      {apiMessages && (
        <>
          <ApiMessagesArea {...{ apiMessages }} />
          <Spacer h={4} />
        </>
      )}
      <CreatorCards
        isLoading={isLoading}
        isFetching={isFetching}
        creators={creators}
      />
      <Spacer h={8} />
      <Box textAlign="right">
        <BaseLink {...creatorEntryLinkProps}>＋お子さまを追加する</BaseLink>
      </Box>
    </Card>
  </Center>
);
