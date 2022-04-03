import { FormControl, FormLabel, forwardRef, Text } from '@chakra-ui/react';
import { MultipleFieldErrors } from 'react-hook-form';

import { BaseTextarea, BaseTextareaProps } from 'components/atoms/BaseTextarea';
import { EnhancedFormErrorMessageArea } from 'containers/atoms/FormErrorMessageArea';

export type CmnTextareaProps = BaseTextareaProps & {
  id?: string;
  labelName?: string;
  isRequired?: boolean;
  optionalLabel?: boolean;
  isInvalid?: boolean;
  errorTypes?: MultipleFieldErrors;
};

export const CmnTextarea = forwardRef<CmnTextareaProps, 'input'>(
  (
    {
      id,
      labelName,
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
      <BaseTextarea ref={ref} {...rest} />
      <EnhancedFormErrorMessageArea errorTypes={errorTypes} />
    </FormControl>
  ),
);

CmnTextarea.displayName = 'CmnTextarea';
