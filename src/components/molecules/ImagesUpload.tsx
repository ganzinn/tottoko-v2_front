import { useRef, useState } from 'react';
import imageCompression from 'browser-image-compression';
import {
  Box,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  forwardRef,
  IconButton,
  Image,
  Stack,
  Text,
  useMergeRefs,
} from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';

import { BaseInput } from 'components/atoms/BaseInput';
import { BaseButton } from 'components/atoms/BaseButton';

export type ImagesUploadProps = {
  images?: File[];
  setImages?: React.Dispatch<React.SetStateAction<File[]>>;
  isLoading?: boolean;
  setIsLoading?: React.Dispatch<React.SetStateAction<boolean>>;
  name?: string;
  labelName?: string;
  optionalLabel?: boolean;
};

export const ImagesUpload = forwardRef<ImagesUploadProps, 'input'>(
  (
    {
      images = [],
      setImages = () => undefined,
      isLoading = false,
      setIsLoading = () => undefined,
      name = 'images',
      labelName = '画像',
      optionalLabel = false,
    },
    ref,
  ) => {
    const inputRef = useRef<HTMLInputElement>();
    const mergeRef = useMergeRefs(inputRef, ref);

    const [errorMessages, setErrorMessages] = useState<string[]>([]);

    const handleImages = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files || !e.target.files.length) return;

      const files = Object.values(e.target.files).concat();
      e.target.value = '';
      setErrorMessages([]);

      const pickedImages = files.filter((file) => {
        if (!['image/jpeg', 'image/png'].includes(file.type)) {
          setErrorMessages((state) => [
            ...state,
            'ファイル形式がjpeg, png以外の画像は指定できません',
          ]);

          return false;
        }

        if (images?.some((image) => image.name === file.name)) {
          setErrorMessages((state) => [
            ...state,
            '同じファイル名の画像は指定できません',
          ]);

          return false;
        }

        // if (file.size / (1024 * 1024) > 3) {
        //   setErrorMessages((state) => [
        //     ...state,
        //     '3Mbより大きい画像は指定できません',
        //   ]);

        //   return false;
        // }

        return true;
      });

      if (!pickedImages.length) {
        setErrorMessages((state) => [...state, '画像を指定してください']);

        return;
      }

      const newImages = images.concat(pickedImages);
      if (newImages.length >= 6) {
        setErrorMessages((state) => [...state, '画像の投稿は５枚までです']);
      }
      const limitImages = newImages.slice(0, 5);

      // 画像圧縮
      const compressOptions = {
        maxSizeMB: 3,
      };
      const load = async () => {
        setIsLoading(true);
        const registImages = await Promise.all(
          limitImages.map(async (image) => {
            let registImage = image;
            if (image.size / (1024 * 1024) > 3) {
              const compressImage = await imageCompression(
                image,
                compressOptions,
              );
              registImage = new File([compressImage], image.name);
            }

            return registImage;
          }),
        );
        setImages(registImages);
        setIsLoading(false);
      };
      void load();
    };

    const handleCancel = (imageIndex: number) => {
      const newImages = images.concat();
      newImages.splice(imageIndex, 1);
      if (!newImages.length) {
        setErrorMessages((state) => [...state, '画像を指定してください']);
      }
      setImages(newImages);
    };

    return (
      <FormControl isInvalid={!!errorMessages.length}>
        <FormLabel fontWeight="bold" mb={1} display="flex" alignItems="center">
          <Text>{labelName}</Text>
          {optionalLabel && (
            <Text fontSize="xs" ml={1} p="2px" bgColor="gray.100">
              任意
            </Text>
          )}
        </FormLabel>
        <Stack>
          <Box>
            <BaseInput
              name={name}
              ref={mergeRef}
              onChange={handleImages}
              type="file"
              display="none"
              accept="image/*"
              multiple
            />
            <BaseButton
              variant="outline"
              onClick={() => inputRef.current?.click()}
              isLoading={isLoading}
              disabled={isLoading}
            >
              画像を選択
            </BaseButton>
            <Text fontSize="sm">3MBより大きい画像は圧縮されます</Text>
            <FormErrorMessage as="ul" listStyleType="none" display="block">
              {!!errorMessages.length &&
                errorMessages.map((errorMessage, index) => (
                  // eslint-disable-next-line react/no-array-index-key
                  <Text as="li" key={index}>
                    {errorMessage}
                  </Text>
                ))}
            </FormErrorMessage>
          </Box>
          <Flex flexWrap="wrap" gap={1}>
            {!!images.length &&
              images.map((image, index) => (
                <Box key={image.name} position="relative">
                  <Box
                    border="1px"
                    borderColor="gray.400"
                    backgroundColor="gray.100"
                    width={100}
                    height={100}
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Image
                      src={URL.createObjectURL(image)}
                      maxW="100%"
                      maxH="100%"
                    />
                  </Box>
                  <IconButton
                    icon={<CloseIcon />}
                    aria-label="image cancel"
                    rounded="full"
                    opacity="0.5"
                    _hover={{ opacity: 0.9 }}
                    backgroundColor="white"
                    onClick={() => handleCancel(index)}
                    position="absolute"
                    right="1px"
                    top="1px"
                  />
                </Box>
              ))}
          </Flex>
        </Stack>
      </FormControl>
    );
  },
);
ImagesUpload.displayName = 'ImagesUpload';
