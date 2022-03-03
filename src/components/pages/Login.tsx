import { VFC } from 'react';
import {
  Heading,
  Text,
  Stack,
  Alert,
  AlertIcon,
  Link,
  Spacer,
  Center,
} from '@chakra-ui/react';

import { CmnInput, CmnInputProps } from 'components/molecules/CmnInput';
import {
  PasswordInput,
  PasswordInputProps,
} from 'components/molecules/PasswordInput';
import { BaseButton, BaseButtonProps } from 'components/atoms/BaseButton';
import { Card } from 'components/atoms/Card';
import { NavLink } from 'react-router-dom';

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
    <Card width="md" px={10} py={6}>
      <Heading as="h1" size="lg" textAlign="center">
        ログイン
      </Heading>
      <Spacer h={4} />
      <form onSubmit={onSubmit}>
        <Stack spacing={4}>
          {apiMessages && (
            <Alert status="error">
              <AlertIcon />
              {apiMessages.map((apiMessage) => (
                <Text key={apiMessage}>{apiMessage}</Text>
              ))}
            </Alert>
          )}
          <CmnInput {...emailProps} labelName="メールアドレス" />
          <PasswordInput {...passwordProps} />
          <Text textAlign="right" fontSize={14}>
            パスワードを忘れた方は
            <Link
              as={NavLink}
              to={PasswordResetEntryPath}
              color="blue.500"
              fontWeight="semibold"
            >
              こちら
            </Link>
          </Text>
          <BaseButton {...submitBtnProps} type="submit">
            ログイン
          </BaseButton>
        </Stack>
      </form>
    </Card>
  </Center>
);
