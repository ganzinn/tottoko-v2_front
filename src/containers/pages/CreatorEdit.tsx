import { VFC, useState, useEffect, ChangeEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useQuery } from 'react-query';

import { CreatorEdit } from 'components/pages/CreatorEdit';
import { edit as editCreator } from 'feature/api/creator/edit';
import { useToast } from '@chakra-ui/react';
import { selectOptions, SeletcOptions } from 'feature/api/select';
import { ApiError } from 'feature/api';
import { useLogout } from 'feature/hooks/useLogout';
import { getCreator, RtnData } from 'feature/api/creator/getCreator';

type FormInputData = {
  name: string;
  dateOfBirth: string;
  genderId?: string;
  images?: FileList;
};

export type ApiInputData = Omit<FormInputData, 'images'> & {
  avatar?: File;
  creatorId: string;
  regdAvatarDel: boolean;
};

export const EnhancedCreatorEdit: VFC = () => {
  const [regdAvatarDelFlg, setRegdAvatarDelFlg] = useState(false);
  const [apiError, setApiError] = useState<ApiError | null>(null);
  const { id: creatorId } = useParams();

  const {
    data,
    error: getCreatorError,
    isLoading: getCreatorIsLoading,
  } = useQuery<RtnData, ApiError>(
    ['creators', creatorId],
    () => getCreator({ creatorId }),
    { enabled: !!creatorId },
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
    reset,
  } = useForm<FormInputData>({
    criteriaMode: 'all',
    mode: 'all',
    // defaultValues: {
    //   name: '',
    //   dateOfBirth: '',
    // },
  });

  useEffect(() => {
    reset({
      name: data?.creator.name,
      dateOfBirth: data?.creator.dateOfBirth,
      genderId: data?.creator.gender?.id,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [genderData, data]);

  const onSubmit: SubmitHandler<FormInputData> = async (formInputData) => {
    if (!data?.creator.id) return;
    const apiInputData: ApiInputData = {
      ...formInputData,
      avatar:
        formInputData.images && formInputData.images[0]
          ? formInputData.images[0]
          : undefined,
      creatorId: data.creator.id,
      regdAvatarDel: regdAvatarDelFlg,
    };
    try {
      const { isSuccess } = await editCreator(apiInputData);
      if (isSuccess) {
        toast({
          title: '??????????????????????????????????????????',
          status: 'success',
          isClosable: true,
        });
        navigate(`/creators/${apiInputData.creatorId}`);
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

  const nameProps = {
    ...register('name', {
      required: '??????????????????',
      maxLength: { value: 30, message: '30????????????????????????????????????' },
    }),
    isInvalid: !!errors?.name,
    errorTypes: errors?.name?.types,
    disabled: getCreatorIsLoading,
    placeholder: getCreatorIsLoading ? '??????????????????...' : '',
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
    }),
    isInvalid: !!errors?.dateOfBirth,
    errorTypes: errors?.dateOfBirth?.types,
    disabled: getCreatorIsLoading,
    placeholder: getCreatorIsLoading ? '??????????????????...' : 'yyyy-mm-dd',
  };

  const genderProps = {
    ...register('genderId', {}),
    isFetching: genderIsFetching || getCreatorIsLoading,
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
    regdAvatarUrl: data?.creator.originalAvatarUrl,
    regdAvatarDelFlg,
    onCheckBoxChange: (e: ChangeEvent<HTMLInputElement>) =>
      setRegdAvatarDelFlg(e.target.checked),
  };

  const cancelBtnProps = {
    onClick: () => navigate(`/creators/${creatorId || ''}`),
    isLoading: isSubmitting,
  };

  const submitBtnProps = {
    disabled: !isValid || !data?.creator,
    isLoading: isSubmitting,
  };

  return (
    <CreatorEdit
      onSubmit={handleSubmit(onSubmit)}
      creator={data?.creator}
      getCreatorIsLoading={getCreatorIsLoading}
      apiMessages={
        getCreatorError?.displayMessages || apiError?.displayMessages
      }
      {...{
        nameProps,
        dateOfBirthProps,
        genderProps,
        avatarProps,
        cancelBtnProps,
        submitBtnProps,
      }}
    />
  );
};
