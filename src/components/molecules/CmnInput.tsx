import { FormControl, FormLabel, forwardRef } from '@chakra-ui/react';
import { MultipleFieldErrors } from 'react-hook-form';

import { BaseInput, BaseInputProps } from 'components/atoms/BaseInput';
import { EnhancedFormErrorMessageList } from 'containers/atoms/FormErrorMessageList';

export type CmnInputProps = BaseInputProps & {
  id?: string;
  labelName?: string;
  isRequired?: boolean;
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
      isInvalid,
      errorTypes,
      ...rest
    },
    ref,
  ) => (
    <FormControl id={id} isRequired={isRequired} isInvalid={isInvalid}>
      <FormLabel>{labelName}</FormLabel>
      <BaseInput ref={ref} type={type} {...rest} />
      <EnhancedFormErrorMessageList errorTypes={errorTypes} />
    </FormControl>
  ),
);

CmnInput.displayName = 'CmnInput';
