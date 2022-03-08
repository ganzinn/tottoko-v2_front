import { Input, InputProps, forwardRef } from '@chakra-ui/react';

export type BaseInputProps = InputProps & {
  handleChange?: React.ChangeEventHandler<HTMLInputElement>;
  handleBlur?: React.FocusEventHandler<HTMLInputElement>;
};

export const BaseInput = forwardRef<BaseInputProps, 'input'>(
  (
    {
      // -------- react-hook-form props --------
      name,
      onChange = () => undefined,
      onBlur = () => undefined,
      // ---------------------------------------
      handleChange = () => undefined,
      handleBlur = () => undefined,
      ...rest
    },
    ref, // react-hook-form props
  ) => (
    <Input
      ref={ref}
      name={name}
      onChange={(e) => {
        handleChange(e);
        onChange(e);
      }}
      onBlur={(e) => {
        handleBlur(e);
        onBlur(e);
      }}
      height={12}
      color="gray.800"
      {...rest}
    />
  ),
);

BaseInput.displayName = 'BaseInput';
