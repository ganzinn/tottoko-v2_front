import { Children, isValidElement, useMemo } from 'react';
import { SimpleGrid, SimpleGridProps } from '@chakra-ui/react';

export const WorkGrid = ({ children, ...rest }: SimpleGridProps) => {
  const columns = useMemo(() => {
    const count = Children.toArray(children).filter(isValidElement).length;

    return {
      base: Math.min(2, count),
      sm: 2,
      md: 3,
      lg: count <= 3 ? 3 : 4,
      // xl: count <= 3 ? 3 : Math.min(5, count),
    };
  }, [children]);

  return (
    <SimpleGrid
      columns={columns}
      columnGap={{ base: '2', md: '4' }}
      rowGap={{ base: '6', md: '8' }}
      {...rest}
    >
      {children}
    </SimpleGrid>
  );
};
