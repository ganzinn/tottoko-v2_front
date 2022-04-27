import { VFC, useState, useEffect, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useQuery } from 'react-query';

import { MyprofileEdit } from 'components/pages/MyprofileEdit';
import { editMyprofile } from 'feature/api/users/editMyprofile';
import { useToast } from '@chakra-ui/react';
import { ApiError } from 'feature/api';
import { useLogout } from 'feature/hooks/useLogout';
import { getMyprofile, RtnData } from 'feature/api/users/getMyprofile';
import { useAppDispatch, updateMyprofile, useAppSelector } from 'store';

type FormInputData = {
  name: string;
  images?: FileList;
};

export const EnhancedMyprofileEdit: VFC = () => {
  const userId = useAppSelector((state) => state.userAuth?.loginUser.id);
  const [regdAvatarDelFlg, setRegdAvatarDelFlg] = useState(false);
  const [apiError, setApiError] = useState<ApiError | null>(null);

  const {
    data,
    error: getMyprofileError,
    isLoading: getMyprofileIsLoading,
  } = useQuery<RtnData, ApiError>(['users', userId], getMyprofile, {
    enabled: !!userId,
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
    reset,
  } = useForm<FormInputData>({
    criteriaMode: 'all',
    mode: 'all',
  });

  useEffect(() => {
    reset({
      name: data?.user.name,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const toast = useToast();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const onSubmit: SubmitHandler<FormInputData> = async (formInputData) => {
    const apiInputData = {
      name: formInputData.name,
      avatar:
        formInputData.images && formInputData.images[0]
          ? formInputData.images[0]
          : undefined,
      regdAvatarDel: regdAvatarDelFlg,
    };
    try {
      const { success, user } = await editMyprofile(apiInputData);
      if (success) {
        dispatch(updateMyprofile(user));
        toast({
          title: 'ユーザー情報を更新しました',
          status: 'success',
          isClosable: true,
        });
        navigate('/users/me');
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

  useLogout(getMyprofileError || apiError);

  const nameProps = {
    ...register('name', {
      required: '必須入力です',
      maxLength: { value: 30, message: '30桁以内で入力してください' },
    }),
    isInvalid: !!errors?.name,
    errorTypes: errors?.name?.types,
    disabled: getMyprofileIsLoading,
    placeholder: getMyprofileIsLoading ? 'データ取得中...' : '',
  };

  // 画像バリデーション
  const avatarValidate = (images?: FileList) => {
    if (!images) return true;
    const [avatar] = images;
    if (!avatar) return true;
    const fsMb = avatar.size / (1024 * 1024);
    if (fsMb && fsMb > 1) {
      return '画像サイズは1MB以下にしてください';
    }
    if (!['image/jpeg', 'image/png'].includes(avatar.type)) {
      return 'jpeg, pngのファイル形式で指定してください';
    }

    return true;
  };
  const avatarProps = {
    ...register('images', {
      validate: avatarValidate,
    }),
    isInvalid: !!errors?.images,
    errorTypes: errors?.images?.types,
    regdAvatarUrl: data?.user.originalAvatarUrl,
    regdAvatarDelFlg,
    onCheckBoxChange: (e: ChangeEvent<HTMLInputElement>) =>
      setRegdAvatarDelFlg(e.target.checked),
  };

  const cancelBtnProps = {
    onClick: () => navigate('/users/me'),
    isLoading: isSubmitting,
  };

  const submitBtnProps = {
    disabled: !isValid || !data?.user,
    isLoading: isSubmitting || getMyprofileIsLoading,
  };

  return (
    <MyprofileEdit
      onSubmit={handleSubmit(onSubmit)}
      apiMessages={
        getMyprofileError?.displayMessages || apiError?.displayMessages
      }
      {...{
        nameProps,
        avatarProps,
        cancelBtnProps,
        submitBtnProps,
      }}
    />
  );
};
