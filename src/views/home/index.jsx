import React, { Suspense, lazy } from 'react';
import { Redirect, Switch, Route } from 'react-router-dom';
import TopBarProgress from 'react-topbar-progress-indicator';
import { useTitle } from '@providers/layout';
import HomeLayout from '@layouts/home';
import { useUser } from '@providers/user';

const MyDevelopments = lazy(() =>
  import(/* webpackChunkName: "MyDevelopments" */ './my-developments')
);
const AllDevelopments = lazy(() =>
  import(/* webpackChunkName: "AllDevelopments" */ './all-developments')
);
const Users = lazy(() => import(/* webpackChunkName: "Users" */ './users'));

const Main = () => {
  const { overall } = useUser();
  useTitle('Home');

  return (
    <HomeLayout>
      <Suspense fallback={<TopBarProgress />}>
        <Switch>
          <Route exact path="/" component={MyDevelopments} />
          {overall?.admin && <Route path="/all" component={AllDevelopments} />}
          {overall?.admin && <Route path="/users" component={Users} />}
          <Redirect to="/" />
        </Switch>
      </Suspense>
    </HomeLayout>
  );
};

export default Main;
