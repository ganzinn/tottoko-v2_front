import { FormErrorMessage, Text } from '@chakra-ui/react';
import { memo, VFC } from 'react';

export type ErrorMessage = {
  type: string;
  message: string | string[];
};

type Props = {
  errorMessages?: ErrorMessage[];
};

export const FormErrorMessageList: VFC<Props> = memo(({ errorMessages }) => (
  <FormErrorMessage as="ul" listStyleType="none" display="inline-block">
    {errorMessages?.length &&
      errorMessages?.map((errorMessage) =>
        !Array.isArray(errorMessage.message) ? (
          <Text as="li" key={errorMessage.type}>
            {errorMessage.message}
          </Text>
        ) : (
          errorMessage.message.map((msg) => (
            <Text as="li" key={msg}>
              {msg}
            </Text>
          ))
        ),
      )}
  </FormErrorMessage>
));
