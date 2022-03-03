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
import { EnhancedFormErrorMessageList } from 'containers/atoms/FormErrorMessageList';
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
        <FormLabel>{labelName}</FormLabel>
        <InputGroup>
          <BaseInput
            ref={mergeRef}
            {...rest}
            type={isOpen ? 'text' : 'password'}
            autoComplete="current-password"
          />
          <InputRightElement>
            <IconButton
              bg="transparent !important"
              variant="ghost"
              aria-label={isOpen ? 'Mask password' : 'Reveal password'}
              icon={isOpen ? <HiEyeOff /> : <HiEye />}
              onClick={onClickReveal}
            />
          </InputRightElement>
        </InputGroup>
        <EnhancedFormErrorMessageList errorTypes={errorTypes} />
      </FormControl>
    );
  },
);

PasswordInput.displayName = 'PasswordInput';
