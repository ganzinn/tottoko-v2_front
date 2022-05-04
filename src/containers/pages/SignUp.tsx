import { useEffect, useState, VFC } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { SignUp } from 'components/pages/SignUp';
import { ApiError } from 'feature/api';
import { create } from 'feature/api/users/create';
import { useAppSelector } from 'store';

type FormData = {
  email: string;
  password: string;
  passwordConfirmation: string;
  name: string;
};

export const EnhancedSignUp: VFC = () => {
  const [isRegistered, setIsRegistered] = useState(false);
  const [apiMessages, setApiMessages] = useState<string[]>();
  const userAuth = useAppSelector((state) => state.userAuth);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<FormData>({ criteriaMode: 'all', mode: 'all' });

  useEffect(() => {
    if (userAuth) {
      navigate('/', { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userAuth]);

  const onSubmit: SubmitHandler<FormData> = async (formData) => {
    try {
      const { success } = await create(formData);
      if (success) {
        setIsRegistered(true);
      }
    } catch (error) {
      if (error instanceof ApiError) {
        setApiMessages(error.displayMessages);
      } else {
        // eslint-disable-next-line no-console
        console.error(error);
      }
    }
  };

  const emailProps = {
    ...register('email', {
      required: '必須入力です',
      maxLength: { value: 30, message: '30桁以内で入力してください' },
      pattern: {
        value:
          /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
        message: 'メールアドレス形式で入力してください',
      },
    }),
    isInvalid: !!errors?.email,
    errorTypes: errors?.email?.types,
  };

  const passwordProps = {
    ...register('password', {
      required: '必須入力です',
      maxLength: { value: 30, message: '30桁以内で入力してください' },
    }),
    isInvalid: !!errors?.password,
    errorTypes: errors?.password?.types,
  };

  const passwordConfirmationProps = {
    ...register('passwordConfirmation', {
      required: '必須入力です',
      maxLength: { value: 30, message: '30桁以内で入力してください' },
    }),
    isInvalid: !!errors?.passwordConfirmation,
    errorTypes: errors?.passwordConfirmation?.types,
  };

  const nameProps = {
    ...register('name', {
      required: '必須入力です',
      maxLength: { value: 30, message: '30桁以内で入力してください' },
    }),
    isInvalid: !!errors?.name,
    errorTypes: errors?.name?.types,
  };

  const submitBtnProps = {
    disabled: !isValid,
    isLoading: isSubmitting,
  };

  return (
    <SignUp
      onSubmit={handleSubmit(onSubmit)}
      {...{
        apiMessages,
        emailProps,
        passwordProps,
        passwordConfirmationProps,
        nameProps,
        submitBtnProps,
        isRegistered,
      }}
    />
  );
};
