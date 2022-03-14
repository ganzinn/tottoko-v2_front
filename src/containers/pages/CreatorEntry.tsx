import { VFC, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useQuery } from 'react-query';

import { CreatorEntry } from 'components/pages/CreatorEntry';
import { createCreator } from 'feature/api/creator/create';
import { useToast } from '@chakra-ui/react';
import { useAppSelector } from 'store';
import { selectOptions, SeletcOptions } from 'feature/api/select';

type FormDataProps = {
  name: string;
  dateOfBirth: string;
  gender: string;
  relation: string;
};

export const EnhancedCreatorEntry: VFC = () => {
  const [apiMessages, setApiMessages] = useState<string[]>();
  const accessToken = useAppSelector(
    (state) => state.userAuth?.accessToken.token,
  );

  const {
    data: relationOptions,
    error: relationApiErrorMessage,
    isFetching: relationIsFetching,
  } = useQuery<SeletcOptions, string[]>(
    ['relations', 'creator_entry'],
    () => selectOptions({ path: 'relations?purp=creator_entry' }),
    {
      enabled: !!accessToken,
      staleTime: Infinity,
    },
  );

  const {
    data: genderOptions,
    error: genderApiErrorMessage,
    isFetching: genderIsFetching,
  } = useQuery<SeletcOptions, string[]>(
    ['genders'],
    () => selectOptions({ path: 'genders' }),
    {
      enabled: !!accessToken,
      staleTime: Infinity,
    },
  );

  const toast = useToast();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<FormDataProps>({ criteriaMode: 'all', mode: 'all' });

  const onSubmit: SubmitHandler<FormDataProps> = async (formData) => {
    if (accessToken) {
      const load = async () => {
        const { isSuccess, errorMessages } = await createCreator({
          ...formData,
          accessToken,
        });
        if (isSuccess) {
          toast({ title: '登録しました', status: 'success', isClosable: true });
          navigate('/users/me/creators');
        } else if (errorMessages) {
          setApiMessages(() => errorMessages);
        } else {
          setApiMessages(() => ['システムエラー（エラー情報なし）']);
        }
      };
      await load();
    } else {
      setApiMessages(() => ['システムエラー(認証情報なし)']);
    }
  };

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
    ...register('relation', {
      required: '必須入力です',
    }),
    isFetching: relationIsFetching,
    options: relationOptions?.options,
    apiErrorMessage: relationApiErrorMessage,
    isInvalid: !!errors?.relation,
    errorTypes: errors?.relation?.types,
  };

  const genderProps = {
    ...register('gender', {}),
    isFetching: genderIsFetching,
    options: genderOptions?.options,
    apiErrorMessage: genderApiErrorMessage,
    isInvalid: !!errors?.gender,
    errorTypes: errors?.gender?.types,
  };

  const submitBtnProps = {
    disabled: !isValid,
    isLoading: isSubmitting,
  };

  return (
    <CreatorEntry
      onSubmit={handleSubmit(onSubmit)}
      {...{
        apiMessages,
        nameProps,
        dateOfBirthProps,
        genderProps,
        relationProps,
        submitBtnProps,
      }}
    />
  );
};
