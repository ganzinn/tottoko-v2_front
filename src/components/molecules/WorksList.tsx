import { memo, ReactNode, VFC } from 'react';
import { Flex, Text } from '@chakra-ui/react';

import { DataLoading } from 'components/atoms/DataLoading';
import { WorksData } from 'feature/api/work/getWorks';
import { WorkGrid } from 'containers/molecules/WorkGrid';
import { WorkCard } from 'containers/molecules/WorkCard';
import { EnhancedPagination } from 'containers/molecules/Pagination';

const PaginationWrapper: VFC<{ children: ReactNode }> = ({ children }) => (
  <Flex
    h="full"
    direction="column"
    alignItems="center"
    justifyContent="space-between"
    gap={12}
  >
    {children}
  </Flex>
);

type Props = {
  isLoading?: boolean;
  worksData?: WorksData;
  handlePageQuery?: (page: number) => void;
};

export const WorksList: VFC<Props> = memo(
  ({ isLoading = false, worksData, handlePageQuery }) => {
    if (isLoading) {
      return (
        <PaginationWrapper>
          <DataLoading />
          <EnhancedPagination
            totalPages={worksData?.pagination.totalPages}
            currentPage={worksData?.pagination.currentPage}
            handlePageQuery={handlePageQuery}
          />
        </PaginationWrapper>
      );
    }

    if (worksData === undefined) {
      return <></>;
    }

    if (!worksData.works.length) {
      return <Text fontWeight="bold">作品がありません</Text>;
    }

    return (
      <PaginationWrapper>
        <WorkGrid alignItems="flex-start">
          {worksData.works.map((work) => (
            <WorkCard key={work.id} work={work} />
          ))}
        </WorkGrid>
        <EnhancedPagination
          totalPages={worksData.pagination.totalPages}
          currentPage={worksData.pagination.currentPage}
          handlePageQuery={handlePageQuery}
        />
      </PaginationWrapper>
    );
  },
);
