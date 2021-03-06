import { VFC } from 'react';
import { Heading, Stack, Spacer, Center } from '@chakra-ui/react';

import { Card } from 'components/atoms/Card';
import { ApiMessagesArea } from 'components/atoms/ApiMessagesArea';
import { CmnInput, CmnInputProps } from 'components/molecules/CmnInput';
import { CmnSelect, CmnSelectProps } from 'components/molecules/CmnSelect';
import {
  AvatarUpload,
  AvatarUploadProps,
} from 'components/molecules/AvatarUpload';
import { BaseButton, BaseButtonProps } from 'components/atoms/BaseButton';

type Props = {
  onSubmit?: React.FormEventHandler<HTMLFormElement>;
  apiMessages?: string[];
  nameProps?: CmnInputProps;
  dateOfBirthProps?: CmnInputProps;
  relationProps?: CmnSelectProps;
  genderProps?: CmnSelectProps;
  avatarProps?: AvatarUploadProps;
  submitBtnProps?: BaseButtonProps;
};

export const CreatorEntry: VFC<Props> = ({
  onSubmit,
  apiMessages,
  nameProps = {},
  dateOfBirthProps = {},
  relationProps = {},
  genderProps = {},
  avatarProps = {},
  submitBtnProps = {},
}) => (
  <Center>
    <Card width="xl">
      <Stack spacing={6}>
        <Heading as="h3" fontSize={26} textAlign="center">
          お子さまの追加
        </Heading>
        <ApiMessagesArea {...{ apiMessages }} />
        <form onSubmit={onSubmit}>
          <Stack spacing={4}>
            <CmnInput {...nameProps} labelName="おなまえ" />
            <CmnInput
              {...dateOfBirthProps}
              type="date"
              labelName="生年月日"
              placeholder="yyyy-mm-dd"
              pattern="\d{4}-\d{2}-\d{2}"
            />
            <CmnSelect {...relationProps} labelName="お子さまとの関係" />
            <CmnSelect {...genderProps} labelName="性別" optionalLabel />
            <AvatarUpload {...avatarProps} optionalLabel />
          </Stack>
          <Spacer h={8} />
          <BaseButton {...submitBtnProps} type="submit" width="full">
            登録する
          </BaseButton>
        </form>
      </Stack>
    </Card>
  </Center>
);
