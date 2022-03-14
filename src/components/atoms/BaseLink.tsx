import { Link, LinkProps, forwardRef } from '@chakra-ui/react';

export type BaseLinkProps = LinkProps;

export const BaseLink = forwardRef<BaseLinkProps, 'a'>(
  ({ children, ...rest }, ref) => (
    <Link ref={ref} fontWeight="bold" color="blue.400" {...rest}>
      {children}
    </Link>
  ),
);

BaseLink.displayName = 'BaseLink';
