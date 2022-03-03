import { VFC } from 'react';
import { Outlet } from 'react-router-dom';

import { EnhancedHeader } from 'containers/organisms/Header';
import { Box, VStack, Text, Spacer } from '@chakra-ui/react';

export const Layout: VFC = () => (
  <VStack minH="100vh">
    <EnhancedHeader />
    <Box width="full">
      <Outlet />
    </Box>
    <Spacer />
    <Text fontSize="sm" p={4}>
      &copy; {new Date().getFullYear()} tottoko.su-dx.com. All rights reserved.
    </Text>
  </VStack>
);
