import { VFC, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useQuery, useQueryClient } from 'react-query';

import { CreatorEntry } from 'components/pages/CreatorEntry';
import { create as createCreator } from 'feature/api/creator/create';
import { useToast } from '@chakra-ui/react';
import { selectOptions, SeletcOptions } from 'feature/api/select';
import { ApiError } from 'feature/api';
import { useLogout } from 'feature/hooks/useLogout';

type FormInputData = {
  name: string;
  dateOfBirth: string;
  relationId: string;
  genderId?: string;
  images?: FileList;
};

export type ApiInputData = Omit<FormInputData, 'images'> & { avatar?: File };

export const EnhancedCreatorEntry: VFC = () => {
  const [apiError, setApiError] = useState<ApiError | null>(null);
  const queryClient = useQueryClient();

  const {
    data: relationData,
    error: relationError,
    isFetching: relationIsFetching,
  } = useQuery<SeletcOptions, ApiError>(
    ['relations', 'creator_entry'],
    () => selectOptions({ path: 'relations?purp=creator_entry' }),
    { staleTime: Infinity },
  );

  const {
    data: genderData,
    error: genderError,
    isFetching: genderIsFetching,
  } = useQuery<SeletcOptions, ApiError>(
    ['genders'],
    () => selectOptions({ path: 'genders' }),
    { staleTime: Infinity },
  );

  const toast = useToast();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<FormInputData>({ criteriaMode: 'all', mode: 'all' });

  const onSubmit: SubmitHandler<FormInputData> = async (formInputData) => {
    const apiInputData: ApiInputData = {
      ...formInputData,
      avatar:
        formInputData.images && formInputData.images[0]
          ? formInputData.images[0]
          : undefined,
    };
    try {
      const { isSuccess } = await createCreator(apiInputData);
      if (isSuccess) {
        toast({
          title: `${formInputData.name}????????????????????????????????????`,
          status: 'success',
          isClosable: true,
        });
        void queryClient.resetQueries(['creators', 'work_entry'], {
          exact: true,
        });
        navigate('/users/me/creators');
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

  useLogout(apiError);

  const nameProps = {
    ...register('name', {
      required: '??????????????????',
      maxLength: { value: 30, message: '30????????????????????????????????????' },
    }),
    isInvalid: !!errors?.name,
    errorTypes: errors?.name?.types,
  };

  const dateOfBirthProps = {
    ...register('dateOfBirth', {
      required: '??????????????????',
      validate: (value) => {
        if (!value) return true;
        const arry = value.split('-');
        const year = Number(arry[0]);
        if (year < 1900 || year > 2100) {
          return '????????????????????????????????????????????????';
        }

        return true;
      },
      // valueAsDate: true, // ?????????Date???????????????????????????????????????????????????????????????????????????
      // ??????????????????ReactHookForm??????????????????????????????????????????????????????????????????????????????
    }),
    isInvalid: !!errors?.dateOfBirth,
    errorTypes: errors?.dateOfBirth?.types,
  };

  const relationProps = {
    ...register('relationId', {
      required: '??????????????????',
    }),
    isFetching: relationIsFetching,
    options: relationData?.options,
    apiErrorMessage: relationError?.displayMessages,
    isInvalid: !!errors?.relationId,
    errorTypes: errors?.relationId?.types,
  };

  const genderProps = {
    ...register('genderId', {}),
    isFetching: genderIsFetching,
    options: genderData?.options,
    apiErrorMessage: genderError?.displayMessages,
    isInvalid: !!errors?.genderId,
    errorTypes: errors?.genderId?.types,
  };

  // ???????????????????????????
  const avatarValidate = (images?: FileList) => {
    if (!images) return true;
    const [avatar] = images;
    if (!avatar) return true;
    const fsMb = avatar.size / (1024 * 1024);
    if (fsMb && fsMb > 1) {
      return '??????????????????1MB???????????????????????????';
    }
    if (!['image/jpeg', 'image/png'].includes(avatar.type)) {
      return 'jpeg, png????????????????????????????????????????????????';
    }

    return true;
  };
  const avatarProps = {
    ...register('images', {
      validate: avatarValidate,
    }),
    isInvalid: !!errors?.images,
    errorTypes: errors?.images?.types,
  };

  const submitBtnProps = {
    disabled: !isValid,
    isLoading: isSubmitting,
  };

  return (
    <CreatorEntry
      onSubmit={handleSubmit(onSubmit)}
      {...{
        apiMessages: apiError?.displayMessages,
        nameProps,
        dateOfBirthProps,
        genderProps,
        avatarProps,
        relationProps,
        submitBtnProps,
      }}
    />
  );
};
