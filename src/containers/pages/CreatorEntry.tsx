import { VFC, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SubmitHandler, useForm } from 'react-hook-form';

import { CreatorEntry } from 'components/pages/CreatorEntry';
import { CmnSelectProps } from 'components/molecules/CmnSelect';
import { creatorCreate } from 'feature/api/creator/create';
import { useToast } from '@chakra-ui/react';
import { useAppSelector } from 'store';
import { selectOptions } from 'feature/api/select';

type FormDataProps = {
  name: string;
  dateOfBirth: string;
  gender: string;
  relation: string;
};

export const EnhancedCreatorEntry: VFC = () => {
  const [apiMessages, setApiMessages] = useState<string[]>();
  const [genderOptions, setGenderOptions] =
    useState<CmnSelectProps['options']>();
  const [relationOptions, setRelationOptions] =
    useState<CmnSelectProps['options']>();
  useEffect(() => {
    const load = async () => {
      const { options, errorMessages } = await selectOptions({
        path: 'genders',
      });
      if (options) {
        setGenderOptions(() => options);
      } else if (errorMessages) {
        setApiMessages(() => errorMessages);
      } else {
        setApiMessages(() => ['システムエラー（エラー情報なし）']);
      }
    };
    void load();
  }, []);
  useEffect(() => {
    const load = async () => {
      const { options, errorMessages } = await selectOptions({
        path: 'relations?purp=creator_entry',
      });
      if (options) {
        setRelationOptions(() => options);
      } else if (errorMessages) {
        setApiMessages(() => errorMessages);
      } else {
        setApiMessages(() => ['システムエラー（エラー情報なし）']);
      }
    };
    void load();
  }, []);

  const accessToken = useAppSelector(
    (state) => state.userAuth?.accessToken.token,
  );
  const toast = useToast();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<FormDataProps>({ criteriaMode: 'all', mode: 'all' });

  const onSubmit: SubmitHandler<FormDataProps> = (formData) => {
    if (accessToken) {
      const load = async () => {
        const { isSuccess, errorMessages } = await creatorCreate({
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
      void load();
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

  const genderProps = {
    ...register('gender', {}),
    options: genderOptions,
    isInvalid: !!errors?.gender,
    errorTypes: errors?.gender?.types,
  };

  const relationProps = {
    ...register('relation', {
      required: '必須入力です',
    }),
    options: relationOptions,
    isInvalid: !!errors?.relation,
    errorTypes: errors?.relation?.types,
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
