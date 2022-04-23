import { VFC, useState, ChangeEvent, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { SubmitHandler, useForm } from 'react-hook-form';

import { Login } from 'components/pages/Login';
import { useAppDispatch, setUserAuth, useAppSelector } from 'store';
import { login } from 'feature/api/users/login';
import { ApiError } from 'feature/api';

export type FormData = {
  email: string;
  password: string;
};

export const EnhancedLogin: VFC = () => {
  const [apiMessages, setApiMessages] = useState<string[]>();
  const userAuth = useAppSelector((state) => state.userAuth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state as { from: Location };
  const from = locationState ? locationState.from : '/';
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<FormData>({ criteriaMode: 'all', mode: 'all' });

  useEffect(() => {
    if (userAuth) {
      navigate(from, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userAuth]);

  const onSubmit: SubmitHandler<FormData> = async (formData) => {
    try {
      const { userAuth: newUserAuth } = await login(formData);
      dispatch(setUserAuth(newUserAuth));
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
    beforeValidateOnChange: (e: ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;
      if (value.length > 30) {
        e.target.value = value.slice(0, 30);
      }
    },
  };

  const PasswordResetEntryPath = '/users/password_reset_entry';

  const submitBtnProps = {
    disabled: !isValid,
    isLoading: isSubmitting,
  };

  return (
    <Login
      onSubmit={handleSubmit(onSubmit)}
      {...{
        apiMessages,
        emailProps,
        passwordProps,
        PasswordResetEntryPath,
        submitBtnProps,
      }}
    />
  );
};
