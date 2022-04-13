import { Flex, Text } from '@chakra-ui/react';
import { BaseButton } from 'components/atoms/BaseButton';
import { memo, VFC } from 'react';

type Props = {
  totalPages?: number;
  currentPage?: number;
  handlePageQuery?: (page: number) => void;
};

export const EnhancedPagination: VFC<Props> = memo(
  ({ totalPages = 1, currentPage = 1, handlePageQuery = () => undefined }) => {
    const pageView = `${currentPage} / ${totalPages}`;
    const handleBack = () => {
      if (currentPage <= 1) return;
      handlePageQuery(currentPage - 1);
    };
    const handleForward = () => {
      if (currentPage >= totalPages) return;
      handlePageQuery(currentPage + 1);
    };

    return (
      <Flex alignItems="center" gap={2}>
        <BaseButton
          variant="outline"
          onClick={handleBack}
          disabled={currentPage <= 1}
        >
          前ページ
        </BaseButton>
        <Text fontWeight="bold">{pageView}</Text>
        <BaseButton
          variant="outline"
          onClick={handleForward}
          disabled={currentPage >= totalPages}
        >
          次ページ
        </BaseButton>
      </Flex>
    );
  },
);
