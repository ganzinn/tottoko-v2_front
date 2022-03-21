import { useRef, useState } from 'react';
import {
  Avatar,
  Box,
  FormControl,
  FormLabel,
  forwardRef,
  Text,
  useMergeRefs,
} from '@chakra-ui/react';
import { MultipleFieldErrors } from 'react-hook-form';

import { BaseInput } from 'components/atoms/BaseInput';
import { EnhancedFormErrorMessageArea } from 'containers/atoms/FormErrorMessageArea';
import { BaseButton } from 'components/atoms/BaseButton';

export type AvatarUploadProps = {
  labelName?: string;
  optionalLabel?: boolean;
  name?: string | undefined;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  isInvalid?: boolean;
  errorTypes?: MultipleFieldErrors;
};

export const AvatarUpload = forwardRef<AvatarUploadProps, 'input'>(
  (
    {
      labelName = '画像',
      optionalLabel = false,
      name,
      onChange,
      onBlur,
      isInvalid,
      errorTypes,
    },
    ref,
  ) => {
    const [avatar, setAvatar] = useState<File>();
    const inputRef = useRef<HTMLInputElement>();
    const mergeRef = useMergeRefs(inputRef, ref);

    const afterValidateOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        // アバターに画像を設定
        // ※バリデーションエラーとなったファイルも設定されるが、表示されない
        setAvatar(e.target.files[0]);
      }
    };

    return (
      <FormControl isInvalid={isInvalid}>
        <FormLabel fontWeight="bold" mb={1} display="flex" alignItems="center">
          <Text>{labelName}</Text>
          {optionalLabel && (
            <Text fontSize="xs" ml={1} p="2px" bgColor="gray.100">
              任意
            </Text>
          )}
        </FormLabel>
        <Box display="flex" alignItems="center">
          {isInvalid ? (
            <Avatar size="2xl" />
          ) : (
            <Avatar
              size="2xl"
              src={avatar ? URL.createObjectURL(avatar) : undefined}
            />
          )}
          <Box ml={4}>
            <BaseInput
              ref={mergeRef}
              {...{ name, onChange, onBlur }}
              afterValidateOnChange={afterValidateOnChange}
              type="file"
              display="none"
              accept="image/*"
            />
            <BaseButton
              variant="outline"
              onClick={() => inputRef.current?.click()}
            >
              画像を選択
            </BaseButton>
            <EnhancedFormErrorMessageArea errorTypes={errorTypes} />
          </Box>
        </Box>
      </FormControl>
    );
  },
);
