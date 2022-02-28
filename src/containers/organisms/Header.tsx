import { VFC } from 'react';
import { useNavigate } from 'react-router-dom';

import { Header } from 'components/organisms/Header';
import { useAppSelector } from 'store';

export const EnhancedHeader: VFC = () => {
  const userAuth = useAppSelector((state) => state.userAuth);
  const navigate = useNavigate();
  const topUrl = () => navigate('/');

  const linkItems = (() => {
    if (userAuth) {
      return [
        {
          label: `ログイン：${userAuth.loginUser.name}さん`,
          onClick: () => navigate('/users/me'),
        },
        {
          label: '作品投稿',
          onClick: () => navigate('/users/me/works/entry'),
        },
        {
          label: '家族設定',
          onClick: () => navigate('/users/me/creators'),
        },
        {
          label: 'ログアウト',
          onClick: () => navigate('/users/sessions/logout'),
        },
      ];
    }

    return [
      {
        label: '新規登録',
        onClick: () => navigate('/users/sign_up'),
      },
      {
        label: 'ログイン',
        onClick: () => navigate('/users/sessions/login'),
      },
    ];
  })();

  return <Header topUrl={topUrl} navItems={linkItems} />;
};
