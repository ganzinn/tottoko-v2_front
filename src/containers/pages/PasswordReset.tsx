import { useState, VFC } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { PasswordReset } from 'components/pages/PasswordReset';
import { ApiError } from 'feature/api';
import { useToast } from '@chakra-ui/react';
import { passwordReset } from 'feature/api/users/passwordReset';

export type FormData = {
  password: string;
  passwordConfirmation: string;
};

export const EnhancedPasswordReset: VFC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<FormData>({ criteriaMode: 'all', mode: 'all' });

  const [apiMessages, setApiMessages] = useState<string[]>();
  const toast = useToast();
  const navigate = useNavigate();
  const onSubmit: SubmitHandler<FormData> = async (formData) => {
    const reqData = {
      ...formData,
      token,
    };
    try {
      const { success } = await passwordReset(reqData);
      if (success) {
        toast({
          title: 'パスワードを再設定しました',
          status: 'success',
          isClosable: true,
        });
        navigate('/users/sessions/login');
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

  const submitBtnProps = {
    disabled: !isValid,
    isLoading: isSubmitting,
  };

  return (
    <PasswordReset
      onSubmit={handleSubmit(onSubmit)}
      apiMessages={apiMessages}
      passwordProps={passwordProps}
      passwordConfirmationProps={passwordConfirmationProps}
      submitBtnProps={submitBtnProps}
    />
  );
};
