import { FormControl, FormLabel, forwardRef, Text } from '@chakra-ui/react';
import { MultipleFieldErrors } from 'react-hook-form';

import { BaseInput, BaseInputProps } from 'components/atoms/BaseInput';
import { EnhancedFormErrorMessageArea } from 'containers/atoms/FormErrorMessageArea';

export type CmnInputProps = BaseInputProps & {
  id?: string;
  labelName?: string;
  isRequired?: boolean;
  optionalLabel?: boolean;
  isInvalid?: boolean;
  errorTypes?: MultipleFieldErrors;
};

export const CmnInput = forwardRef<CmnInputProps, 'input'>(
  (
    {
      id,
      labelName,
      type = 'text',
      isRequired,
      optionalLabel,
      isInvalid,
      errorTypes,
      ...rest
    },
    ref,
  ) => (
    <FormControl id={id} isRequired={isRequired} isInvalid={isInvalid}>
      <FormLabel fontWeight="bold" mb={1} display="flex" alignItems="center">
        <Text>{labelName}</Text>
        {optionalLabel && (
          <Text fontSize="xs" ml={1} p="2px" bgColor="gray.100">
            任意
          </Text>
        )}
      </FormLabel>
      <BaseInput ref={ref} type={type} {...rest} />
      <EnhancedFormErrorMessageArea errorTypes={errorTypes} />
    </FormControl>
  ),
);

CmnInput.displayName = 'CmnInput';
