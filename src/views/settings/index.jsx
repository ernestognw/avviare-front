import React, { Suspense, lazy } from 'react';
import { Redirect, Switch, Route } from 'react-router-dom';
import TopBarProgress from 'react-topbar-progress-indicator';

const SettingsLayout = lazy(() =>
  import(/* webpackChunkName: "SettingsLayout" */ '@layouts/settings')
);
const ProfileSettings = lazy(() => import(/* webpackChunkName: "ProfileSettings" */ './profile'));
const SecuritySettings = lazy(() =>
  import(/* webpackChunkName: "SecuritySettings" */ './security')
);

const Settings = () => {
  return (
    <Suspense fallback={<TopBarProgress />}>
      <SettingsLayout>
        <Switch>
          <Route exact path="/settings" component={ProfileSettings} />
          <Route path="/settings/security" component={SecuritySettings} />
          <Redirect to="/settings" />
        </Switch>
      </SettingsLayout>
    </Suspense>
  );
};

export default Settings;
