import { useRef } from 'react';
import {
  FormControl,
  FormLabel,
  IconButton,
  InputGroup,
  InputRightElement,
  useDisclosure,
  useMergeRefs,
  forwardRef,
} from '@chakra-ui/react';
import { HiEye, HiEyeOff } from 'react-icons/hi';

import { BaseInput } from 'components/atoms/BaseInput';
import { EnhancedFormErrorMessageArea } from 'containers/atoms/FormErrorMessageArea';
import { CmnInputProps } from 'components/molecules/CmnInput';

export type PasswordInputProps = CmnInputProps;

export const PasswordInput = forwardRef<PasswordInputProps, 'input'>(
  (
    {
      id,
      labelName = 'パスワード',
      isRequired,
      isInvalid,
      errorTypes,
      ...rest
    },
    ref,
  ) => {
    const { isOpen, onToggle } = useDisclosure();
    const inputRef = useRef<HTMLInputElement>();
    const onClickReveal = () => {
      onToggle();
      const input = inputRef.current;
      if (input) {
        input.focus({ preventScroll: true });
        // フォーカスを入力文字の最終位置に設定
        const inputLength = input.value.length;
        requestAnimationFrame(() => {
          input.setSelectionRange(inputLength, inputLength);
        });
      }
    };
    const mergeRef = useMergeRefs(inputRef, ref);

    return (
      <FormControl id={id} isRequired={isRequired} isInvalid={isInvalid}>
        <FormLabel fontWeight="bold" mb={1}>
          {labelName}
        </FormLabel>
        <InputGroup>
          <BaseInput
            ref={mergeRef}
            {...rest}
            type={isOpen ? 'text' : 'password'}
            autoComplete="current-password"
          />
          <InputRightElement height="full">
            <IconButton
              bg="transparent !important"
              variant="ghost"
              aria-label={isOpen ? 'Mask password' : 'Reveal password'}
              icon={isOpen ? <HiEyeOff size={20} /> : <HiEye size={20} />}
              onClick={onClickReveal}
            />
          </InputRightElement>
        </InputGroup>
        <EnhancedFormErrorMessageArea errorTypes={errorTypes} />
      </FormControl>
    );
  },
);

PasswordInput.displayName = 'PasswordInput';
