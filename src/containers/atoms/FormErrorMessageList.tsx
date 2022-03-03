import { memo, VFC } from 'react';
import { MultipleFieldErrors } from 'react-hook-form';

import {
  FormErrorMessageList,
  ErrorMessage,
} from 'components/atoms/FormErrorMessageList';

type Props = {
  errorTypes?: MultipleFieldErrors;
};

export const EnhancedFormErrorMessageList: VFC<Props> = memo(
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

    return <FormErrorMessageList errorMessages={errorMessages} />;
  },
);
