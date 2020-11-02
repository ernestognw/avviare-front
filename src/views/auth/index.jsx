import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import TopBarProgress from 'react-topbar-progress-indicator';
import Loadable from 'react-loadable';
import AuthLayout from '@layouts/auth';

/* webpackChunkName: "Login" */
const Login = Loadable({
  loader: () => import('./login'),
  loading: TopBarProgress,
});

/* webpackChunkName: "Recover" */
const Recover = Loadable({
  loader: () => import('./recover'),
  loading: TopBarProgress,
});

/* webpackChunkName: "Reset" */
const Reset = Loadable({
  loader: () => import('./reset'),
  loading: TopBarProgress,
});

const Auth = () => (
  <AuthLayout>
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/recover" component={Recover} />
      <Route path="/Reset" component={Reset} />
      <Redirect to="/login" />
    </Switch>
  </AuthLayout>
);

export default Auth;
