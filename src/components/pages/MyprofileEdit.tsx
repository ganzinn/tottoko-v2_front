import { VFC } from 'react';
import { Heading, Stack, Spacer, Center, Box } from '@chakra-ui/react';

import { Card } from 'components/atoms/Card';
import { ApiMessagesArea } from 'components/atoms/ApiMessagesArea';
import { CmnInput, CmnInputProps } from 'components/molecules/CmnInput';
import {
  AvatarUpload,
  AvatarUploadProps,
} from 'components/molecules/AvatarUpload';
import { BaseButton, BaseButtonProps } from 'components/atoms/BaseButton';
import { User } from 'feature/models/user';

type Props = {
  onSubmit?: React.FormEventHandler<HTMLFormElement>;
  user?: User;
  getMyprofileIsLoading?: boolean;
  apiMessages?: string[];
  nameProps?: CmnInputProps;
  avatarProps?: AvatarUploadProps;
  cancelBtnProps?: BaseButtonProps;
  submitBtnProps?: BaseButtonProps;
};

export const MyprofileEdit: VFC<Props> = ({
  onSubmit,
  apiMessages,
  nameProps = {},
  avatarProps = {},
  cancelBtnProps,
  submitBtnProps = {},
}) => (
  <Center>
    <Card width="xl" px={10} py={8}>
      <Stack spacing={6}>
        <Heading as="h3" fontSize={26} textAlign="center">
          おなまえ／画像の変更
        </Heading>
        <ApiMessagesArea {...{ apiMessages }} />
        <form onSubmit={onSubmit}>
          <Stack spacing={4}>
            <CmnInput {...nameProps} labelName="おなまえ" />
            <AvatarUpload {...avatarProps} optionalLabel />
          </Stack>
          <Spacer h={8} />
          <Box display="flex" justifyContent="space-between" gap={2}>
            <BaseButton {...cancelBtnProps} width="full" variant="ghost">
              キャンセル
            </BaseButton>
            <BaseButton {...submitBtnProps} type="submit" width="full">
              更新する
            </BaseButton>
          </Box>
        </form>
      </Stack>
    </Card>
  </Center>
);
