import { Alert, AlertIcon, Stack, Text } from '@chakra-ui/react';
import { memo, VFC } from 'react';

type Props = {
  apiMessages?: string[] | null;
};

export const ApiMessagesArea: VFC<Props> = memo(({ apiMessages }) => (
  <>
    {apiMessages && (
      <Alert status="error">
        <AlertIcon />
        <Stack>
          {apiMessages.map((apiMessage) => (
            <Text key={apiMessage}>{apiMessage}</Text>
          ))}
        </Stack>
      </Alert>
    )}
  </>
));
