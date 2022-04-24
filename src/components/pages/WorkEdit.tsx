import { VFC } from 'react';
import { Heading, Stack, Spacer, Center, Flex } from '@chakra-ui/react';

import { Card } from 'components/atoms/Card';
import { ApiMessagesArea } from 'components/atoms/ApiMessagesArea';
import { CmnInput, CmnInputProps } from 'components/molecules/CmnInput';
import { CmnSelect, CmnSelectProps } from 'components/molecules/CmnSelect';
import { BaseButton, BaseButtonProps } from 'components/atoms/BaseButton';
import {
  CmnTextarea,
  CmnTextareaProps,
} from 'components/molecules/CmnTextarea';
import {
  ImagesUpload,
  ImagesUploadProps,
} from 'components/molecules/ImagesUpload';

type Props = {
  onSubmit?: React.FormEventHandler<HTMLFormElement>;
  apiMessages?: string[];
  imagesUploadProps?: ImagesUploadProps;
  creatorProps?: CmnSelectProps;
  createdDateProps?: CmnInputProps;
  scopeProps?: CmnSelectProps;
  titleProps?: CmnInputProps;
  descriptionProps?: CmnTextareaProps;
  cancelBtnProps?: BaseButtonProps;
  submitBtnProps?: BaseButtonProps;
};

export const WorkEdit: VFC<Props> = ({
  onSubmit,
  apiMessages,
  imagesUploadProps,
  creatorProps,
  createdDateProps,
  scopeProps,
  titleProps,
  descriptionProps,
  cancelBtnProps,
  submitBtnProps,
}) => (
  <Center>
    <Card width="xl" px={10} py={8}>
      <Stack spacing={6}>
        <Heading as="h3" fontSize={26} textAlign="center">
          作品編集
        </Heading>
        <ApiMessagesArea {...{ apiMessages }} />
        <form onSubmit={onSubmit}>
          <Stack spacing={4}>
            <ImagesUpload {...imagesUploadProps} />
            <CmnSelect {...creatorProps} labelName="作成者" />
            <CmnInput
              {...createdDateProps}
              type="date"
              labelName="作成日"
              placeholder="yyyy-mm-dd"
              pattern="\d{4}-\d{2}-\d{2}"
            />
            <CmnSelect {...scopeProps} labelName="公開範囲" />
            <CmnInput {...titleProps} labelName="タイトル" optionalLabel />
            <CmnTextarea
              {...descriptionProps}
              labelName="作品説明"
              optionalLabel
            />
          </Stack>
          <Spacer h={8} />
          <Flex justifyContent="space-between" gap={2}>
            <BaseButton {...cancelBtnProps} width="full" variant="ghost">
              キャンセル
            </BaseButton>
            <BaseButton {...submitBtnProps} type="submit" width="full">
              更新する
            </BaseButton>
          </Flex>
        </form>
      </Stack>
    </Card>
  </Center>
);
