import React from 'react';
import { Redirect, Switch, Route } from 'react-router-dom';
import TopBarProgress from 'react-topbar-progress-indicator';
import Loadable from 'react-loadable';
import { DevelopmentProvider } from '@providers/development';
import DevelopmentLayout from '@layouts/development';

/* webpackChunkName: "Dashboard" */
const Dashboard = Loadable({
  loader: () => import('./dashboard'),
  loading: TopBarProgress,
});

/* webpackChunkName: "Documents" */
const Documents = Loadable({
  loader: () => import('./documents'),
  loading: TopBarProgress,
});

/* webpackChunkName: "Settings" */
const Settings = Loadable({
  loader: () => import('./settings'),
  loading: TopBarProgress,
});

const Development = () => {
  return (
    <DevelopmentProvider>
      <DevelopmentLayout>
        <Switch>
          <Route exact path="/development/:developmentId" component={Dashboard} />
          <Route path="/development/:developmentId/documents" component={Documents} />
          <Route path="/development/:developmentId/settings" component={Settings} />
          <Redirect to="/" />
        </Switch>
      </DevelopmentLayout>
    </DevelopmentProvider>
  );
};

export default Development;
