/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useMemo, useState, VFC } from 'react';
import { useQuery } from 'react-query';
import { Flex, Stack } from '@chakra-ui/react';
import { useSearchParams } from 'react-router-dom';

import { getCreators } from 'feature/api/creator/getCreators';
import { getWorks, WorksData } from 'feature/api/work/getWorks';
import { ApiError } from 'feature/api';
import { Creator } from 'feature/models/creator';
import { EnhancedCreatorSelect } from 'containers/molecules/CreatorSelect';
import { WorksList } from 'components/molecules/WorksList';
import { useLogout } from 'feature/hooks/useLogout';
import { ApiMessagesArea } from 'components/atoms/ApiMessagesArea';

export const EnhancedWorks: VFC = () => {
  const {
    data: getCreatorsData,
    error: getCreatorsError,
    isLoading: getCreatorsIsLoading,
  } = useQuery<{ creators?: Creator[] }, ApiError>(['creators'], () =>
    getCreators(),
  );

  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedIds, setSelectedIds] = useState<string[] | undefined>();

  const creatorAllIds = useMemo(
    () => getCreatorsData?.creators?.map((creator) => creator.id),
    [getCreatorsData],
  );

  const isCreatorAllSelected =
    creatorAllIds?.every((creatorId) => selectedIds?.includes(creatorId)) ??
    false;

  // ###########################################################################
  // # チェックボックスstate → url 変更
  // ###########################################################################
  useEffect(() => {
    if (selectedIds !== undefined) {
      let creatorIds = isCreatorAllSelected ? null : selectedIds;
      // チェックがない場合特別なURLを設定（空配列だとクエリーパラメーターがつかない（＝全件検索と同じになってしまう））
      if (creatorIds !== null && creatorIds.length === 0) {
        creatorIds = ['none'];
      }
      const params = new URLSearchParams();
      creatorIds?.map((creatorId) => params.append('creator_ids[]', creatorId));
      // チェックボックスの選択状態がurlと同じ場合、urlを設定しない
      // ※ urlを先に変更（ブラウザバックやペイジングなど）した場合の考慮
      if (
        JSON.stringify(params.getAll('creator_ids[]')) !==
        JSON.stringify(searchParams.getAll('creator_ids[]'))
      ) {
        setSearchParams(params);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedIds]);

  // ###########################################################################
  // # url → チェックボックスstate 変更
  // ###########################################################################
  useEffect(() => {
    if (creatorAllIds !== undefined) {
      let paramsIds = !searchParams.getAll('creator_ids[]').length
        ? creatorAllIds
        : searchParams.getAll('creator_ids[]');
      if (JSON.stringify(paramsIds) === JSON.stringify(['none'])) {
        paramsIds = [];
      }
      // チェックボックスの選択状態がurlと同じ場合、state(チェックボックス)を設定しない
      // ※ チェックボックスを先に変更した場合の考慮
      if (JSON.stringify(paramsIds) !== JSON.stringify(selectedIds)) {
        setSelectedIds(paramsIds);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, creatorAllIds]);

  const apiPath = searchParams.toString()
    ? `users/me/works?${searchParams.toString()}`
    : 'users/me/works';

  const {
    data: getWorksData,
    error: getWorksError,
    isLoading: getWorksIsLoading,
  } = useQuery<WorksData, ApiError>(
    [apiPath],
    () => getWorks({ path: apiPath }),
    {
      // チェックなしの場合API送信なし
      enabled: !(
        JSON.stringify(searchParams.getAll('creator_ids[]')) ===
        JSON.stringify(['none'])
      ),
    },
  );

  const handlePageQuery = (page: number) => {
    searchParams.set('page', page.toString());
    setSearchParams(searchParams);
  };

  useLogout(getCreatorsError || getWorksError);

  return (
    <Flex minH="calc(100vh - 133px)" justifyContent="center">
      <Stack spacing={4} w="5xl" p="2">
        <ApiMessagesArea
          apiMessages={
            getCreatorsError?.displayMessages || getWorksError?.displayMessages
          }
        />
        <EnhancedCreatorSelect
          {...{
            isLoading: getCreatorsIsLoading,
            creators: getCreatorsData?.creators,
            selectedIds,
            setSelectedIds,
            creatorAllIds,
            isCreatorAllSelected,
          }}
        />
        {getCreatorsIsLoading ||
        !getCreatorsData?.creators?.length ||
        !selectedIds?.length ? (
          <></>
        ) : (
          <WorksList
            isLoading={getWorksIsLoading}
            worksData={getWorksData}
            handlePageQuery={handlePageQuery}
          />
        )}
      </Stack>
    </Flex>
  );
};
