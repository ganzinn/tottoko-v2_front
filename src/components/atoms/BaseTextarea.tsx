import { Textarea, TextareaProps, forwardRef } from '@chakra-ui/react';

export type BaseTextareaProps = TextareaProps & {
  beforeValidateOnChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
  afterValidateOnChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
  beforeValidateBlur?: React.FocusEventHandler<HTMLTextAreaElement>;
  afterValidateBlur?: React.FocusEventHandler<HTMLTextAreaElement>;
};

export const BaseTextarea = forwardRef<BaseTextareaProps, 'textarea'>(
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
    <Textarea
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

BaseTextarea.displayName = 'BaseTextarea';
