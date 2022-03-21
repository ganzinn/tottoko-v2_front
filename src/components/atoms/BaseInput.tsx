import { Input, InputProps, forwardRef } from '@chakra-ui/react';

export type BaseInputProps = InputProps & {
  beforeValidateOnChange?: React.ChangeEventHandler<HTMLInputElement>;
  afterValidateOnChange?: React.ChangeEventHandler<HTMLInputElement>;
  beforeValidateBlur?: React.FocusEventHandler<HTMLInputElement>;
  afterValidateBlur?: React.FocusEventHandler<HTMLInputElement>;
};

export const BaseInput = forwardRef<BaseInputProps, 'input'>(
  (
    {
      // -------- react-hook-form props --------
      name,
      onChange = () => undefined,
      onBlur = () => undefined,
      // ---------------------------------------
      beforeValidateOnChange = () => undefined,
      afterValidateOnChange = () => undefined,
      beforeValidateBlur = () => undefined,
      afterValidateBlur = () => undefined,
      ...rest
    },
    ref, // react-hook-form props
  ) => (
    <Input
      ref={ref}
      name={name}
      onChange={(e) => {
        beforeValidateOnChange(e);
        onChange(e);
        afterValidateOnChange(e);
      }}
      onBlur={(e) => {
        beforeValidateBlur(e);
        onBlur(e);
        afterValidateBlur(e);
      }}
      height={12}
      color="gray.800"
      {...rest}
    />
  ),
);

BaseInput.displayName = 'BaseInput';
