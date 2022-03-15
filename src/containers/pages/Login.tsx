import { VFC, useState, ChangeEvent, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { SubmitHandler, useForm } from 'react-hook-form';

import { Login } from 'components/pages/Login';
import { useAppDispatch, setUserAuth, useAppSelector } from 'store';
import { login, LoginParams } from 'feature/api/users/login';

export const EnhancedLogin: VFC = () => {
  const [apiMessages, setApiMessages] = useState<string[]>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state as { from: Location };
  const userAuth = useAppSelector((state) => state.userAuth);
  const from = locationState ? locationState.from.pathname : '/users/me/works';
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<LoginParams>({ criteriaMode: 'all', mode: 'all' });

  useEffect(() => {
    if (userAuth) {
      navigate('/users/me/works', { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userAuth]);

  const onSubmit: SubmitHandler<LoginParams> = async (submitData) => {
    const { userAuth: newUserAuth, errorMessages } = await login(submitData);
    if (newUserAuth) {
      dispatch(setUserAuth(newUserAuth));
      navigate(from, { replace: true });
    } else if (errorMessages) {
      setApiMessages(() => errorMessages);
    } else {
      setApiMessages(() => ['システムエラー（エラー情報なし）']);
    }
  };

  const emailProps = {
    ...register('auth.email', {
      required: '必須入力です',
      maxLength: { value: 30, message: '30桁以内で入力してください' },
      pattern: {
        value:
          /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
        message: 'メールアドレス形式で入力してください',
      },
    }),
    isInvalid: !!errors?.auth?.email,
    errorTypes: errors?.auth?.email?.types,
  };

  const passwordProps = {
    ...register('auth.password', {
      required: '必須入力です',
      maxLength: { value: 30, message: '30桁以内で入力してください' },
    }),
    isInvalid: !!errors?.auth?.password,
    errorTypes: errors?.auth?.password?.types,
    handleChange: (e: ChangeEvent<HTMLInputElement>) => {
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
