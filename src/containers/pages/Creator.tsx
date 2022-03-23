import { VFC, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { useDisclosure, useToast } from '@chakra-ui/react';

import { ApiError } from 'feature/api';
import { Creator } from 'components/pages/Creator';
import { useLogout } from 'feature/hooks/useLogout';
import { getCreator, RtnData } from 'feature/api/creator/getCreator';
import { remove } from 'feature/api/creator/remove';
import { remove as removeFamily } from 'feature/api/family/remove';
import { CreatorFamily } from 'feature/models/creator';

export const EnhancedCreator: VFC = () => {
  const { id: creatorId } = useParams();
  const { data, error, isLoading, isFetching, refetch } = useQuery<
    RtnData,
    ApiError
  >(['creator', creatorId], () => getCreator({ creatorId }), {
    enabled: !!creatorId,
  });

  const navigate = useNavigate();

  const editOnClick = () => {
    if (creatorId) navigate(`/creators/${creatorId}/edit`);
  };

  const familyEntryLinkProps = {
    as: Link,
    to: creatorId && `/creators/${creatorId}/families/entry`,
  };

  // 削除モーダル ---------------------------------------------------------
  const {
    isOpen: isRemoveModalOpen,
    onOpen: removeModalOpen,
    onClose: onRemoveModalClose,
  } = useDisclosure();
  const removeToast = useToast();
  const [isRemoveLoading, setIsRemoveLoading] = useState(false);
  const [removeApiErr, setRemoveApiErr] = useState<ApiError | null>(null);
  const removeModalProps = {
    apiMessages: removeApiErr?.displayMessages,
    isLoading: isRemoveLoading,
    isModalOpen: isRemoveModalOpen,
    onModalClose: () => {
      onRemoveModalClose();
      setRemoveApiErr(null);
    },
    executeOnClick: async () => {
      if (!data) return;
      setIsRemoveLoading(() => true);
      try {
        const { isSuccess } = await remove({ creatorId: data.creator.id });
        if (isSuccess) {
          removeToast({
            title: `${data.creator.name}さんの情報を削除しました`,
            status: 'success',
            isClosable: true,
          });
          navigate('/users/me/creators');
          onRemoveModalClose();
          setRemoveApiErr(null);
        }
      } catch (removeApiError) {
        if (removeApiError instanceof ApiError) {
          setRemoveApiErr(removeApiError);
        } else {
          // eslint-disable-next-line no-console
          console.error(removeApiError);
        }
      } finally {
        setIsRemoveLoading(() => false);
      }
    },
  };

  // 家族解除モーダル -----------------------------------------------------
  const {
    isOpen: isRemoveFamilyModalOpen,
    onOpen: removeFamilyModalOpen,
    onClose: onRemoveFamilyModalClose,
  } = useDisclosure();
  const removeFamilyToast = useToast();
  const [isRemoveFamilyLoading, setIsRemoveFamilyLoading] = useState(false);
  const [removeFamilyApiErr, setRemoveFamilyApiErr] = useState<ApiError | null>(
    null,
  );
  const [selecFamily, setSelectFamily] = useState<CreatorFamily | null>(null);
  const familyRemoveOnClick = (family: CreatorFamily) => {
    setSelectFamily(family);
    removeFamilyModalOpen();
  };
  const familyRemoveModalProps = {
    title: `${
      selecFamily?.user.name ? selecFamily?.user.name : ''
    }さんの家族設定を解除してもよろしいですか？`,
    apiMessages: removeFamilyApiErr?.displayMessages,
    isLoading: isRemoveFamilyLoading,
    isModalOpen: isRemoveFamilyModalOpen,
    onModalClose: () => {
      setSelectFamily(null);
      onRemoveFamilyModalClose();
      setRemoveFamilyApiErr(null);
    },
    executeOnClick: async () => {
      if (!data || !selecFamily) return;
      setIsRemoveFamilyLoading(() => true);
      try {
        const { isSuccess } = await removeFamily({
          creatorId: data.creator.id,
          familyId: selecFamily.id,
        });
        if (isSuccess) {
          removeFamilyToast({
            title: `${selecFamily?.user.name}さんの家族設定を解除しました`,
            status: 'success',
            isClosable: true,
          });
          setSelectFamily(null);
          onRemoveFamilyModalClose();
          setRemoveFamilyApiErr(null);
          await refetch();
        }
      } catch (removeFamilyApiError) {
        if (removeFamilyApiError instanceof ApiError) {
          setRemoveFamilyApiErr(removeFamilyApiError);
        } else {
          // eslint-disable-next-line no-console
          console.error(removeFamilyApiError);
        }
      } finally {
        setIsRemoveFamilyLoading(() => false);
      }
    },
  };

  useLogout(error || removeApiErr || removeFamilyApiErr);

  return (
    <Creator
      apiMessages={error?.action === 'none' ? error.displayMessages : undefined}
      creator={data?.creator}
      creatorFamilies={data?.creatorFamilies}
      removeOnClick={removeModalOpen}
      {...{
        isLoading,
        isFetching,
        editOnClick,
        familyEntryLinkProps,
        familyRemoveOnClick,
        removeModalProps,
        familyRemoveModalProps,
      }}
    />
  );
};
