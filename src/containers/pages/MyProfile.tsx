import { useState, VFC } from 'react';
import { useDisclosure, useToast } from '@chakra-ui/react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';

import { useAppSelector } from 'store';
import { MyProfile } from 'components/pages/MyProfile';
import { getMyprofile, RtnData } from 'feature/api/users/getMyprofile';
import { ApiError } from 'feature/api';
import { useLogout } from 'feature/hooks/useLogout';
import { passwordResetEntry } from 'feature/api/users/passwordResetEntry';

export const EnhancedMyProfile: VFC = () => {
  const loginUser = useAppSelector((state) => state.userAuth?.loginUser);
  const { data, error, isLoading, isFetching } = useQuery<RtnData, ApiError>(
    ['users', loginUser?.id],
    getMyprofile,
    { enabled: !!loginUser?.id },
  );

  const editLinkProps = {
    as: Link,
    to: '/users/me/edit',
  };

  const mailChangeLinkProps = {
    as: Link,
    to: '/users/me/email_change_entry',
  };

  const {
    isOpen: passwordResetModalIsOpen,
    onOpen: passwordResetModalOnOpen,
    onClose: passwordResetModalOnClose,
  } = useDisclosure();
  const [passwordResetIsLoading, passwordResetSetLoading] = useState(false);
  const [passwordResetError, passwordResetSetError] = useState<ApiError | null>(
    null,
  );
  const passwordResetToast = useToast();
  const passwordResetModalProps = {
    isModalOpen: passwordResetModalIsOpen,
    onModalClose: () => {
      passwordResetModalOnClose();
      passwordResetSetError(null);
    },
    executeOnClick: async () => {
      if (!loginUser) return;
      passwordResetSetLoading(true);
      try {
        const { success } = await passwordResetEntry({
          email: loginUser.email,
        });
        if (success) {
          passwordResetToast({
            title: 'パスワードリセットの申請を受け付けました。',
            description:
              'ご登録のメールアドレスにパスワードリセット用のURLを送付しました。URLにアクセスし、手続きを進めて下さい。',
            status: 'success',
            duration: null,
            isClosable: true,
          });
          passwordResetModalOnClose();
          passwordResetSetError(null);
        }
      } catch (passwordResetApiError) {
        if (passwordResetApiError instanceof ApiError) {
          passwordResetSetError(passwordResetApiError);
        } else {
          // eslint-disable-next-line no-console
          console.error(passwordResetApiError);
        }
      } finally {
        passwordResetSetLoading(false);
      }
    },
    isLoading: passwordResetIsLoading,
    apiMessages: passwordResetError?.displayMessages,
  };

  const {
    isOpen: removeUserModalIsOpen,
    onOpen: removeUserModalOnOpen,
    onClose: removeUserModalOnClose,
  } = useDisclosure();
  const removeUserModalProps = {
    isModalOpen: removeUserModalIsOpen,
    onModalClose: () => {
      removeUserModalOnClose();
    },
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    executeOnClick: async () => {},
  };

  useLogout(error || passwordResetError);

  return (
    <MyProfile
      user={data?.user}
      editLinkProps={editLinkProps}
      mailChangeLinkProps={mailChangeLinkProps}
      passwordResetModalOnOpen={passwordResetModalOnOpen}
      passwordResetModalProps={passwordResetModalProps}
      removeUserModalOnOpen={removeUserModalOnOpen}
      removeUserModalProps={removeUserModalProps}
      isLoading={isLoading}
      isFetching={isFetching}
    />
  );
};
