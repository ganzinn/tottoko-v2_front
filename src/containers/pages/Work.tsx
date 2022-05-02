import { useMemo, VFC } from 'react';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import { Center, Divider, Flex, Spacer, Stack, Text } from '@chakra-ui/react';
import { LockIcon, UnlockIcon } from '@chakra-ui/icons';

import { Card } from 'components/atoms/Card';
import { getWork, RtnData } from 'feature/api/work/getWork';
import { ApiError } from 'feature/api';
import { ImageGallery } from 'containers/molecules/ImageGallery';
import { ImagesDownload } from 'containers/molecules/ImagesDownload';
import { useAppSelector } from 'store';
import { LikeButton } from 'containers/molecules/LikeButton';
import { useLogout } from 'feature/hooks/useLogout';
import { WorkMenu } from 'containers/molecules/WorkMenu';
import { ApiMessagesArea } from 'components/atoms/ApiMessagesArea';
import { CommentArea } from 'containers/molecules/CommentArea';

export const EnhancedWork: VFC = () => {
  const { id: workId } = useParams();
  const userId = useAppSelector((state) => state.userAuth?.loginUser.id);
  const {
    data,
    error,
    // isLoading,
    // isFetching,
    // refetch
  } = useQuery<RtnData, ApiError>(
    ['works', workId],
    () => getWork({ workId }),
    { enabled: !!workId },
  );

  const apiMessages =
    error?.action === 'none' ? error.displayMessages : undefined;

  const createdDate = useMemo(() => {
    if (data === undefined) return '';
    const dateArry = data.work.date.split('-');

    return `${Number(dateArry[0])}年${Number(dateArry[1])}月${Number(
      dateArry[2],
    )}日`;
  }, [data]);

  const ageAtThatTime = useMemo(() => {
    if (data === undefined) return '';
    const baseDateAry = data.work.date.split('-');
    const dobAry = data.work.creator.dateOfBirth.split('-');
    const years = Math.floor(
      (Number(baseDateAry.join('')) - Number(dobAry.join(''))) / 10000,
    );
    let months = Math.floor(
      (Number(baseDateAry[1] + baseDateAry[2]) -
        Number(dobAry[1] + dobAry[2])) /
        100,
    );
    months = Math.sign(months) === -1 ? 12 + months : months;

    return `${years}歳${Number(months)}ヶ月`;
  }, [data]);

  useLogout(error);

  return (
    <Center>
      <Card w="3xl" maxW="100vw" px={2} py={2}>
        <Stack spacing={2}>
          <ApiMessagesArea apiMessages={apiMessages} />
          <ImageGallery imageUrls={data?.work.detailImageUrls} />
          <Flex gap={2} justifyContent="space-between">
            {data ? (
              <Flex alignItems="center" gap="1" ml={2}>
                {data.work.scope.id === '4' ? <UnlockIcon /> : <LockIcon />}
                <Text fontWeight="bold" fontSize={14}>
                  {data.work.scope.value}
                </Text>
              </Flex>
            ) : (
              <Spacer />
            )}
            <Flex gap={2}>
              {!!data && <LikeButton userId={userId} workId={workId} />}
              <ImagesDownload imageUrls={data?.work.detailImageUrls} />
              <WorkMenu
                workId={workId}
                permission={data?.work.editPermission}
              />
            </Flex>
          </Flex>
          {!!data && (
            <Stack spacing={2} px={{ base: 2, md: 8 }}>
              <Stack spacing={1}>
                <Text fontSize={20} fontWeight="bold">
                  {data.work.creator.name}
                </Text>
                <Text fontWeight="bold">{`${createdDate} / ${ageAtThatTime}`}</Text>
              </Stack>
              <Text
                textAlign="center"
                fontWeight="bold"
                fontSize={{ base: 24, md: 30 }}
              >
                {data.work.title}
              </Text>
              <Text color="gray.600" whiteSpace="pre-wrap">
                {data.work.description}
              </Text>
            </Stack>
          )}
        </Stack>
        <Divider my={6} />
        {!!data && (
          <Stack spacing={2} px={{ base: 2, md: 8 }} paddingBottom={12}>
            <CommentArea workId={workId} />
          </Stack>
        )}
      </Card>
    </Center>
  );
};
