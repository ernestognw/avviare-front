import React, { Suspense, lazy } from 'react';
import { Redirect, Switch, Route } from 'react-router-dom';
import TopBarProgress from 'react-topbar-progress-indicator';
import { DevelopmentProvider } from '@providers/development';

const DevelopmentLayout = lazy(() =>
  import(/* webpackChunkName: "DevelopmentLayout" */ '@layouts/development')
);
const Dashboard = lazy(() => import(/* webpackChunkName: "Dashboard" */ './dashboard'));
const Documents = lazy(() => import(/* webpackChunkName: "Documents" */ './documents'));
const Settings = lazy(() => import(/* webpackChunkName: "Settings" */ './settings'));

const Development = () => {
  return (
    <DevelopmentProvider>
      <Suspense fallback={<TopBarProgress />}>
        <DevelopmentLayout>
          <Switch>
            <Route exact path="/development/:developmentId" component={Dashboard} />
            <Route path="/development/:developmentId/documents" component={Documents} />
            <Route path="/development/:developmentId/settings" component={Settings} />
            <Redirect to="/" />
          </Switch>
        </DevelopmentLayout>
      </Suspense>
    </DevelopmentProvider>
  );
};

export default Development;
