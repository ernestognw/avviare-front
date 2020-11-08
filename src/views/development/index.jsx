import React, { Suspense, lazy } from 'react';
import { Redirect, Switch, Route } from 'react-router-dom';
import TopBarProgress from 'react-topbar-progress-indicator';
import { useUser } from '@providers/user';
import { DevelopmentProvider, useDevelopment } from '@providers/development';
import DevelopmentLayout from '@layouts/development';

const Dashboard = lazy(() => import(/* webpackChunkName: "Dashboard" */ './dashboard'));
const Documents = lazy(() => import(/* webpackChunkName: "Documents" */ './documents'));
const Settings = lazy(() => import(/* webpackChunkName: "Settings" */ './settings'));

const DevelopmentWithContext = () => {
  const { developmentRole } = useDevelopment();
  const { overallRole } = useUser();

  const role = overallRole.admin ? { admin: true } : { ...developmentRole };

  return (
    <DevelopmentLayout>
      <Suspense fallback={<TopBarProgress />}>
        <Switch>
          <Route exact path="/development/:developmentId" component={Dashboard} />
          <Route path="/development/:developmentId/documents" component={Documents} />
          {role.admin && <Route path="/development/:developmentId/settings" component={Settings} />}
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
