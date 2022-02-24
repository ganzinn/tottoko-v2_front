import { VFC } from 'react';
import { ChakraProvider } from '@chakra-ui/react';

import { theme } from 'theme';
import { Router } from 'router/Router';

const App: VFC = () => (
  <ChakraProvider theme={theme}>
    <Router />
  </ChakraProvider>
);

export default App;
