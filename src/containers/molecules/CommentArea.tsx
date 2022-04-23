import { useEffect, useState, VFC } from 'react';
import { Avatar, Flex, Stack, Text } from '@chakra-ui/react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useInfiniteQuery, useQueryClient } from 'react-query';

import { CmnInput } from 'components/molecules/CmnInput';
import { BaseButton } from 'components/atoms/BaseButton';
import { ApiMessagesArea } from 'components/atoms/ApiMessagesArea';
import { ApiError } from 'feature/api';
import { create } from 'feature/api/comment/create';
import { useAppSelector } from 'store';
import { getComments, CommentsData } from 'feature/api/comment/getComments';
import { CommentCards } from 'components/molecules/CommentCards';

type Props = {
  workId?: string;
};

type SubmitData = {
  message: string;
};

export const CommentArea: VFC<Props> = ({ workId }) => {
  const path = workId ? `works/${workId}/comments` : '';
  const {
    data,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<CommentsData, ApiError>(
    [path],
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    ({ pageParam }) => getComments({ path, pageParam }),
    {
      getNextPageParam: (page) => {
        const { currentPage } = page.pagination;
        const lastPage = page.pagination.totalPages;

        return currentPage === lastPage ? undefined : currentPage + 1;
      },
      enabled: path !== '',
    },
  );

  // 再表示時最新コメント以外を取得しないための対応
  const queryClient = useQueryClient();
  useEffect(
    () => () => queryClient.removeQueries([path], { exact: true }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const loginUser = useAppSelector((state) => state.userAuth?.loginUser);
  const [apiMessages, setApiMessages] = useState<string[]>();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<SubmitData>({ mode: 'onSubmit', criteriaMode: 'all' });

  const messageProps = {
    ...register('message', {
      required: '入力されていません',
      maxLength: { value: 30, message: '30桁以内で入力してください' },
    }),
    isInvalid: !!errors?.message,
    errorTypes: errors?.message?.types,
  };

  const onSubmit: SubmitHandler<SubmitData> = async ({ message }) => {
    if (!workId) return;
    try {
      const { success } = await create({ workId, message });
      if (success) {
        setValue('message', '');
        await refetch();
      }
    } catch (submitError) {
      if (submitError instanceof ApiError) {
        setApiMessages(submitError.displayMessages);
      } else {
        // eslint-disable-next-line no-console
        console.error(submitError);
      }
    }
  };

  return (
    <Stack spacing={6}>
      <Text fontSize={20} fontWeight="bold">
        コメント{data ? `(${data?.pages[0].pagination.totalCount}件)` : ''}
      </Text>
      <ApiMessagesArea apiMessages={error?.displayMessages || apiMessages} />
      {!!loginUser && (
        <Flex gap={1}>
          <Avatar title={loginUser.name} src={loginUser.avatarUrl} size="sm" />
          <CmnInput {...messageProps} height={8} p={2} />
          <BaseButton
            isLoading={isSubmitting}
            onClick={handleSubmit(onSubmit)}
            p={2}
            h={8}
          >
            送信
          </BaseButton>
        </Flex>
      )}
      <CommentCards
        commentsDatas={data?.pages}
        refetch={refetch}
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
      />
    </Stack>
  );
};
