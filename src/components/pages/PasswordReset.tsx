import { VFC } from 'react';
import { Heading, Stack, Spacer, Center } from '@chakra-ui/react';

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
  passwordProps?: PasswordInputProps;
  passwordConfirmationProps?: PasswordInputProps;
  submitBtnProps?: BaseButtonProps;
};

export const PasswordReset: VFC<Props> = ({
  onSubmit,
  apiMessages,
  passwordProps,
  passwordConfirmationProps,
  submitBtnProps,
}) => (
  <Center>
    <Card width="xl" px={10} py={8}>
      <Stack spacing={6}>
        <Heading as="h3" fontSize={26} textAlign="center">
          パスワード再設定
        </Heading>
        <ApiMessagesArea {...{ apiMessages }} />
        <form onSubmit={onSubmit}>
          <Stack spacing={4}>
            <PasswordInput {...passwordProps} labelName="新しいパスワード" />
            <PasswordInput
              {...passwordConfirmationProps}
              labelName="新しいパスワード（確認用）"
            />
          </Stack>
          <Spacer h={8} />
          <BaseButton {...submitBtnProps} type="submit" width="full">
            パスワード再設定
          </BaseButton>
        </form>
      </Stack>
    </Card>
  </Center>
);
