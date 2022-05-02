import { VFC } from 'react';
import { Heading, Stack, Spacer, Center, Text, Box } from '@chakra-ui/react';

import { CmnInput, CmnInputProps } from 'components/molecules/CmnInput';
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
  emailProps?: CmnInputProps;
  passwordProps?: PasswordInputProps;
  passwordConfirmationProps?: PasswordInputProps;
  nameProps?: CmnInputProps;
  submitBtnProps?: BaseButtonProps;
  isRegistered?: boolean;
};

export const SignUp: VFC<Props> = ({
  onSubmit,
  apiMessages,
  emailProps,
  passwordProps,
  passwordConfirmationProps,
  nameProps,
  submitBtnProps,
  isRegistered,
}) => (
  <Center>
    <Card width="xl">
      {!isRegistered ? (
        <Stack spacing={6}>
          <Heading as="h3" fontSize={26} textAlign="center">
            会員登録
          </Heading>
          <ApiMessagesArea {...{ apiMessages }} />
          <form onSubmit={onSubmit}>
            <Stack spacing={4}>
              <CmnInput
                {...emailProps}
                labelName="メールアドレス"
                placeholder="例)tarou.yamada@example.com"
              />
              <PasswordInput {...passwordProps} />
              <PasswordInput
                {...passwordConfirmationProps}
                labelName="パスワード（確認用）"
              />
              <CmnInput
                {...nameProps}
                labelName="おなまえ"
                placeholder="tottoko内での表示名"
              />
            </Stack>
            <Spacer h={8} />
            <BaseButton {...submitBtnProps} type="submit" width="full">
              登録する
            </BaseButton>
          </form>
        </Stack>
      ) : (
        <Stack spacing={6}>
          <Heading as="h3" fontSize={26} textAlign="center">
            会員仮登録完了
          </Heading>
          <Text fontSize="sm">
            ご登録されたメールアドレスに
            <Box as="span" fontWeight="bold" textDecoration="underline">
              アカウント有効化のためのURL
            </Box>
            を送付しました。
            <br />
            指定のURLからアクセスの上、手続きを完了させて下さい。
            <br />
            （有効化されていないアカウントはログインできません。）
            <br />
            <br />
            <Box as="span" textDecoration="underline">
              ※URLの有効期限は30分となります。
            </Box>
          </Text>
        </Stack>
      )}
    </Card>
  </Center>
);
