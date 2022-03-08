import { memo, VFC } from 'react';
import { MultipleFieldErrors } from 'react-hook-form';

import {
  FormErrorMessageArea,
  ErrorMessage,
} from 'components/atoms/FormErrorMessageArea';

type Props = {
  errorTypes?: MultipleFieldErrors;
};

export const EnhancedFormErrorMessageArea: VFC<Props> = memo(
  ({ errorTypes }) => {
    const errorMessages: ErrorMessage[] = [];
    if (errorTypes) {
      Object.keys(errorTypes).map((type) =>
        errorMessages.push({
          type,
          message: errorTypes[type] as string | string[],
        }),
      );
    }

    return <FormErrorMessageArea errorMessages={errorMessages} />;
  },
);
