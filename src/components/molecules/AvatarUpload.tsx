import { useRef, useState } from 'react';
import {
  Avatar,
  Box,
  Checkbox,
  FormControl,
  FormLabel,
  forwardRef,
  Stack,
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
  regdAvatarUrl?: string;
  regdAvatarDelFlg?: boolean;
  onCheckBoxChange?: React.ChangeEventHandler<HTMLInputElement>;
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
      regdAvatarUrl,
      regdAvatarDelFlg = false,
      onCheckBoxChange,
    },
    ref,
  ) => {
    const [avatar, setAvatar] = useState('');
    const inputRef = useRef<HTMLInputElement>();
    const mergeRef = useMergeRefs(inputRef, ref);

    const afterValidateOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        // アバターに画像を設定
        // ※バリデーションエラーとなったファイルも設定されるが、表示されない
        setAvatar(URL.createObjectURL(e.target.files[0]));
      } else {
        setAvatar('');
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
        <Box display="flex" alignItems="top">
          <Avatar
            size="2xl"
            src={
              isInvalid ? '' : avatar || (regdAvatarDelFlg ? '' : regdAvatarUrl)
            }
          />

          <Box ml={4}>
            <BaseInput
              ref={mergeRef}
              {...{ name, onChange, onBlur }}
              afterValidateOnChange={afterValidateOnChange}
              type="file"
              display="none"
              accept="image/*"
            />
            <Stack spacing={4}>
              <Box>
                <BaseButton
                  variant="outline"
                  onClick={() => inputRef.current?.click()}
                >
                  画像を選択
                </BaseButton>
                <EnhancedFormErrorMessageArea errorTypes={errorTypes} />
              </Box>
              {regdAvatarUrl && (
                <Checkbox onChange={onCheckBoxChange} isInvalid={false}>
                  <Text fontWeight="bold">登録画像削除</Text>
                </Checkbox>
              )}
            </Stack>
          </Box>
        </Box>
      </FormControl>
    );
  },
);
