import { Suspense, lazy } from 'react';
import { Redirect, Switch, Route, useParams } from 'react-router-dom';
import TopBarProgress from 'react-topbar-progress-indicator';
import DevelopmentSettingsLayout from '@layouts/development/settings';

const DevelopmentGeneralSettings = lazy(() =>
  import(/* webpackChunkName: "DevelopmentGeneralSettings" */ './general')
);
const DevelopmentMembersSettings = lazy(() =>
  import(/* webpackChunkName: "DevelopmentMembersSettings" */ './members')
);
const DevelopmentProvidersSettings = lazy(() =>
  import(/* webpackChunkName: "DevelopmentProvidersSettings" */ './providers')
);

const DevelopmentSettings = () => {
  const { developmentId } = useParams();

  return (
    <DevelopmentSettingsLayout>
      <Suspense fallback={<TopBarProgress />}>
        <Switch>
          <Route
            exact
            path="/development/:developmentId/settings"
            component={DevelopmentGeneralSettings}
          />
          <Route
            path="/development/:developmentId/settings/members"
            component={DevelopmentMembersSettings}
          />
          <Route
            path="/development/:developmentId/settings/providers"
            component={DevelopmentProvidersSettings}
          />
          <Redirect to={`/development/${developmentId}/settings`} />
        </Switch>
      </Suspense>
    </DevelopmentSettingsLayout>
  );
};

export default DevelopmentSettings;
