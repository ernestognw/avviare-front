import React, { Suspense, lazy } from 'react';
import { Redirect, Switch, Route, useParams } from 'react-router-dom';
import TopBarProgress from 'react-topbar-progress-indicator';
import { ProfileProvider } from '@providers/profile';

const ProfileLayout = lazy(() =>
  import(/* webpackChunkName: "ProfileLayout" */ '@layouts/profile')
);
const ProfileDevelopments = lazy(() =>
  import(/* webpackChunkName: "ProfileDevelopments" */ './developments')
);

const Profile = () => {
  const { username } = useParams();

  return (
    <ProfileProvider>
      <Suspense fallback={<TopBarProgress />}>
        <ProfileLayout>
          <Switch>
            <Route exact path="/@:username" component={ProfileDevelopments} />
            <Redirect to={`/@${username}`} />
          </Switch>
        </ProfileLayout>
      </Suspense>
    </ProfileProvider>
  );
};

export default Profile;
