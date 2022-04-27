import { useMemo, useState, VFC } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useToast } from '@chakra-ui/react';

import { EmailChange } from 'components/pages/EmailChange';
import { ApiError } from 'feature/api';
import { useAppDispatch, setUserAuth } from 'store';
import { emailChange } from 'feature/api/users/emailChange';

type FormData = {
  password: string;
};

type Token = {
  change_email: string;
};

const isToken = (arg: unknown): arg is Token => {
  const b = arg as Token;

  return typeof b.change_email === 'string';
};

export const EnhancedEmailChange: VFC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [checkError, setCheckError] = useState<string>();

  const jwtEmail = useMemo(() => {
    if (token === null) {
      setCheckError('不正なURLです');

      return '-';
    }
    const { 1: rawPayload, length } = token.split('.');
    if (length !== 3) {
      setCheckError('不正なURLです');

      return '-';
    }
    const base64Payload = rawPayload.replace(/-/g, '+').replace(/_/g, '/');
    let newEmail = '-';
    try {
      const jsonPayload = decodeURIComponent(window.atob(base64Payload));
      const payload = JSON.parse(jsonPayload) as unknown;
      if (isToken(payload)) {
        newEmail = payload.change_email;
      }
    } catch (error) {
      setCheckError('不正なURLです');
    }

    return newEmail;
  }, [token]);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<FormData>({ criteriaMode: 'all', mode: 'all' });

  const [apiMessages, setApiMessages] = useState<string[]>();
  const dispatch = useAppDispatch();
  const toast = useToast();
  const navigate = useNavigate();
  const onSubmit: SubmitHandler<FormData> = async (formData) => {
    const reqData = {
      ...formData,
      token,
    };
    try {
      const { success, userAuth } = await emailChange(reqData);
      if (success) {
        dispatch(setUserAuth(userAuth));
        toast({
          title: 'メールアドレスを変更しました',
          status: 'success',
          isClosable: true,
        });
        navigate('/');
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

  const submitBtnProps = {
    disabled: !isValid || !!checkError,
    isLoading: isSubmitting,
  };

  return (
    <EmailChange
      onSubmit={handleSubmit(onSubmit)}
      apiMessages={apiMessages}
      checkError={checkError}
      jwtEmail={jwtEmail}
      passwordProps={passwordProps}
      submitBtnProps={submitBtnProps}
    />
  );
};
