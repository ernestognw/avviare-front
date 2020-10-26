import React from 'react';
import { Button } from 'antd';
import TopBarProgress from 'react-topbar-progress-indicator';
import { useUser } from '@providers/user';
import AuthLayout from '@layouts/auth';
import Auth from '@views/auth';
import theme from '@config/theme';
import { env } from '@config/environment';

TopBarProgress.config({
  barColors: {
    0: theme.colors.primary,
    '1.0': theme.colors.primary,
  },
  shadowBlur: 2,
  barThickness: 2,
  shadowColor: theme.colors.secondary,
});

const App = () => {
  const { token } = useUser();

  if (!token) {
    return (
      <AuthLayout>
        <Auth />
      </AuthLayout>
    );
  }

  const handleLogout = () => {
    if (env.development) {
      document.cookie = 'token= ; expires = Thu, 01 Jan 1970 00:00:00 GMT;path=/';
    } else {
      document.cookie =
        'token= ; domain=.avviare.site ; expires = Thu, 01 Jan 1970 00:00:00 GMT;path=/';
    }
    window.location.reload();
  };

  return (
    <>
      <Button onClick={handleLogout} type="primary">
        Logout
      </Button>
    </>
  );
};

export default App;
