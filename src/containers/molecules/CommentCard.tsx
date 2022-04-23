import { useState, VFC } from 'react';

import { Comment } from 'feature/models/comment';
import { Avatar, Flex, Spinner, Text, useToast } from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';
import { ApiError } from 'feature/api';
import { remove } from 'feature/api/comment/remove';

type Props = {
  comment: Comment;
  refetch?: () => void;
};

export const CommentCard: VFC<Props> = ({
  comment: {
    id,
    message,
    user: {
      // id: userId,
      name: userName,
      avatarUrl,
    },
    editPermission,
    createdAt,
  },
  refetch = () => undefined,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const deleteToast = useToast();

  const fromNow = (base: Date) => {
    const diff = new Date().getTime() - base.getTime();
    // 調整値１秒追加
    const d = new Date(diff + 1000);
    if (d.getUTCFullYear() - 1970 >= 1)
      return `${d.getUTCFullYear() - 1970}年前`;
    if (d.getUTCMonth()) return `${d.getUTCMonth()}ヶ月`;
    if (d.getUTCDate() - 1) return `${d.getUTCDate() - 1}日前`;
    if (d.getUTCHours()) return `${d.getUTCHours()}時間前`;
    if (d.getUTCMinutes()) return `${d.getUTCMinutes()}分前`;
    if (d.getUTCSeconds()) return `${d.getUTCSeconds()}秒前`;

    return '今';
  };

  const handleDelete = async (commentId: string) => {
    setIsLoading(true);
    try {
      const { success } = await remove({ commentId });
      if (success) {
        deleteToast({
          title: 'コメントを削除しました',
          status: 'success',
          isClosable: true,
        });
        refetch();
      }
    } catch (error) {
      if (error instanceof ApiError) {
        deleteToast({
          title: error.displayMessages[0],
          status: 'error',
          isClosable: true,
        });
      } else {
        // eslint-disable-next-line no-console
        console.error(error);
      }
      setIsLoading(false);
    }
  };

  return (
    <Flex gap={1}>
      <Avatar title={userName} src={avatarUrl} />
      <Flex flexDirection="column" w="full">
        <Text fontWeight="bold" fontSize={14}>
          {userName}
        </Text>
        <Flex
          flexDirection="column"
          rounded="md"
          bgColor="gray.100"
          gap={1}
          p={2}
        >
          <Text fontSize={16} color="gray.800" whiteSpace="pre-wrap">
            {message}
          </Text>
          <Flex justifyContent="space-between">
            <Text color="gray.500" fontSize={12}>
              {fromNow(createdAt)}
            </Text>
            {editPermission &&
              (isLoading ? (
                <Spinner size="sm" />
              ) : (
                <DeleteIcon
                  onClick={() => {
                    void handleDelete(id);
                  }}
                  _hover={{ cursor: 'pointer' }}
                  color="gray.500"
                  boxSize="14px"
                />
              ))}
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};
