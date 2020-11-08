import React, { Suspense, lazy } from 'react';
import { Redirect, Switch, Route, useParams } from 'react-router-dom';
import TopBarProgress from 'react-topbar-progress-indicator';
import DevelopmentSettingsLayout from '@layouts/development/settings';

const DevelopmentGeneralSettings = lazy(() =>
  import(/* webpackChunkName: "DevelopmentGeneralSettings" */ './general')
);
const DevelopmentMemberslSettings = lazy(() =>
  import(/* webpackChunkName: "DevelopmentMemberslSettings" */ './members')
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
            component={DevelopmentMemberslSettings}
          />
          <Redirect to={`/development/${developmentId}/settings`} />
        </Switch>
      </Suspense>
    </DevelopmentSettingsLayout>
  );
};

export default DevelopmentSettings;
