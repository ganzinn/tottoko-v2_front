import { VFC, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useQuery } from 'react-query';
import { useToast } from '@chakra-ui/react';

import { FamilyEntry } from 'components/pages/FamilyEntry';
import { create as createFamily } from 'feature/api/family/create';
import { selectOptions, SeletcOptions } from 'feature/api/select';
import { ApiError } from 'feature/api';
import { useLogout } from 'feature/hooks/useLogout';
import { getCreator, RtnData } from 'feature/api/creator/getCreator';

type FormInputData = {
  email: string;
  relationId: string;
};

export const EnhancedFamilyEntry: VFC = () => {
  const { id: creatorId } = useParams();
  const {
    data,
    error: getCreatorError,
    isLoading: getCreatorIsLoading,
  } = useQuery<RtnData, ApiError>(
    ['creator', creatorId],
    () => getCreator({ creatorId }),
    { enabled: !!creatorId },
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<FormInputData>({ criteriaMode: 'all', mode: 'all' });

  const emailProps = {
    ...register('email', {
      required: '必須入力です',
      maxLength: { value: 30, message: '30桁以内で入力してください' },
    }),
    isInvalid: !!errors?.email,
    errorTypes: errors?.email?.types,
  };

  const {
    data: relationData,
    error: relationError,
    isFetching: relationIsFetching,
  } = useQuery<SeletcOptions, ApiError>(
    ['relations', 'family_entry'],
    () => selectOptions({ path: 'relations' }),
    { staleTime: Infinity },
  );
  const relationProps = {
    ...register('relationId', {
      required: '必須入力です',
    }),
    isFetching: relationIsFetching,
    options: relationData?.options,
    apiErrorMessage: relationError?.displayMessages,
    isInvalid: !!errors?.relationId,
    errorTypes: errors?.relationId?.types,
    labelName: data?.creator ? `${data?.creator.name}さんとの関係` : '',
  };

  const submitBtnProps = {
    disabled: !isValid || !data?.creator,
    isLoading: isSubmitting,
  };

  const [apiError, setApiError] = useState<ApiError | null>(null);
  const toast = useToast();
  const navigate = useNavigate();
  const onSubmit: SubmitHandler<FormInputData> = async (formInputData) => {
    if (!data?.creator) return;
    const apiInputData = {
      ...formInputData,
      creatorId: data.creator.id,
    };
    try {
      const { isSuccess, userName } = await createFamily(apiInputData);
      if (isSuccess) {
        toast({
          title: `${userName}さんを家族に追加しました`,
          status: 'success',
          isClosable: true,
        });
        navigate(`/creators/${data.creator.id}`);
      }
    } catch (error) {
      if (error instanceof ApiError) {
        setApiError(error);
      } else {
        // eslint-disable-next-line no-console
        console.error(error);
      }
    }
  };

  useLogout(getCreatorError || apiError);

  return (
    <FamilyEntry
      creator={data?.creator}
      getCreatorIsLoading={getCreatorIsLoading}
      onSubmit={handleSubmit(onSubmit)}
      apiMessages={
        getCreatorError?.displayMessages || apiError?.displayMessages
      }
      {...{
        emailProps,
        relationProps,
        submitBtnProps,
      }}
    />
  );
};
