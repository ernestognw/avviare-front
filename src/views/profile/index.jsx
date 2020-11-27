import { Suspense, lazy } from 'react';
import { Redirect, Switch, Route, useParams } from 'react-router-dom';
import TopBarProgress from 'react-topbar-progress-indicator';
import { ProfileProvider } from '@providers/profile';
import ProfileLayout from '@layouts/profile';

const ProfileDevelopments = lazy(() =>
  import(/* webpackChunkName: "ProfileDevelopments" */ './developments')
);

const Profile = () => {
  const { username } = useParams();

  return (
    <ProfileProvider>
      <ProfileLayout>
        <Suspense fallback={<TopBarProgress />}>
          <Switch>
            <Route exact path="/@:username" component={ProfileDevelopments} />
            <Redirect to={`/@${username}`} />
          </Switch>
        </Suspense>
      </ProfileLayout>
    </ProfileProvider>
  );
};

export default Profile;
