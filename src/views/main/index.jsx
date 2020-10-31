import React from 'react';
import { Redirect, Switch, Route } from 'react-router-dom';
import TopBarProgress from 'react-topbar-progress-indicator';
import Loadable from 'react-loadable';

/* webpackChunkName: "MyDevelopments" */
const MyDevelopments = Loadable({
  loader: () => import('./my-developments'),
  loading: TopBarProgress,
});

const Development = () => {
  return (
    <Switch>
      <Route path="/" component={MyDevelopments} />
      <Redirect to="/" />
    </Switch>
  );
};

export default Development;
