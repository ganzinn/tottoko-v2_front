import { useState, VFC } from 'react';
import { useNavigate } from 'react-router-dom';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useQuery } from 'react-query';

import { WorkEntry } from 'components/pages/WorkEntry';
import { create } from 'feature/api/work/create';
import { useToast } from '@chakra-ui/react';
import { selectOptions, SeletcOptions } from 'feature/api/select';
import { ApiError } from 'feature/api';
import { useLogout } from 'feature/hooks/useLogout';
import { Creator } from 'feature/models/creator';
import { getCreators } from 'feature/api/creator/getCreators';

type FormInputData = {
  creatorId: string;
  createdDate: string;
  scopeId: string;
  title?: string;
  description?: string;
};

export type ApiInputData = { images: File[] } & FormInputData;

export const EnhancedWorkEntry: VFC = () => {
  const [apiError, setApiError] = useState<ApiError | null>(null);

  const {
    data: creatorsData,
    error: creatorsError,
    isFetching: creatorsIsFetching,
  } = useQuery<{ creators?: Creator[] }, ApiError>(
    ['creators', 'work_entry'],
    () => getCreators({ querys: ['purp=work_entry'] }),
  );

  const {
    data: scopeData,
    error: scopeError,
    isFetching: scopeIsFetching,
  } = useQuery<SeletcOptions, ApiError>(
    ['scopes'],
    () => selectOptions({ path: 'scopes' }),
    { staleTime: Infinity },
  );

  const [images, setImages] = useState<File[]>([]);

  const toast = useToast();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<FormInputData>({ criteriaMode: 'all', mode: 'all' });

  const onSubmit: SubmitHandler<FormInputData> = async (formInputData) => {
    const apiInputData: ApiInputData = {
      images,
      ...formInputData,
    };
    try {
      const { isSuccess, workId } = await create(apiInputData);
      if (isSuccess) {
        const targetCreatorName = creatorsData?.creators?.find(
          (creator) => creator.id === formInputData.creatorId,
        )?.name;
        toast({
          title: `${targetCreatorName || ''}さんの作品を登録しました`,
          status: 'success',
          isClosable: true,
        });
        navigate(`/works/${workId}`);
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

  useLogout(apiError || creatorsError);

  const imagesUploadProps = {
    images,
    setImages,
  };

  const creatorProps = {
    ...register('creatorId', {
      required: '必須入力です',
    }),
    isFetching: creatorsIsFetching,
    options: (() => {
      if (!creatorsData?.creators) return undefined;

      return creatorsData.creators.map((creator) => ({
        id: creator.id,
        value: creator.name,
      }));
    })(),
    apiErrorMessage: creatorsError?.displayMessages,
    isInvalid: !!errors?.creatorId,
    errorTypes: errors?.creatorId?.types,
  };

  const createdDateProps = {
    ...register('createdDate', {
      required: '必須入力です',
      validate: (value) => {
        if (!value) return true;
        const arry = value.split('-');
        const year = Number(arry[0]);
        if (year < 1900 || year > 2100) {
          return '正しい日付を入力してください';
        }

        return true;
      },
    }),
    isInvalid: !!errors?.createdDate,
    errorTypes: errors?.createdDate?.types,
  };

  const scopeProps = {
    ...register('scopeId', {
      required: '必須入力です',
    }),
    isFetching: scopeIsFetching,
    options: scopeData?.options,
    apiErrorMessage: scopeError?.displayMessages,
    isInvalid: !!errors?.scopeId,
    errorTypes: errors?.scopeId?.types,
  };

  const titleProps = {
    ...register('title', {
      maxLength: { value: 40, message: '40桁以内で入力してください' },
    }),
    isInvalid: !!errors?.title,
    errorTypes: errors?.title?.types,
  };

  const descriptionProps = {
    ...register('description', {
      maxLength: { value: 255, message: '255桁以内で入力してください' },
    }),
    isInvalid: !!errors?.description,
    errorTypes: errors?.description?.types,
  };

  const submitBtnProps = {
    disabled: !isValid || !images.length,
    isLoading: isSubmitting,
  };

  return (
    <WorkEntry
      onSubmit={handleSubmit(onSubmit)}
      {...{
        apiMessages: apiError?.displayMessages,
        imagesUploadProps,
        creatorProps,
        createdDateProps,
        scopeProps,
        titleProps,
        descriptionProps,
        submitBtnProps,
      }}
    />
  );
};
