import { FormControl, FormLabel, forwardRef, Text } from '@chakra-ui/react';
import { MultipleFieldErrors } from 'react-hook-form';

import { BaseSelect, BaseSelectProps } from 'components/atoms/BaseSelect';
import { EnhancedFormErrorMessageArea } from 'containers/atoms/FormErrorMessageArea';

export type CmnSelectProps = BaseSelectProps & {
  id?: string;
  labelName?: string;
  isRequired?: boolean;
  optionalLabel?: boolean;
  isInvalid?: boolean;
  errorTypes?: MultipleFieldErrors;
};

export const CmnSelect = forwardRef<CmnSelectProps, 'select'>(
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
      <BaseSelect ref={ref} {...rest} />
      <EnhancedFormErrorMessageArea errorTypes={errorTypes} />
    </FormControl>
  ),
);

CmnSelect.displayName = 'CmnSelect';
