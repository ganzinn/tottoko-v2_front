import { VFC } from 'react';
import {
  Heading,
  Stack,
  Spacer,
  Center,
  Text,
  Box,
  Avatar,
  Table,
  TableCaption,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
} from '@chakra-ui/react';

import { Card } from 'components/atoms/Card';
import { ApiMessagesArea } from 'components/atoms/ApiMessagesArea';
import { BaseButton } from 'components/atoms/BaseButton';
import { CreatorDetail, CreatorFamily } from 'feature/models/creator';
import { DataLoading } from 'components/atoms/DataLoading';
import { BaseLink, BaseLinkProps } from 'components/atoms/BaseLink';
import { CmnModal, CmnModalProps } from 'components/molecules/CmnModal';

type Props = {
  apiMessages?: string[];
  isLoading?: boolean;
  isFetching?: boolean;
  creator?: CreatorDetail;
  creatorFamilies?: CreatorFamily[];
  editOnClick?: () => void;
  removeOnClick?: () => void;
  familyRemoveOnClick?: (family: CreatorFamily) => void;
  familyEntryLinkProps?: BaseLinkProps;
  removeModalProps?: CmnModalProps;
  familyRemoveModalProps?: CmnModalProps;
};

const ItemDisplay: VFC<{ label: string; item?: string | null }> = ({
  label,
  item,
}) => (
  <Box>
    <Text fontSize="xs" color="gray.500">
      {label}
    </Text>
    <Text fontSize="lg" color="gray.800">
      {item || '-'}
    </Text>
  </Box>
);

export const Creator: VFC<Props> = ({
  apiMessages,
  isLoading,
  isFetching,
  creator,
  creatorFamilies,
  editOnClick,
  removeOnClick,
  familyEntryLinkProps,
  familyRemoveOnClick = () => undefined,
  removeModalProps = {
    onModalClose: () => undefined,
  },
  familyRemoveModalProps = {
    onModalClose: () => undefined,
  },
}) => {
  const formatedDob = (arg: string | undefined) => {
    if (!arg) return undefined;
    const arry = arg.split('-');

    return `${Number(arry[0])}年${Number(arry[1])}月${Number(arry[2])}日`;
  };

  return (
    <Center>
      <Card width="xl" px={6} py={8}>
        <Stack spacing={6}>
          <Heading as="h3" fontSize={26} textAlign="center">
            お子さま情報
          </Heading>
          <ApiMessagesArea {...{ apiMessages }} />
          <Stack spacing={4}>
            {creator?.editPermission && (
              <Box display="flex" justifyContent="right" gap={4}>
                <BaseButton h={10} variant="outline" onClick={removeOnClick}>
                  削除
                </BaseButton>
                <BaseButton h={10} variant="outline" onClick={editOnClick}>
                  編集
                </BaseButton>
              </Box>
            )}
            <Box display="flex" alignItems="center">
              <Avatar size="2xl" src={creator?.originalAvatarUrl} />
              <Stack spacing={2} ml={6}>
                <ItemDisplay label="おなまえ" item={creator?.name} />
                <ItemDisplay
                  label="生年月日"
                  item={formatedDob(creator?.dateOfBirth)}
                />
                <ItemDisplay label="性別" item={creator?.gender?.value} />
              </Stack>
            </Box>
          </Stack>
          {creator?.editPermission && (
            <Box textAlign="right">
              <BaseLink {...familyEntryLinkProps}>
                ＋作品を閲覧できる家族の追加
              </BaseLink>
            </Box>
          )}
          <Table variant="simple">
            <TableCaption fontSize="xm" fontWeight="bold" placement="top">
              作品を閲覧できる家族
            </TableCaption>
            <Thead>
              <Tr>
                <Th color="gray.500">ユーザー名</Th>
                <Th color="gray.500">お子さまとの関係</Th>
                <Th color="gray.500">家族設定解除</Th>
              </Tr>
            </Thead>
            <Tbody>
              {creatorFamilies &&
                creatorFamilies.map((family) => (
                  <Tr key={family.id}>
                    <Td h="4.6rem" fontSize="md" color="gray.800">
                      {family.user.name}
                    </Td>
                    <Td h="4.6rem" fontSize="md" color="gray.800">
                      {family.relation.value}
                    </Td>
                    <Td>
                      {family.familyRemovePermission && (
                        <BaseButton
                          h={10}
                          variant="outline"
                          onClick={() => familyRemoveOnClick(family)}
                        >
                          解除
                        </BaseButton>
                      )}
                    </Td>
                  </Tr>
                ))}
            </Tbody>
          </Table>
          {isLoading ? (
            <DataLoading />
          ) : (
            isFetching && <DataLoading text="データ更新確認中..." />
          )}
        </Stack>
        <Spacer h={8} />
      </Card>
      <CmnModal
        {...removeModalProps}
        title="お子さま情報を削除してもよろしいですか？※作品も全て削除されます"
        executeBtnLabel="お子さま情報の削除"
      />
      <CmnModal {...familyRemoveModalProps} executeBtnLabel="家族設定の解除" />
    </Center>
  );
};
