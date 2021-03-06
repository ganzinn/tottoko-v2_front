import { VFC } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { Layout } from 'components/templates/Layout';
import { NotFound } from 'components/pages/NotFound';
import { EnhancedAbout } from 'containers/pages/About';
import { EnhancedSignUp } from 'containers/pages/SignUp';
import { EnhancedPasswordResetEntry } from 'containers/pages/PasswordResetEntry';
import { EnhancedLogin } from 'containers/pages/Login';
import { EnhancedMyProfile } from 'containers/pages/MyProfile';
import { EnhancedMyprofileEdit } from 'containers/pages/MyprofileEdit';
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
import { RootRedirect } from 'router/RootRedirect';
import { RequireUserAuth } from 'router/RequireUserAuth';

export const Router: VFC = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<RootRedirect />} />
        <Route path="about">
          <Route index element={<EnhancedAbout />} />
        </Route>
        <Route path="users">
          <Route index element={<NotFound />} />
          <Route path="sign_up" element={<EnhancedSignUp />} />
          <Route path="password_reset_entry" element={<EnhancedPasswordResetEntry />} />
          <Route path="sessions">
            <Route index element={<NotFound />} />
            <Route path="login" element={<EnhancedLogin />} />
          </Route>
          <Route path="me">
            <Route index element={<RequireUserAuth><EnhancedMyProfile /></RequireUserAuth>} />
            <Route path="activate" element={<EnhancedActivate />} />
            <Route path="password_reset" element={<EnhancedPasswordReset />} />
            <Route path="email_change_entry" element={<RequireUserAuth><EnhancedEmailChangeEntry /></RequireUserAuth>} />
            <Route path="email_change" element={<EnhancedEmailChange />} />
            <Route path="edit" element={<RequireUserAuth><EnhancedMyprofileEdit /></RequireUserAuth>} />
            <Route path="creators">
              <Route index element={<RequireUserAuth><EnhancedCreators /></RequireUserAuth>} />
              <Route path="entry" element={<RequireUserAuth><EnhancedCreatorEntry /></RequireUserAuth>} />
            </Route>
            <Route path="works">
              <Route index element={<RequireUserAuth><EnhancedWorks /></RequireUserAuth>} />
              <Route path="entry" element={<RequireUserAuth><EnhancedWorkEntry /></RequireUserAuth>} />
            </Route>
          </Route>
        </Route>
        <Route path="creators">
          <Route index element={<NotFound />} />
          <Route path=":id">
            <Route index element={<RequireUserAuth><EnhancedCreator /></RequireUserAuth>} />
            <Route path="edit" element={<RequireUserAuth><EnhancedCreatorEdit /></RequireUserAuth>} />
            <Route path="families">
              <Route index element={<NotFound />} />
              <Route path="entry" element={<RequireUserAuth><EnhancedFamilyEntry /></RequireUserAuth>} />
            </Route>
          </Route>
        </Route>
        <Route path="works">
          <Route index element={<NotFound />} />
          <Route path=":id">
            <Route index element={<EnhancedWork />} />
            <Route path="edit" element={<RequireUserAuth><EnhancedWorkEdit /></RequireUserAuth>} />
          </Route>
        </Route>
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  </BrowserRouter>
);
