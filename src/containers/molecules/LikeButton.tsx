import { VFC, memo, useEffect, useState } from 'react';
import { Icon, IconButton, Tooltip } from '@chakra-ui/react';
import { MdFavorite, MdFavoriteBorder } from 'react-icons/md';
import { useQuery } from 'react-query';
import { getLikeCount, RtnData } from 'feature/api/work/getLikeCount';
import { ApiError } from 'feature/api';
import { addLike } from 'feature/api/work/addLike';
import { removeLike } from 'feature/api/work/removeLike';

type Props = {
  userId?: string;
  workId?: string;
};

export const LikeButton: VFC<Props> = memo(({ userId, workId }) => {
  const [isLike, setIslike] = useState<boolean>();
  const [count, setCount] = useState<number>();

  const {
    data,
    // error,
    // isLoading,
    // isFetching,
    // refetch
  } = useQuery<RtnData, ApiError>(
    [userId, 'like/count', workId],
    () => getLikeCount({ workId }),
    { enabled: !!userId && !!workId },
  );

  useEffect(() => {
    if (data === undefined) return;
    setIslike(data.like.alreadyLike);
    setCount(data.like.count);
  }, [data]);

  const likeToggle = async () => {
    if (isLike) {
      const { success, like } = await removeLike({ workId });
      if (success) {
        setIslike(false);
        setCount(like.count);
      }
    } else {
      const { success, like } = await addLike({ workId });
      if (success) {
        setIslike(true);
        setCount(like.count);
      }
    }
  };

  if (userId === undefined) return <></>;

  return (
    <Tooltip
      label={count === undefined ? '' : `いいね: ${count}人`}
      bg="gray.100"
      color="gray.800"
      hasArrow
    >
      <IconButton
        onClick={likeToggle}
        disabled={isLike === undefined || !workId}
        aria-label="like"
        icon={
          isLike ? (
            <Icon as={MdFavorite} color="blue.400" boxSize={6} />
          ) : (
            <Icon as={MdFavoriteBorder} boxSize={6} />
          )
        }
        bgColor="white"
        size="md"
        _focus={{ boxShadow: 'inerhit' }}
        _focusVisible={{ boxShadow: 'outline' }}
        _hover={{}}
        _active={{}}
      />
    </Tooltip>
  );
});
