import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import TopBarProgress from 'react-topbar-progress-indicator';
import Loadable from 'react-loadable';

/* webpackChunkName: "Login" */
const Login = Loadable({
  loader: () => import('./routes/login'),
  loading: TopBarProgress,
});

const Auth = () => (
  <Switch>
    <Route path="/login" component={Login} />
    <Redirect to="/login" />
  </Switch>
);

export default Auth;
