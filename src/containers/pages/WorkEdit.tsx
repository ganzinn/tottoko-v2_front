import { useEffect, useState, VFC } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from '@chakra-ui/react';
import { SubmitHandler, useForm } from 'react-hook-form';

import { ApiError } from 'feature/api';
import { getCreators } from 'feature/api/creator/getCreators';
import { Creator } from 'feature/models/creator';
import { selectOptions, SeletcOptions } from 'feature/api/select';
import { useLogout } from 'feature/hooks/useLogout';
import { WorkEdit } from 'components/pages/WorkEdit';
import { getWork, RtnData } from 'feature/api/work/getWork';
import { edit } from 'feature/api/work/edit';
import ky from 'ky';

type FormInputData = {
  creatorId: string;
  createdDate: string;
  scopeId: string;
  title?: string;
  description?: string;
};

export type ApiInputData = { images: File[] } & FormInputData;

export const EnhancedWorkEdit: VFC = () => {
  const [apiError, setApiError] = useState<ApiError | null>(null);
  const { id: workId } = useParams();

  const {
    data: getWorkData,
    error: getWorkError,
    isLoading: isLoadingGetWork,
  } = useQuery<RtnData, ApiError>(
    ['works', workId],
    () => getWork({ workId }),
    { enabled: !!workId },
  );

  const {
    data: getCreatorsData,
    error: getCreatorsError,
    isFetching: isFetchingGetcreators,
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
  const [isImageLoading, setIsImageLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
    reset,
  } = useForm<FormInputData>({ criteriaMode: 'all', mode: 'all' });

  useEffect(() => {
    if (!scopeData || !getCreatorsData || !getWorkData) return;
    reset({
      creatorId: getWorkData.work.creator.id,
      createdDate: getWorkData.work.date,
      scopeId: getWorkData.work.scope.id,
      title: getWorkData.work.title,
      description: getWorkData.work.description,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scopeData, getCreatorsData, getWorkData]);

  useEffect(() => {
    if (!getWorkData) return;
    const load = async () => {
      if (!getWorkData) return;
      setIsImageLoading(true);
      const imagePromises = getWorkData.work.detailImageUrls.map(
        async (imageSrc) => {
          const response = await ky(imageSrc);
          const blob = await response.blob();
          const fileName = decodeURI(
            imageSrc.slice(imageSrc.lastIndexOf('/') + 1),
          );

          return new File([blob], fileName);
        },
      );
      const downloadImages = await Promise.all(imagePromises);
      setImages(downloadImages);
      setIsImageLoading(false);
    };
    void load();
  }, [getWorkData]);

  const toast = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<FormInputData> = async (formInputData) => {
    if (!workId) return;
    const apiInputData = {
      workId,
      images,
      ...formInputData,
    };
    try {
      const { success } = await edit(apiInputData);
      if (success) {
        toast({
          title: '作品を更新しました',
          status: 'success',
          isClosable: true,
        });
        queryClient.removeQueries(['works', workId], { exact: true });
        if (workId) navigate(`/works/${workId}`);
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

  useLogout(apiError || getCreatorsError || getWorkError);

  const imagesUploadProps = {
    images,
    setImages,
    isLoading: isImageLoading,
    setIsLoading: setIsImageLoading,
  };

  const creatorProps = {
    ...register('creatorId', {
      required: '必須入力です',
    }),
    isFetching: isFetchingGetcreators || isLoadingGetWork,
    options: (() => {
      if (!getCreatorsData?.creators) return undefined;

      return getCreatorsData.creators.map((creator) => ({
        id: creator.id,
        value: creator.name,
      }));
    })(),
    apiErrorMessage: getCreatorsError?.displayMessages,
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
    disabled: isLoadingGetWork,
    placeholder: isLoadingGetWork ? 'データ取得中...' : 'yyyy-mm-dd',
    isInvalid: !!errors?.createdDate,
    errorTypes: errors?.createdDate?.types,
  };

  const scopeProps = {
    ...register('scopeId', {
      required: '必須入力です',
    }),
    isFetching: scopeIsFetching || isLoadingGetWork,
    options: scopeData?.options,
    apiErrorMessage: scopeError?.displayMessages,
    isInvalid: !!errors?.scopeId,
    errorTypes: errors?.scopeId?.types,
  };

  const titleProps = {
    ...register('title', {
      maxLength: { value: 40, message: '40桁以内で入力してください' },
    }),
    disabled: isLoadingGetWork,
    placeholder: isLoadingGetWork ? 'データ取得中...' : '',
    isInvalid: !!errors?.title,
    errorTypes: errors?.title?.types,
  };

  const descriptionProps = {
    ...register('description', {
      maxLength: { value: 255, message: '255桁以内で入力してください' },
    }),
    disabled: isLoadingGetWork,
    placeholder: isLoadingGetWork ? 'データ取得中...' : '',
    isInvalid: !!errors?.description,
    errorTypes: errors?.description?.types,
  };

  const cancelBtnProps = {
    onClick: () => navigate(`/works/${workId || ''}`),
    isLoading: isSubmitting,
  };

  const submitBtnProps = {
    disabled: !isValid || !images.length || isImageLoading,
    isLoading: isLoadingGetWork || isSubmitting,
  };

  return (
    <WorkEdit
      onSubmit={handleSubmit(onSubmit)}
      {...{
        apiMessages: apiError?.displayMessages,
        imagesUploadProps,
        creatorProps,
        createdDateProps,
        scopeProps,
        titleProps,
        descriptionProps,
        cancelBtnProps,
        submitBtnProps,
      }}
    />
  );
};
