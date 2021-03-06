import { Suspense, lazy } from 'react';
import { Redirect, Switch, Route } from 'react-router-dom';
import TopBarProgress from 'react-topbar-progress-indicator';
import { DevelopmentProvider, useDevelopment } from '@providers/development';
import DevelopmentLayout from '@layouts/development';

const Dashboard = lazy(() => import(/* webpackChunkName: "Dashboard" */ './dashboard'));
const Document = lazy(() => import(/* webpackChunkName: "Document" */ './document'));
const Documents = lazy(() => import(/* webpackChunkName: "Documents" */ './documents'));
const Prototype = lazy(() => import(/* webpackChunkName: "Prototype" */ './prototype'));
const Prototypes = lazy(() => import(/* webpackChunkName: "Prototypes" */ './prototypes'));
const Allotment = lazy(() => import(/* webpackChunkName: "Allotment" */ './allotment'));
const Allotments = lazy(() => import(/* webpackChunkName: "Allotments" */ './allotments'));
const Advancement = lazy(() => import(/* webpackChunkName: "Advancement" */ './advancement'));
const Advancements = lazy(() => import(/* webpackChunkName: "Advancements" */ './advancements'));
const Workload = lazy(() => import(/* webpackChunkName: "Workload" */ './workloads'));
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
          <Route
            path="/development/:developmentId/prototypes/:allotmentPrototypeId"
            component={Prototype}
          />
          <Route path="/development/:developmentId/prototypes" component={Prototypes} />
          <Route path="/development/:developmentId/allotments/:allotmentId" component={Allotment} />
          <Route path="/development/:developmentId/allotments" component={Allotments} />
          <Route
            path="/development/:developmentId/advancements/:advancementId"
            component={Advancement}
          />
          <Route path="/development/:developmentId/advancements" component={Advancements} />
          <Route path="/development/:developmentId/workloads" component={Workload} />
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
