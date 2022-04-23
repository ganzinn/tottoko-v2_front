import { memo, VFC } from 'react';

// import { Comment } from 'feature/models/comment';
import { Flex, Spinner, Stack, Text } from '@chakra-ui/react';
import { CommentCard } from 'containers/molecules/CommentCard';
import { BaseButton } from 'components/atoms/BaseButton';
import { CommentsData } from 'feature/api/comment/getComments';

type Props = {
  commentsDatas?: CommentsData[];
  refetch?: () => void;
  fetchNextPage?: () => void;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
};

export const CommentCards: VFC<Props> = memo(
  ({
    commentsDatas,
    refetch = () => undefined,
    fetchNextPage = () => undefined,
    hasNextPage = true,
    isFetchingNextPage = false,
  }) => {
    if (commentsDatas === undefined) {
      return <Spinner />;
    }

    if (commentsDatas[0].comments.length === 0) {
      return <Text>コメントはありません</Text>;
    }

    return (
      <Stack spacing={4}>
        <Flex flexDirection="column" gap={2}>
          {commentsDatas.map((commentsData) =>
            commentsData.comments.map((comment) => (
              <CommentCard
                key={comment.id}
                comment={comment}
                refetch={refetch}
              />
            )),
          )}
        </Flex>
        {hasNextPage && (
          <BaseButton
            bg="white"
            color="blue.500"
            _hover={{ bg: 'blue.50' }}
            _active={{ bg: 'blue.100' }}
            _focus={{ boxShadow: 'inerhit' }}
            _focusVisible={{ boxShadow: 'outline' }}
            onClick={() => fetchNextPage()}
            isLoading={isFetchingNextPage}
          >
            コメントをもっと見る
          </BaseButton>
        )}
      </Stack>
    );
  },
);
