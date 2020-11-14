import React, { Suspense, lazy } from 'react';
import { Redirect, Switch, Route } from 'react-router-dom';
import TopBarProgress from 'react-topbar-progress-indicator';
import { DevelopmentProvider, useDevelopment } from '@providers/development';
import DevelopmentLayout from '@layouts/development';

const Dashboard = lazy(() => import(/* webpackChunkName: "Dashboard" */ './dashboard'));
const Documents = lazy(() => import(/* webpackChunkName: "Documents" */ './documents'));
const Settings = lazy(() => import(/* webpackChunkName: "Settings" */ './settings'));

const DevelopmentWithContext = () => {
  const { developmentRole } = useDevelopment();

  return (
    <DevelopmentLayout>
      <Suspense fallback={<TopBarProgress />}>
        <Switch>
          <Route exact path="/development/:developmentId" component={Dashboard} />
          <Route path="/development/:developmentId/documents" component={Documents} />
          {developmentRole?.admin && (
            <Route path="/development/:developmentId/settings" component={Settings} />
          )}
          <Redirect to="/" />
        </Switch>
      </Suspense>
    </DevelopmentLayout>
  );
};

/**
 * These guys are splitted so the useDevelopment hook can be used
 * on the previous component
 */
const Development = () => (
  <DevelopmentProvider>
    <DevelopmentWithContext />
  </DevelopmentProvider>
);

export default Development;
