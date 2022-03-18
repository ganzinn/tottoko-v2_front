import { VFC } from 'react';
import { Provider } from 'react-redux';
import { QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { ChakraProvider } from '@chakra-ui/react';

import { store } from 'store';
import { queryClient } from 'queryClient';
import { theme } from 'theme';
import { UserAuthProvider } from 'provider/UserAuthProvider';
import { Router } from 'router/Router';
import { injectStore } from 'feature/api';

const App: VFC = () => {
  injectStore(store);

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ChakraProvider theme={theme}>
          <UserAuthProvider>
            <Router />
          </UserAuthProvider>
        </ChakraProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </Provider>
  );
};

export default App;
