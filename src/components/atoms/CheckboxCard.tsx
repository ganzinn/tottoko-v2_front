import { VFC } from 'react';
import {
  Box,
  BoxProps,
  Checkbox,
  Flex,
  Input,
  useCheckbox,
  UseCheckboxProps,
  useId,
  useStyleConfig,
} from '@chakra-ui/react';

type Props = BoxProps & {
  checkboxProps?: UseCheckboxProps;
};

export const CheckboxCard: VFC<Props> = ({
  checkboxProps,
  children,
  ...rest
}) => {
  const { getInputProps, getCheckboxProps, getLabelProps, state } =
    useCheckbox(checkboxProps);
  const id = useId(undefined, 'checkbox-card');
  const styles = useStyleConfig('CheckCard');

  return (
    <Box
      as="label"
      cursor="pointer"
      {...getLabelProps()}
      sx={{
        '.focus-visible + [data-focus]': {
          boxShadow: 'outline',
          zIndex: 1,
        },
      }}
    >
      <Input {...getInputProps()} aria-labelledby={id} />
      <Box
        sx={styles}
        {...getCheckboxProps()}
        _focus={{ boxShadow: 'outline', outline: '0' }}
        {...rest}
      >
        <Flex h="100%" gap={1}>
          <Box>{children}</Box>
          <Checkbox
            pointerEvents="none"
            isFocusable={false}
            isChecked={state.isChecked}
            isIndeterminate={state.isIndeterminate}
            alignSelf="start"
            tabIndex={-1}
          />
        </Flex>
      </Box>
    </Box>
  );
};
