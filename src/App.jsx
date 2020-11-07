import React from 'react';
import { useUser } from '@providers/user';
import { Redirect, Switch, Route } from 'react-router-dom';
import MainLayout from '@layouts/main';
import Auth from '@views/auth';
import Development from '@views/development';
import Profile from '@views/profile';
import Settings from '@views/settings';
import Home from '@views/home';

const App = () => {
  const { token } = useUser();

  if (!token) return <Auth />;

  return (
    <MainLayout>
      <Switch>
        <Route path="/settings" component={Settings} />
        <Route path="/@:username" component={Profile} />
        <Route path="/development/:developmentId" component={Development} />
        <Route path="/" component={Home} />
        <Redirect to="/" />
      </Switch>
    </MainLayout>
  );
};

export default App;
