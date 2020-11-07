import React, { Suspense, lazy } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import TopBarProgress from 'react-topbar-progress-indicator';

const AuthLayout = lazy(() => import(/* webpackChunkName: "AuthLayout" */ '@layouts/auth'));
const Login = lazy(() => import(/* webpackChunkName: "Login" */ './login'));
const Recover = lazy(() => import(/* webpackChunkName: "Recover" */ './recover'));
const Reset = lazy(() => import(/* webpackChunkName: "Reset" */ './reset'));

const Auth = () => (
  <Suspense fallback={<TopBarProgress />}>
    <AuthLayout>
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/recover" component={Recover} />
        <Route path="/Reset" component={Reset} />
        <Redirect to="/login" />
      </Switch>
    </AuthLayout>
  </Suspense>
);

export default Auth;
