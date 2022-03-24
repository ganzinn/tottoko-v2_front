import { VFC } from 'react';
import { Heading, Text, Stack, Link, Spacer, Center } from '@chakra-ui/react';

import { CmnInput, CmnInputProps } from 'components/molecules/CmnInput';
import {
  PasswordInput,
  PasswordInputProps,
} from 'components/molecules/PasswordInput';
import { BaseButton, BaseButtonProps } from 'components/atoms/BaseButton';
import { Card } from 'components/atoms/Card';
import { NavLink } from 'react-router-dom';
import { ApiMessagesArea } from 'components/atoms/ApiMessagesArea';

type Props = {
  onSubmit?: React.FormEventHandler<HTMLFormElement>;
  apiMessages?: string[];
  emailProps?: CmnInputProps;
  passwordProps?: PasswordInputProps;
  PasswordResetEntryPath?: string;
  submitBtnProps?: BaseButtonProps;
};

export const Login: VFC<Props> = ({
  onSubmit,
  apiMessages,
  emailProps = {},
  passwordProps = {},
  PasswordResetEntryPath = '',
  submitBtnProps = {},
}) => (
  <Center>
    <Card width="xl" px={10} py={8}>
      <Stack spacing={6}>
        <Heading as="h3" fontSize={26} textAlign="center">
          ログイン
        </Heading>
        <ApiMessagesArea {...{ apiMessages }} />
        <form onSubmit={onSubmit}>
          <Stack spacing={4}>
            <CmnInput {...emailProps} labelName="メールアドレス" />
            <PasswordInput {...passwordProps} />
            <Text textAlign="right" fontSize={14}>
              <Link
                as={NavLink}
                to={PasswordResetEntryPath}
                color="blue.500"
                fontWeight="semibold"
              >
                パスワードを忘れた方はこちら
              </Link>
            </Text>
          </Stack>
          <Spacer h={8} />
          <BaseButton {...submitBtnProps} type="submit" width="full">
            ログイン
          </BaseButton>
        </form>
      </Stack>
    </Card>
  </Center>
);
