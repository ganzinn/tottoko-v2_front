import { Flex, Avatar, Text } from '@chakra-ui/react';
import { CheckboxCard } from 'components/atoms/CheckboxCard';
import { DataLoading } from 'components/atoms/DataLoading';
import { Creator } from 'feature/models/creator';
import { memo, VFC } from 'react';

type Props = {
  isLoading?: boolean;
  creators?: Creator[];
  isCreatorAllSelected?: boolean;
  isIndeterminate?: boolean;
  toggleCreatorAllSelect?: () => void;
  isCreatorSelected?: (id: string) => boolean;
  toggleCreatorSelect?: (id: string) => void;
};

export const CreatorSelect: VFC<Props> = memo(
  ({
    isLoading = false,
    creators,
    isCreatorAllSelected = false,
    isIndeterminate = false,
    toggleCreatorAllSelect = () => undefined,
    isCreatorSelected = () => false,
    toggleCreatorSelect = () => undefined,
  }) => {
    if (isLoading) {
      return <DataLoading />;
    }

    // 初期表示エラー時対応
    if (creators === undefined) {
      return <></>;
    }

    if (!creators.length) {
      return <Text fontWeight="bold">お子さまが登録されていません</Text>;
    }

    if (creators.length === 1) {
      return <></>;
    }

    return (
      <>
        <Flex gap={4}>
          <CheckboxCard
            h="100%"
            checkboxProps={{
              isChecked: isCreatorAllSelected,
              isIndeterminate,
              onChange: toggleCreatorAllSelect,
            }}
          >
            <Flex
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
              w={12}
              h="100%"
            >
              <Text fontWeight="bold">みんな</Text>
            </Flex>
          </CheckboxCard>
          <Flex gap={1} flexWrap="wrap">
            {creators.map((creator) => (
              <CheckboxCard
                key={creator.id}
                checkboxProps={{
                  isChecked: isCreatorSelected(creator.id),
                  onChange: () => toggleCreatorSelect(creator.id),
                }}
              >
                <Flex
                  flexDirection="column"
                  justifyContent="center"
                  alignItems="center"
                >
                  <Avatar size="sm" src={creator.avatarUrl} />
                  <Text fontWeight="bold" fontSize="sm">
                    {creator.name}
                  </Text>
                </Flex>
              </CheckboxCard>
            ))}
          </Flex>
        </Flex>
      </>
    );
  },
);
