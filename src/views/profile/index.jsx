import React from 'react';
import { Redirect, Switch, Route, useParams } from 'react-router-dom';
import TopBarProgress from 'react-topbar-progress-indicator';
import Loadable from 'react-loadable';
import { ProfileProvider } from '@providers/profile';
import ProfileLayout from '@layouts/profile';

/* webpackChunkName: "ProfileDevelopments" */
const ProfileDevelopments = Loadable({
  loader: () => import('./developments'),
  loading: TopBarProgress,
});

const Main = () => {
  const { username } = useParams();

  return (
    <ProfileProvider>
      <ProfileLayout>
        <Switch>
          <Route exact path="/@:username" component={ProfileDevelopments} />
          <Redirect to={`/@${username}`} />
        </Switch>
      </ProfileLayout>
    </ProfileProvider>
  );
};

export default Main;
