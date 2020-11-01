import React from 'react';
import { Redirect, Switch, Route } from 'react-router-dom';
import TopBarProgress from 'react-topbar-progress-indicator';
import { useTitle } from '@providers/layout';
import Loadable from 'react-loadable';
import HomeLayout from '@layouts/home';
import { useUser } from '@providers/user';

/* webpackChunkName: "MyDevelopments" */
const MyDevelopments = Loadable({
  loader: () => import('./my-developments'),
  loading: TopBarProgress,
});

/* webpackChunkName: "AllDevelopments" */
const AllDevelopments = Loadable({
  loader: () => import('./all-developments'),
  loading: TopBarProgress,
});

/* webpackChunkName: "Users" */
const Users = Loadable({
  loader: () => import('./users'),
  loading: TopBarProgress,
});

const Main = () => {
  const { overall } = useUser();
  useTitle('Home');

  return (
    <HomeLayout>
      <Switch>
        <Route exact path="/" component={MyDevelopments} />
        {overall?.admin && <Route path="/all" component={AllDevelopments} />}
        {overall?.admin && <Route path="/users" component={Users} />}
        <Redirect to="/" />
      </Switch>
    </HomeLayout>
  );
};

export default Main;
