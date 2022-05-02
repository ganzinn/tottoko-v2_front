import { VFC } from 'react';
import {
  Heading,
  Stack,
  Spacer,
  Center,
  Alert,
  AlertDescription,
} from '@chakra-ui/react';

import { CmnInput, CmnInputProps } from 'components/molecules/CmnInput';
import { BaseButton, BaseButtonProps } from 'components/atoms/BaseButton';
import { Card } from 'components/atoms/Card';
import { ApiMessagesArea } from 'components/atoms/ApiMessagesArea';

type Props = {
  onSubmit?: React.FormEventHandler<HTMLFormElement>;
  apiMessages?: string[];
  emailProps?: CmnInputProps;
  submitBtnProps?: BaseButtonProps;
};

export const PasswordResetEntry: VFC<Props> = ({
  onSubmit,
  apiMessages,
  emailProps,
  submitBtnProps,
}) => (
  <Center>
    <Card width="xl">
      <Stack spacing={6}>
        <Heading as="h3" fontSize={26} textAlign="center">
          パスワードリセット申請
        </Heading>
        <ApiMessagesArea {...{ apiMessages }} />
        <form onSubmit={onSubmit}>
          <Stack spacing={4}>
            <CmnInput {...emailProps} labelName="登録済みメールアドレス" />
            <Alert variant="left-accent" colorScheme="orange">
              <AlertDescription color="gray.800" fontSize="sm">
                申請を行うと登録済みメールアドレスにパスワードリセット用のURLが送付されます。
                送付されたURLにアクセスし、手続きを進めて下さい。
              </AlertDescription>
            </Alert>
          </Stack>
          <Spacer h={8} />
          <BaseButton {...submitBtnProps} type="submit" width="full">
            申請する
          </BaseButton>
        </form>
      </Stack>
    </Card>
  </Center>
);
