import { extendTheme } from '@chakra-ui/react';

export const theme = extendTheme({
  styles: {
    global: {
      body: {
        backgroundColor: 'gray.50',
        color: 'gray.600',
      },
    },
  },
  components: {
    CheckCard: {
      baseStyle: {
        borderWidth: '1px',
        borderRadius: 'lg',
        p: '2',
        bg: 'white',
        transitionProperty: 'common',
        transitionDuration: 'normal',
        _hover: { borderColor: 'gray.300' },
        _checked: {
          borderColor: 'blue.500',
          // blue.500の透明度1.0をrgbaに変換
          boxShadow: '0px 0px 0px 1px rgba(49, 130, 206, 1.0)',
        },
      },
    },
  },
});
