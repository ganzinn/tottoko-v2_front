import { VFC } from 'react';
import {
  Flex,
  Box,
  Image,
  Stack,
  IconButton,
  Spacer,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';

import logo from 'image/logo.png';

type NavItem = {
  label: string;
  onClick: () => void;
};
type NavItems = {
  topUrl: () => void;
  navItems: NavItem[];
};

export const Header: VFC<NavItems> = ({ topUrl, navItems }) => (
  <Flex
    as="nav"
    align="center"
    justify="space-between"
    wrap="wrap"
    p={3}
    bg="white"
    shadow="sm"
    width="full"
  >
    <Box
      onClick={topUrl}
      fontSize={30}
      color="orange.500"
      letterSpacing="tighter"
      fontWeight="semibold"
      _hover={{ cursor: 'pointer' }}
    >
      <Image
        src={logo}
        display="inline"
        height="2rem"
        position="relative"
        top="1"
        mr="2px"
      />
      tottoko
    </Box>

    <Stack
      direction="row"
      display={{ base: 'none', md: 'flex' }}
      width="auto"
      alignItems="center"
      flexGrow={1}
    >
      <Spacer />
      {navItems.map(({ label, onClick }) => (
        <Button
          key={label}
          onClick={onClick}
          fontWeight="semibold"
          bgColor="white"
        >
          {label}
        </Button>
      ))}
    </Stack>

    <Menu>
      <MenuButton
        as={IconButton}
        icon={<HamburgerIcon boxSize={6} />}
        display={{ base: 'block', md: 'none' }}
        bgColor="white"
      />
      <MenuList display={{ base: 'block', md: 'none' }}>
        {navItems.map(({ label, onClick }) => (
          <MenuItem key={label} onClick={onClick} bgColor="white" mt={0}>
            {label}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  </Flex>
);

export default Header;
