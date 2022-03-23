import { VFC } from 'react';
import {
  Modal,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';

import { ApiMessagesArea } from 'components/atoms/ApiMessagesArea';
import { BaseButton } from 'components/atoms/BaseButton';

export type CmnModalProps = {
  apiMessages?: string[] | null;
  isLoading?: boolean;
  isModalOpen?: boolean;
  onModalClose: () => void;
  executeOnClick?: () => void;
  title?: string;
  executeBtnLabel?: string;
  cancelBtnLabel?: string;
};

export const CmnModal: VFC<CmnModalProps> = ({
  apiMessages,
  isLoading = false,
  isModalOpen = false,
  onModalClose,
  executeOnClick,
  title,
  executeBtnLabel,
  cancelBtnLabel = 'キャンセル',
}) => (
  <Modal isOpen={isModalOpen} onClose={onModalClose} isCentered>
    <ModalOverlay />
    <ModalContent p={4}>
      <ModalHeader textAlign="center">{title}</ModalHeader>
      <ApiMessagesArea {...{ apiMessages }} />
      <ModalFooter justifyContent="space-around">
        <BaseButton variant="ghost" onClick={onModalClose} {...{ isLoading }}>
          {cancelBtnLabel}
        </BaseButton>
        <BaseButton onClick={executeOnClick} {...{ isLoading }}>
          {executeBtnLabel}
        </BaseButton>
      </ModalFooter>
    </ModalContent>
  </Modal>
);
