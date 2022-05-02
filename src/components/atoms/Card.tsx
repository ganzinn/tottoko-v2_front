import { ReactNode, VFC } from 'react';
import { Box, BoxProps } from '@chakra-ui/react';

type Props = {
  children: ReactNode;
} & BoxProps;

export const Card: VFC<Props> = ({ children, ...rest }) => (
  <Box
    bg="white"
    shadow="base"
    rounded="lg"
    px={{ base: 4, md: 10 }}
    py={8}
    {...rest}
  >
    {children}
  </Box>
);
