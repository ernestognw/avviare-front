import React from 'react';
import TopBarProgress from 'react-topbar-progress-indicator';
import { useUser } from '@providers/user';
import { Redirect, Switch, Route } from 'react-router-dom';
import AuthLayout from '@layouts/auth';
import MainLayout from '@layouts/main';
import Auth from '@views/auth';
import Development from '@views/development';
import Main from '@views/main';
import theme from '@config/theme';

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

  return (
    <MainLayout>
      <Switch>
        <Route path="/development" component={Development} />
        <Route path="/" component={Main} />
        <Redirect to="/" />
      </Switch>
    </MainLayout>
  );
};

export default App;
