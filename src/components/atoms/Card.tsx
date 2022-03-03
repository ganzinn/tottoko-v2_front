import { ReactNode, VFC } from 'react';
import { Box, BoxProps } from '@chakra-ui/react';

type Props = {
  children: ReactNode;
} & BoxProps;

export const Card: VFC<Props> = ({ children, ...rest }) => (
  <Box bg="white" shadow="base" rounded="lg" px={2} py={2} {...rest}>
    {children}
  </Box>
);
