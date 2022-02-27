import { VFC } from 'react';
import { Provider } from 'react-redux';
import { ChakraProvider } from '@chakra-ui/react';

import { store } from 'store';
import { theme } from 'theme';
import { Router } from 'router/Router';

const App: VFC = () => (
  <Provider store={store}>
    <ChakraProvider theme={theme}>
      <Router />
    </ChakraProvider>
  </Provider>
);

export default App;
