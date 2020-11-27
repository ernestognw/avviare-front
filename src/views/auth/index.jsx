import { Suspense, lazy } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import TopBarProgress from 'react-topbar-progress-indicator';
import AuthLayout from '@layouts/auth';

const Login = lazy(() => import(/* webpackChunkName: "Login" */ './login'));
const Recover = lazy(() => import(/* webpackChunkName: "Recover" */ './recover'));
const Reset = lazy(() => import(/* webpackChunkName: "Reset" */ './reset'));

const Auth = () => (
  <AuthLayout>
    <Suspense fallback={<TopBarProgress />}>
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/recover" component={Recover} />
        <Route path="/Reset" component={Reset} />
        <Redirect to="/login" />
      </Switch>
    </Suspense>
  </AuthLayout>
);

export default Auth;
