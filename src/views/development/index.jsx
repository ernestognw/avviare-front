import { Suspense, lazy } from 'react';
import { Redirect, Switch, Route } from 'react-router-dom';
import TopBarProgress from 'react-topbar-progress-indicator';
import { DevelopmentProvider, useDevelopment } from '@providers/development';
import DevelopmentLayout from '@layouts/development';

const Dashboard = lazy(() => import(/* webpackChunkName: "Dashboard" */ './dashboard'));
const Document = lazy(() => import(/* webpackChunkName: "Document" */ './document'));
const Documents = lazy(() => import(/* webpackChunkName: "Documents" */ './documents'));
const Prototypes = lazy(() => import(/* webpackChunkName: "Prototypes" */ './prototypes'));
const Allotments = lazy(() => import(/* webpackChunkName: "Allotments" */ './allotments'));
const Settings = lazy(() => import(/* webpackChunkName: "Settings" */ './settings'));

const DevelopmentWithContext = () => {
  const { developmentRole } = useDevelopment();

  return (
    <DevelopmentLayout>
      <Suspense fallback={<TopBarProgress />}>
        <Switch>
          <Route exact path="/development/:developmentId" component={Dashboard} />
          <Route path="/development/:developmentId/documents/:documentId" component={Document} />
          <Route path="/development/:developmentId/documents" component={Documents} />
          <Route path="/development/:developmentId/prototypes" component={Prototypes} />
          <Route path="/development/:developmentId/allotments" component={Allotments} />
          {developmentRole?.manager && (
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
