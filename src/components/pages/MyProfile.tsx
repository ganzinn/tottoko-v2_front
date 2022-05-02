import { VFC } from 'react';
import {
  Heading,
  Stack,
  Spacer,
  Center,
  Text,
  Box,
  Avatar,
  Flex,
} from '@chakra-ui/react';

import { Card } from 'components/atoms/Card';
import { ApiMessagesArea } from 'components/atoms/ApiMessagesArea';
import { BaseButton } from 'components/atoms/BaseButton';
import { User } from 'feature/models/user';
import { DataLoading } from 'components/atoms/DataLoading';

import { CmnModal, CmnModalProps } from 'components/molecules/CmnModal';
import { BaseLink, BaseLinkProps } from 'components/atoms/BaseLink';

type Props = {
  apiMessages?: string[];
  isLoading?: boolean;
  isFetching?: boolean;
  user?: User;
  editLinkProps?: BaseLinkProps;
  mailChangeLinkProps?: BaseLinkProps;
  passwordResetModalOnOpen?: () => void;
  passwordResetModalProps?: CmnModalProps;
  removeUserModalOnOpen?: () => void;
  removeUserModalProps?: CmnModalProps;
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

export const MyProfile: VFC<Props> = ({
  apiMessages,
  isLoading,
  isFetching,
  user,
  editLinkProps,
  mailChangeLinkProps,
  passwordResetModalOnOpen,
  passwordResetModalProps = {
    onModalClose: () => undefined,
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  removeUserModalOnOpen,
  removeUserModalProps = {
    onModalClose: () => undefined,
  },
}) => (
  <Center>
    <Card width="xl">
      <Stack spacing={6}>
        <Heading as="h3" fontSize={26} textAlign="center">
          ユーザー情報
        </Heading>
        <ApiMessagesArea {...{ apiMessages }} />
        <Stack spacing={4}>
          <Flex alignItems="center">
            <Avatar size="2xl" src={user?.originalAvatarUrl} />
            <Stack spacing={2} ml={6}>
              <ItemDisplay label="おなまえ" item={user?.name} />
              <ItemDisplay label="メールアドレス" item={user?.email} />
            </Stack>
          </Flex>
          <Flex gap={4} flexFlow="column" alignItems="flex-end">
            <BaseLink {...editLinkProps}>おなまえ／画像の変更</BaseLink>
            <BaseLink {...mailChangeLinkProps}>メールアドレスの変更</BaseLink>
            <BaseButton
              h={10}
              variant="outline"
              onClick={passwordResetModalOnOpen}
            >
              パスワードリセット
            </BaseButton>
            {/* <Box paddingTop={6}>
              <BaseButton
                h={10}
                variant="outline"
                onClick={removeUserModalOnOpen}
              >
                サービス退会
              </BaseButton>
            </Box> */}
          </Flex>
        </Stack>
        {isLoading ? (
          <DataLoading />
        ) : (
          isFetching && <DataLoading text="データ更新確認中..." />
        )}
      </Stack>
      <Spacer h={8} />
    </Card>
    <CmnModal
      {...passwordResetModalProps}
      title="パスワードリセット用URLが登録済みメールアドレスに送られます。送付されたURLからパスワードリセットの手続きをお願いします。"
      executeBtnLabel="パスワードリセット用URL発行"
    />
    <CmnModal
      {...removeUserModalProps}
      title="サービスを退会するとユーザー情報が削除されます。よろしいですか？"
      executeBtnLabel="サービス退会"
    />
  </Center>
);
