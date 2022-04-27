import { useState, VFC } from 'react';
import { useNavigate } from 'react-router-dom';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useToast } from '@chakra-ui/react';

import { PasswordResetEntry } from 'components/pages/PasswordResetEntry';
import { ApiError } from 'feature/api';
import { passwordResetEntry } from 'feature/api/users/passwordResetEntry';

type FormData = {
  email: string;
};

export const EnhancedPasswordResetEntry: VFC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<FormData>({ criteriaMode: 'all', mode: 'all' });

  const [apiMessages, setApiMessages] = useState<string[]>();
  const toast = useToast();
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<FormData> = async (formData) => {
    try {
      const { success } = await passwordResetEntry(formData);
      if (success) {
        toast({
          title: 'パスワードリセットの申請を受け付けました。',
          description:
            'ご登録のメールアドレスにパスワードリセット用のURLを送付しました。URLにアクセスし、手続きを進めて下さい。',
          status: 'success',
          duration: null,
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

  const submitBtnProps = {
    disabled: !isValid,
    isLoading: isSubmitting,
  };

  return (
    <PasswordResetEntry
      onSubmit={handleSubmit(onSubmit)}
      apiMessages={apiMessages}
      emailProps={emailProps}
      submitBtnProps={submitBtnProps}
    />
  );
};
