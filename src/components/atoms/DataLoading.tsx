import { VFC } from 'react';
import { Box, BoxProps, CircularProgress, Text } from '@chakra-ui/react';

export const DataLoading: VFC<{ text?: string } & BoxProps> = ({
  text = 'データ取得中...',
  ...rest
}) => (
  <Box display="flex" justifyContent="center" gap={1} {...rest}>
    <Text>{text}</Text>
    <CircularProgress isIndeterminate size={6} />
  </Box>
);
