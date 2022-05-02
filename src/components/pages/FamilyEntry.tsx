import { memo, VFC } from 'react';
import { Heading, Stack, Spacer, Center } from '@chakra-ui/react';

import { Card } from 'components/atoms/Card';
import { ApiMessagesArea } from 'components/atoms/ApiMessagesArea';
import { CmnInput, CmnInputProps } from 'components/molecules/CmnInput';
import { CmnSelect, CmnSelectProps } from 'components/molecules/CmnSelect';
import { BaseButton, BaseButtonProps } from 'components/atoms/BaseButton';
import { DataLoading } from 'components/atoms/DataLoading';

type Props = {
  getCreatorIsLoading?: boolean;
  onSubmit?: React.FormEventHandler<HTMLFormElement>;
  apiMessages?: string[];
  emailProps?: CmnInputProps;
  relationProps?: CmnSelectProps;
  submitBtnProps?: BaseButtonProps;
};

export const FamilyEntry: VFC<Props> = memo(
  ({
    getCreatorIsLoading,
    onSubmit,
    apiMessages,
    emailProps,
    relationProps,
    submitBtnProps,
  }) => (
    <Center>
      <Card width="xl">
        <Stack spacing={6}>
          <Heading as="h3" fontSize={26} textAlign="center">
            家族の追加
          </Heading>
          <ApiMessagesArea apiMessages={apiMessages} />
          <form onSubmit={onSubmit}>
            <Stack spacing={4}>
              <CmnInput
                {...emailProps}
                labelName="追加する家族（登録ユーザー）のメールアドレス"
              />
              <CmnSelect {...relationProps} />
            </Stack>
            <Spacer h={8} />
            <BaseButton {...submitBtnProps} type="submit" width="full">
              {getCreatorIsLoading ? <DataLoading /> : '家族の追加'}
            </BaseButton>
          </form>
        </Stack>
      </Card>
    </Center>
  ),
);
