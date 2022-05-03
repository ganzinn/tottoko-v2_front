import { VFC } from 'react';
import { Box, Button, Heading, Image, Stack, Text } from '@chakra-ui/react';

import topImage from 'image/topImage.png';

type Props = {
  signUpOnClick?: () => void;
  loginOnClick?: () => void;
};

export const About: VFC<Props> = ({ signUpOnClick, loginOnClick }) => (
  <Box
    as="section"
    bg="gray.50"
    pb="24"
    pos="relative"
    px={{ base: '6', lg: '12' }}
  >
    <Box maxW="7xl" mx="auto">
      <Box
        maxW={{ lg: 'md', xl: 'xl' }}
        pt={{ base: '20', lg: '40' }}
        pb={{ base: '16', lg: '24' }}
      >
        <Heading
          as="h1"
          size="3xl"
          lineHeight="1"
          fontWeight="extrabold"
          letterSpacing="tight"
        >
          ようこそ、{' '}
          <Box as="mark" color="orange.500" bg="transparent">
            tottoko
          </Box>
          へ！
        </Heading>
        <Text mt={4} fontSize="xl" fontWeight="medium" color="gray.600">
          子供の作品をいつでも、どこでも、どこまでも
        </Text>
        <Stack direction={{ base: 'column', sm: 'row' }} spacing="4" mt="8">
          <Button
            size="lg"
            colorScheme="blue"
            height="14"
            px="8"
            fontSize="md"
            onClick={signUpOnClick}
          >
            会員登録はこちら
          </Button>
          <Button
            size="lg"
            bg="white"
            color="gray.800"
            _hover={{ bg: 'gray.50' }}
            height="14"
            px="8"
            shadow="base"
            fontSize="md"
            onClick={loginOnClick}
          >
            登録済みの方はこちら(ログイン)
          </Button>
        </Stack>
      </Box>
    </Box>
    <Box
      pos={{ lg: 'absolute' }}
      insetY={{ lg: '0' }}
      insetEnd={{ lg: '0' }}
      bg="gray.50"
      w={{ base: 'full', lg: '50%' }}
      height={{ base: '96', lg: 'full' }}
      sx={{
        clipPath: { lg: 'polygon(8% 0%, 100% 0%, 100% 100%, 0% 100%)' },
      }}
    >
      <Image
        height="100%"
        width="100%"
        objectFit="cover"
        src={topImage}
        alt="Lady working"
      />
    </Box>
  </Box>
);
