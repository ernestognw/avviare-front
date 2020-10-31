import React from 'react';
import { Redirect, Switch, Route } from 'react-router-dom';
import TopBarProgress from 'react-topbar-progress-indicator';
import Loadable from 'react-loadable';

/* webpackChunkName: "Dashboard" */
const Dashboard = Loadable({
  loader: () => import('./dashboard'),
  loading: TopBarProgress,
});

const Development = () => {
  return (
    <Switch>
      <Route path="/development/:developmentId" component={Dashboard} />
      <Redirect to="/" />
    </Switch>
  );
};

export default Development;
