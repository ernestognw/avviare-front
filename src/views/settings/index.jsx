import React, { Suspense, lazy } from 'react';
import { Redirect, Switch, Route, useParams } from 'react-router-dom';
import TopBarProgress from 'react-topbar-progress-indicator';

const SettingsLayout = lazy(() =>
  import(/* webpackChunkName: "SettingsLayout" */ '@layouts/settings')
);
const ProfileSettings = lazy(() => import(/* webpackChunkName: "ProfileSettings" */ './profile'));

const Main = () => {
  const { username } = useParams();

  return (
    <Suspense fallback={<TopBarProgress />}>
      <SettingsLayout>
        <Switch>
          <Route exact path="/@:username" component={ProfileSettings} />
          <Redirect to={`/@${username}`} />
        </Switch>
      </SettingsLayout>
    </Suspense>
  );
};

export default Main;
