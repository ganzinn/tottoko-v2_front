import { VFC } from 'react';
import {
  Heading,
  Stack,
  Center,
  Text,
  Box,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';

import { Card } from 'components/atoms/Card';
import { ApiMessagesArea } from 'components/atoms/ApiMessagesArea';

type Props = {
  apiMessages?: string[];
  tokenValidMessage?: string;
  isActivated?: boolean;
};

export const Activate: VFC<Props> = ({
  apiMessages,
  tokenValidMessage,
  isActivated,
}) => (
  <Center>
    <Card width="xl">
      <Stack spacing={6}>
        <Heading as="h3" fontSize={26} textAlign="center">
          アカウント有効化
        </Heading>
        <ApiMessagesArea {...{ apiMessages }} />
        {tokenValidMessage && (
          <Alert status="error">
            <AlertIcon />
            {tokenValidMessage}
          </Alert>
        )}
        {isActivated && (
          <Text fontSize="sm">
            アカウントの有効化が完了しました。
            <br />
            <br />
            作品を投稿する際は
            <Box as="span" textDecoration="underline" fontWeight="bold">
              ［家族設定］
            </Box>
            画面より、お子さまを追加の上
            <Box as="span" textDecoration="underline" fontWeight="bold">
              ［作品投稿］
            </Box>
            画面にて作者（お子さま）を指定して下さい。
            <br />
            <br />
            <Box as="span" textDecoration="underline">
              ※作品投稿・編集できるユーザーはお子さまとの関係が「パパ・ママ・子ども自身」のみとなります。
            </Box>
          </Text>
        )}
      </Stack>
    </Card>
  </Center>
);
