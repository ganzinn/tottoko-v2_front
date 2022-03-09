import { VFC } from 'react';
import { Heading, Stack, Spacer, Center } from '@chakra-ui/react';

import { CmnInput, CmnInputProps } from 'components/molecules/CmnInput';
import { CmnSelect, CmnSelectProps } from 'components/molecules/CmnSelect';
import { BaseButton, BaseButtonProps } from 'components/atoms/BaseButton';
import { Card } from 'components/atoms/Card';
import { ApiMessagesArea } from 'components/atoms/ApiMessagesArea';

type Props = {
  onSubmit?: React.FormEventHandler<HTMLFormElement>;
  apiMessages?: string[];
  nameProps?: CmnInputProps;
  dateOfBirthProps?: CmnInputProps;
  genderProps?: CmnSelectProps;
  relationProps?: CmnSelectProps;
  submitBtnProps?: BaseButtonProps;
};

export const CreatorEntry: VFC<Props> = ({
  onSubmit,
  apiMessages,
  nameProps = {},
  dateOfBirthProps = {},
  genderProps = {},
  relationProps = {},
  submitBtnProps = {},
}) => (
  <Center>
    <Card width="xl" px={10} py={8}>
      <Heading as="h3" fontSize={26} textAlign="center">
        お子さまの追加
      </Heading>
      <Spacer h={6} />
      <form onSubmit={onSubmit}>
        <Stack spacing={4}>
          <ApiMessagesArea {...{ apiMessages }} />
          <CmnInput {...nameProps} labelName="おなまえ" />
          <CmnInput
            {...dateOfBirthProps}
            type="date"
            labelName="生年月日"
            placeholder="yyyy-mm-dd"
            pattern="\d{4}-\d{2}-\d{2}"
          />
          <CmnSelect {...genderProps} labelName="性別" optionalLabel />
          <CmnSelect {...relationProps} labelName="お子さまとの関係" />
        </Stack>
        <Spacer h={8} />
        <BaseButton {...submitBtnProps} type="submit" width="full">
          登録する
        </BaseButton>
      </form>
    </Card>
  </Center>
);
