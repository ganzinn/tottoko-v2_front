import { VFC } from 'react';
import { Heading, Stack, Spacer, Center, Box } from '@chakra-ui/react';

import { Card } from 'components/atoms/Card';
import { ApiMessagesArea } from 'components/atoms/ApiMessagesArea';
import { CmnInput, CmnInputProps } from 'components/molecules/CmnInput';
import { CmnSelect, CmnSelectProps } from 'components/molecules/CmnSelect';
import {
  AvatarUpload,
  AvatarUploadProps,
} from 'components/molecules/AvatarUpload';
import { BaseButton, BaseButtonProps } from 'components/atoms/BaseButton';
import { CreatorDetail } from 'feature/models/creator';
import { DataLoading } from 'components/atoms/DataLoading';

type Props = {
  onSubmit?: React.FormEventHandler<HTMLFormElement>;
  creator?: CreatorDetail;
  getCreatorIsLoading?: boolean;
  apiMessages?: string[];
  nameProps?: CmnInputProps;
  dateOfBirthProps?: CmnInputProps;
  genderProps?: CmnSelectProps;
  avatarProps?: AvatarUploadProps;
  cancelBtnProps?: BaseButtonProps;
  submitBtnProps?: BaseButtonProps;
};

export const CreatorEdit: VFC<Props> = ({
  onSubmit,
  creator,
  getCreatorIsLoading,
  apiMessages,
  nameProps = {},
  dateOfBirthProps = {},
  genderProps = {},
  avatarProps = {},
  cancelBtnProps,
  submitBtnProps = {},
}) => (
  <Center>
    <Card width="xl" px={10} py={8}>
      <Stack spacing={6}>
        <Heading as="h3" fontSize={26} textAlign="center">
          {creator
            ? `お子さま情報(${creator.name}さん)の編集`
            : 'お子さま情報の編集'}
        </Heading>
        <ApiMessagesArea {...{ apiMessages }} />
        <form onSubmit={onSubmit}>
          <Stack spacing={4}>
            <CmnInput {...nameProps} labelName="おなまえ" />
            <CmnInput
              {...dateOfBirthProps}
              type="date"
              labelName="生年月日"
              pattern="\d{4}-\d{2}-\d{2}"
            />
            <CmnSelect {...genderProps} labelName="性別" optionalLabel />
            <AvatarUpload {...avatarProps} optionalLabel />
          </Stack>
          <Spacer h={8} />
          <Box display="flex" justifyContent="space-between" gap={2}>
            <BaseButton {...cancelBtnProps} width="full" variant="ghost">
              キャンセル
            </BaseButton>
            <BaseButton {...submitBtnProps} width="full" type="submit">
              {getCreatorIsLoading ? <DataLoading /> : '更新する'}
            </BaseButton>
          </Box>
        </form>
      </Stack>
    </Card>
  </Center>
);
