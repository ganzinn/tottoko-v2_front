import { Select, SelectProps, forwardRef } from '@chakra-ui/react';

export type BaseSelectProps = SelectProps & {
  // 汎用性を兼ねてidをstringで定義（apiがnumberの時はstringに変換）
  options?: { id: string; value: string }[];
  placeholder?: string;
  handleChange?: React.ChangeEventHandler<HTMLSelectElement>;
  handleBlur?: React.FocusEventHandler<HTMLSelectElement>;
};

export const BaseSelect = forwardRef<BaseSelectProps, 'select'>(
  (
    {
      options,
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
    <Select
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
      placeholder="選択してください"
      {...rest}
    >
      {options &&
        options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.value}
          </option>
        ))}
    </Select>
  ),
);

BaseSelect.displayName = 'BaseSelect';
