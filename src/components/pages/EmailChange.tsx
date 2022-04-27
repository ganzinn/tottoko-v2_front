import { VFC } from 'react';
import {
  Heading,
  Stack,
  Spacer,
  Center,
  Box,
  Text,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';

import {
  PasswordInput,
  PasswordInputProps,
} from 'components/molecules/PasswordInput';
import { BaseButton, BaseButtonProps } from 'components/atoms/BaseButton';
import { Card } from 'components/atoms/Card';
import { ApiMessagesArea } from 'components/atoms/ApiMessagesArea';

type Props = {
  onSubmit?: React.FormEventHandler<HTMLFormElement>;
  apiMessages?: string[];
  checkError?: string;
  passwordProps?: PasswordInputProps;
  jwtEmail?: string;
  passwordConfirmationProps?: PasswordInputProps;
  submitBtnProps?: BaseButtonProps;
};

export const EmailChange: VFC<Props> = ({
  onSubmit,
  apiMessages,
  checkError,
  jwtEmail,
  passwordProps,
  submitBtnProps,
}) => (
  <Center>
    <Card width="xl" px={10} py={8}>
      <Stack spacing={6}>
        <Heading as="h3" fontSize={26} textAlign="center">
          メールアドレス変更
        </Heading>
        <ApiMessagesArea {...{ apiMessages }} />
        {checkError && (
          <Alert status="error">
            <AlertIcon />
            {checkError}
          </Alert>
        )}
        <form onSubmit={onSubmit}>
          <Stack spacing={4}>
            <Box>
              <Text fontSize="xs" color="gray.500">
                新しいメールアドレス
              </Text>
              <Text fontSize="lg" color="gray.800">
                {jwtEmail}
              </Text>
            </Box>
            <PasswordInput {...passwordProps} labelName="登録済みパスワード" />
          </Stack>
          <Spacer h={8} />
          <BaseButton {...submitBtnProps} type="submit" width="full">
            変更する
          </BaseButton>
        </form>
      </Stack>
    </Card>
  </Center>
);
