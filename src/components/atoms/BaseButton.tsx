import { Button, ButtonProps, forwardRef } from '@chakra-ui/react';

export type BaseButtonProps = ButtonProps;

export const BaseButton = forwardRef<BaseButtonProps, 'button'>(
  ({ children, disabled, isLoading, ...rest }, ref) => (
    <Button
      ref={ref}
      disabled={disabled || isLoading}
      isLoading={isLoading}
      {...rest}
      colorScheme="blue"
      size="lg"
      fontSize="md"
    >
      {children}
    </Button>
  ),
);

BaseButton.displayName = 'BaseButton';
