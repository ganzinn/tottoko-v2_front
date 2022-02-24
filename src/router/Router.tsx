import { VFC } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { HeaderLayout } from 'components/templates/HeaderLayout';
import { NotFound } from 'components/pages/NotFound';
import { EnhancedAbout } from 'containers/pages/About';
import { EnhancedSignUp } from 'containers/pages/SignUp';
import { EnhancedPasswordResetEntry } from 'containers/pages/PasswordResetEntry';
import { EnhancedLogin } from 'containers/pages/Login';
import { EnhancedLogout } from 'containers/pages/Logout';
import { EnhancedMyProfile } from 'containers/pages/MyProfile';
import { EnhancedActivate } from 'containers/pages/Activate';
import { EnhancedPasswordReset } from 'containers/pages/PasswordReset';
import { EnhancedEmailChangeEntry } from 'containers/pages/EmailChangeEntry';
import { EnhancedEmailChange } from 'containers/pages/EmailChange';
import { EnhancedWorks } from 'containers/pages/Works';
import { EnhancedWorkEntry } from 'containers/pages/WorkEntry';
import { EnhancedCreators } from 'containers/pages/Creators';
import { EnhancedCreatorEntry } from 'containers/pages/CreatorEntry';
import { EnhancedWork } from 'containers/pages/Work';
import { EnhancedWorkEdit } from 'containers/pages/WorkEdit';
import { EnhancedCreator } from 'containers/pages/Creator';
import { EnhancedCreatorEdit } from 'containers/pages/CreatorEdit';
import { EnhancedFamilyEntry } from 'containers/pages/FamilyEntry';

export const Router: VFC = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<HeaderLayout />}>
        <Route index element={<EnhancedAbout />} />
        <Route path="users">
          <Route index element={<NotFound />} />
          <Route path="sign_up" element={<EnhancedSignUp />} />
          <Route path="password_reset_entry" element={<EnhancedPasswordResetEntry />} />
          <Route path="sessions">
            <Route index element={<NotFound />} />
            <Route path="login" element={<EnhancedLogin />} />
            <Route path="logout" element={<EnhancedLogout />} />
          </Route>
          <Route path="me">
            <Route index element={<EnhancedMyProfile />} />
            <Route path="activate" element={<EnhancedActivate />} />
            <Route path="password_reset" element={<EnhancedPasswordReset />} />
            <Route path="email_change_entry" element={<EnhancedEmailChangeEntry />} />
            <Route path="email_change" element={<EnhancedEmailChange />} />
            <Route path="creators">
              <Route index element={<EnhancedCreators />} />
              <Route path="entry" element={<EnhancedCreatorEntry />} />
            </Route>
            <Route path="works">
              <Route index element={<EnhancedWorks />} />
              <Route path="entry" element={<EnhancedWorkEntry />} />
            </Route>
          </Route>
        </Route>
        <Route path="creators">
          <Route index element={<NotFound />} />
          <Route path=":id">
            <Route index element={<EnhancedCreator />} />
            <Route path="edit" element={<EnhancedCreatorEdit />} />
            <Route path="families">
              <Route index element={<NotFound />} />
              <Route path="entry" element={<EnhancedFamilyEntry />} />
            </Route>
          </Route>
        </Route>
        <Route path="works">
          <Route index element={<NotFound />} />
          <Route path=":id">
            <Route index element={<EnhancedWork />} />
            <Route path="edit" element={<EnhancedWorkEdit />} />
          </Route>
        </Route>
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  </BrowserRouter>
);
