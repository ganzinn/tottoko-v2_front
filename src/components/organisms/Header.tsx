/* eslint-disable no-template-curly-in-string */
import { VFC } from 'react';
import { MdLogout } from 'react-icons/md';
import { ImProfile } from 'react-icons/im';
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
  Avatar,
  MenuGroup,
  MenuDivider,
  // Modal,
  // ModalOverlay,
  // ModalContent,
  // ModalHeader,
  // ModalFooter,
} from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';

import logo from 'image/logo.png';
import { LoginUser } from 'feature/models/user';
// import { BaseButton } from 'components/atoms/BaseButton';
// import { ApiMessagesArea } from 'components/atoms/ApiMessagesArea';
import { CmnModal } from 'components/molecules/CmnModal';

type Props = {
  loginUser?: LoginUser;
  logoOnClick?: () => void;
  signUpOnClick?: () => void;
  loginOnClick?: () => void;
  workEntryOnClick?: () => void;
  familySettingOnClick?: () => void;
  profileOnClick?: () => void;
  apiMessages?: string[] | null;
  isModalOpen?: boolean;
  onModalOpen?: () => void;
  onModalClose?: () => void;
  logoutOnClick?: () => void;
  isLoading?: boolean;
};

export const Header: VFC<Props> = ({
  loginUser,
  logoOnClick,
  signUpOnClick,
  loginOnClick,
  workEntryOnClick,
  familySettingOnClick,
  profileOnClick,
  apiMessages,
  isModalOpen = false,
  onModalOpen,
  onModalClose = () => undefined,
  logoutOnClick,
  isLoading = false,
}) => (
  <>
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
        onClick={logoOnClick}
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
        {loginUser ? (
          <>
            <Button
              onClick={workEntryOnClick}
              fontWeight="semibold"
              bgColor="white"
            >
              作品投稿
            </Button>
            <Button
              onClick={familySettingOnClick}
              fontWeight="semibold"
              bgColor="white"
            >
              家族設定
            </Button>
          </>
        ) : (
          <>
            <Button
              onClick={signUpOnClick}
              fontWeight="semibold"
              bgColor="white"
            >
              新規登録
            </Button>
            <Button
              onClick={loginOnClick}
              fontWeight="semibold"
              bgColor="white"
            >
              ログイン
            </Button>
          </>
        )}
      </Stack>
      {loginUser && (
        <Menu>
          <MenuButton
            as={IconButton}
            icon={
              <Avatar
                title={loginUser.name}
                size="sm"
                src={loginUser.avatarUrl ? loginUser.avatarUrl : undefined}
              />
            }
            display={{ base: 'none', md: 'block' }}
            size="sm"
            rounded="full"
            ml={2}
          />
          <MenuList>
            <MenuGroup title={loginUser.name}>
              <MenuItem
                onClick={profileOnClick}
                bgColor="white"
                fontWeight="bold"
                icon={<ImProfile />}
              >
                プロフィール
              </MenuItem>
              <MenuItem
                onClick={onModalOpen}
                bgColor="white"
                fontWeight="bold"
                icon={<MdLogout />}
              >
                ログアウト
              </MenuItem>
            </MenuGroup>
          </MenuList>
        </Menu>
      )}

      <Menu>
        <MenuButton
          as={IconButton}
          icon={<HamburgerIcon boxSize={6} />}
          display={{ base: 'block', md: 'none' }}
          bgColor="white"
          size="lg"
        />
        <MenuList display={{ base: 'block', md: 'none' }}>
          {loginUser ? (
            <>
              <MenuItem
                onClick={workEntryOnClick}
                bgColor="white"
                fontWeight="bold"
              >
                作品投稿
              </MenuItem>
              <MenuItem
                onClick={familySettingOnClick}
                bgColor="white"
                fontWeight="bold"
              >
                家族設定
              </MenuItem>
              <MenuDivider />
              <MenuGroup title={loginUser.name}>
                <MenuItem
                  onClick={profileOnClick}
                  bgColor="white"
                  fontWeight="bold"
                  icon={<ImProfile />}
                >
                  プロフィール
                </MenuItem>
                <MenuItem
                  onClick={onModalOpen}
                  bgColor="white"
                  fontWeight="bold"
                  icon={<MdLogout />}
                >
                  ログアウト
                </MenuItem>
              </MenuGroup>
            </>
          ) : (
            <>
              <MenuItem onClick={signUpOnClick} bgColor="white">
                新規登録
              </MenuItem>
              <MenuItem onClick={loginOnClick} bgColor="white">
                ログイン
              </MenuItem>
            </>
          )}
        </MenuList>
      </Menu>
    </Flex>
    <CmnModal
      {...{ apiMessages, isLoading, isModalOpen, onModalClose }}
      title="ログアウトしますか？"
      executeBtnLabel="ログアウトする"
      executeOnClick={logoutOnClick}
    />
  </>
);

export default Header;
