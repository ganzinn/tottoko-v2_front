import { VFC } from 'react';
import { Outlet } from 'react-router-dom';

import { EnhancedHeader } from 'containers/organisms/Header';

export const HeaderLayout: VFC = () => (
  <>
    <EnhancedHeader />
    <Outlet />
  </>
);
