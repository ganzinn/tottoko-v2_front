import { useState, VFC } from 'react';
import { useNavigate } from 'react-router-dom';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useToast } from '@chakra-ui/react';

import { EmailChangeEntry } from 'components/pages/EmailChangeEntry';
import { ApiError } from 'feature/api';
import { emailChangeEntry } from 'feature/api/users/emailChangeEntry';

type FormData = {
  email: string;
};

export const EnhancedEmailChangeEntry: VFC = () => {
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
      const { success } = await emailChangeEntry(formData);
      if (success) {
        toast({
          title: 'メールアドレスの変更申請を受け付けました',
          description:
            '新しいメールアドレスに変更完了のためのURLを送付しました。URLにアクセスし、変更手続きを完了させて下さい。',
          status: 'success',
          duration: null,
          isClosable: true,
        });
        navigate('/users/me');
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
    <EmailChangeEntry
      onSubmit={handleSubmit(onSubmit)}
      apiMessages={apiMessages}
      emailProps={emailProps}
      submitBtnProps={submitBtnProps}
    />
  );
};
