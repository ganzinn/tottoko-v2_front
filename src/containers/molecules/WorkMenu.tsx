import { useState, VFC } from 'react';
import {
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { DeleteIcon, EditIcon, HamburgerIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';

import { CmnModal } from 'components/molecules/CmnModal';
import { ApiError } from 'feature/api';
import { remove } from 'feature/api/work/remove';

type Props = {
  workId?: string;
  permission?: boolean;
};

export const WorkMenu: VFC<Props> = ({ workId, permission }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const removeToast = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<ApiError | null>(null);

  const editOnClick = () => {
    if (workId) navigate(`/works/${workId}/edit`);
  };

  const onModalClose = () => {
    onClose();
    setApiError(null);
  };

  const executeOnClick = async () => {
    if (!workId) return;
    setIsLoading(true);
    try {
      const { success } = await remove({ workId });
      if (success) {
        removeToast({
          title: '作品を削除しました',
          status: 'success',
          isClosable: true,
        });
        navigate(`/users/me/works`);
      }
    } catch (error) {
      if (error instanceof ApiError) {
        setApiError(error);
      } else {
        // eslint-disable-next-line no-console
        console.error(error);
      }
      setIsLoading(false);
    }
  };

  if (!permission || workId === undefined) {
    return <></>;
  }

  return (
    <>
      <Menu>
        <MenuButton
          as={IconButton}
          icon={<HamburgerIcon boxSize={6} />}
          bgColor="white"
          size="md"
        />
        <MenuList>
          <MenuItem
            onClick={editOnClick}
            bgColor="white"
            fontWeight="bold"
            icon={<EditIcon />}
          >
            編集
          </MenuItem>
          <MenuItem
            onClick={onOpen}
            bgColor="white"
            fontWeight="bold"
            icon={<DeleteIcon />}
          >
            削除
          </MenuItem>
        </MenuList>
      </Menu>
      <CmnModal
        title="作品を削除してもよろしいですか？"
        executeBtnLabel="作品の削除"
        isModalOpen={isOpen}
        onModalClose={onModalClose}
        executeOnClick={executeOnClick}
        isLoading={isLoading}
        apiMessages={apiError?.displayMessages}
      />
    </>
  );
};
