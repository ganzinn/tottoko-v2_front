import { VFC, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useQuery } from 'react-query';

import { CreatorEntry } from 'components/pages/CreatorEntry';
import { createCreator } from 'feature/api/creator/create';
import { useToast } from '@chakra-ui/react';
import { selectOptions, SeletcOptions } from 'feature/api/select';
import { ApiError } from 'feature/api';
import { useLogout } from 'feature/hooks/useLogout';

type FormInputData = {
  name: string;
  dateOfBirth: string;
  relationId: string;
  genderId?: string;
  avatar?: FileList;
};

export type ApiInputData = Omit<FormInputData, 'avatar'> & { avatar?: File };

export const EnhancedCreatorEntry: VFC = () => {
  const [apiError, setApiError] = useState<ApiError | null>(null);

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
      avatar: formInputData.avatar ? formInputData.avatar[0] : undefined,
    };
    try {
      const { isSuccess } = await createCreator(apiInputData);
      if (isSuccess) {
        toast({ title: '登録しました', status: 'success', isClosable: true });
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
      required: '必須入力です',
      maxLength: { value: 30, message: '30桁以内で入力してください' },
    }),
    isInvalid: !!errors?.name,
    errorTypes: errors?.name?.types,
  };

  const dateOfBirthProps = {
    ...register('dateOfBirth', {
      required: '必須入力です',
      // valueAsDate: true, // 型が「Date」となり、ブラウザ標準の日付チェックが有効となる。
      // しかし、他のReactHookFormのチェック（必須入力など）が有効とならないため無効化
    }),
    isInvalid: !!errors?.dateOfBirth,
    errorTypes: errors?.dateOfBirth?.types,
  };

  const relationProps = {
    ...register('relationId', {
      required: '必須入力です',
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

  // 画像バリデーション
  const validateAvatar = (images?: FileList) => {
    if (!images) return true;
    const [avatar] = images;
    const fsMb = avatar?.size / (1024 * 1024);
    if (fsMb && fsMb > 3) {
      return '画像サイズは1MB以下にしてください';
    }
    if (!['image/jpeg', 'image/png'].includes(avatar?.type)) {
      return 'jpeg, pngのファイル形式で指定してください';
    }

    return true;
  };
  const avatarProps = {
    ...register('avatar', {
      validate: validateAvatar,
    }),
    isInvalid: !!errors?.avatar,
    errorTypes: errors?.avatar?.types,
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
