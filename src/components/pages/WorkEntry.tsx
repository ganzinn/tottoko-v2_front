import { VFC } from 'react';
import { Heading, Stack, Spacer, Center } from '@chakra-ui/react';

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
  submitBtnProps?: BaseButtonProps;
};

export const WorkEntry: VFC<Props> = ({
  onSubmit,
  apiMessages,
  imagesUploadProps,
  creatorProps,
  createdDateProps,
  scopeProps,
  titleProps,
  descriptionProps,
  submitBtnProps,
}) => (
  <Center>
    <Card width="xl" px={10} py={8}>
      <Stack spacing={6}>
        <Heading as="h3" fontSize={26} textAlign="center">
          作品投稿
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
          <BaseButton {...submitBtnProps} type="submit" width="full">
            登録する
          </BaseButton>
        </form>
      </Stack>
    </Card>
  </Center>
);
