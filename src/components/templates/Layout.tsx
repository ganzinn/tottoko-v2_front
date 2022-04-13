import { VFC } from 'react';
import { Outlet } from 'react-router-dom';

import { EnhancedHeader } from 'containers/organisms/Header';
import { Box, Text, Flex } from '@chakra-ui/react';

export const Layout: VFC = () => (
  <Flex minH="100vh" flexDirection="column">
    <EnhancedHeader />
    <Box w="full" flex="1" paddingTop={2}>
      <Outlet />
    </Box>
    <Text textAlign="center" fontSize="sm" p={4}>
      &copy; {new Date().getFullYear()} tottoko.su-dx.com. All rights reserved.
    </Text>
  </Flex>
);
