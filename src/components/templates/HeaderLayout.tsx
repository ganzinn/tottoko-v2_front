import { VFC } from 'react';
import { Outlet } from 'react-router-dom';

import { EnhancedHeader } from 'containers/organisms/Header';
import { Container, VStack, Text, Spacer } from '@chakra-ui/react';

export const HeaderLayout: VFC = () => (
  <>
    <VStack minH="100vh">
      <EnhancedHeader />
      <Container>
        <Outlet />
      </Container>
      <Spacer />
      <Text fontSize="sm">
        &copy; {new Date().getFullYear()} tottoko.su-dx.com. All rights
        reserved.
      </Text>
    </VStack>
  </>
);
