import { Suspense, lazy } from 'react';
import { Redirect, Switch, Route } from 'react-router-dom';
import TopBarProgress from 'react-topbar-progress-indicator';
import SettingsLayout from '@layouts/settings';

const ProfileSettings = lazy(() => import(/* webpackChunkName: "ProfileSettings" */ './profile'));
const SecuritySettings = lazy(() =>
  import(/* webpackChunkName: "SecuritySettings" */ './security')
);

const Settings = () => {
  return (
    <SettingsLayout>
      <Suspense fallback={<TopBarProgress />}>
        <Switch>
          <Route exact path="/settings" component={ProfileSettings} />
          <Route path="/settings/security" component={SecuritySettings} />
          <Redirect to="/settings" />
        </Switch>
      </Suspense>
    </SettingsLayout>
  );
};

export default Settings;
