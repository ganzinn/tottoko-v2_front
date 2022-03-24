import { Heading } from '@chakra-ui/react';
import { VFC } from 'react';

export const NotFound: VFC = () => (
  <Heading p={6} as="h3" fontSize={26} textAlign="center">
    ページが見つかりません
  </Heading>
);
