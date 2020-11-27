import { Suspense, lazy } from 'react';
import { useUser } from '@providers/user';
import { Redirect, Switch, Route } from 'react-router-dom';
import MainLayout from '@layouts/main';
import Auth from '@views/auth';
import TopBarProgress from 'react-topbar-progress-indicator';
import Development from '@views/development';
import Profile from '@views/profile';
import Settings from '@views/settings';
import Home from '@views/home';

const New = lazy(() => import(/* webpackChunkName: "New" */ '@views/new'));

const App = () => {
  const { token, overallRole } = useUser();

  if (!token) return <Auth />;

  return (
    <MainLayout>
      <Suspense fallback={<TopBarProgress />}>
        <Switch>
          {overallRole.admin && <Route path="/new" component={New} />}
          <Route path="/settings" component={Settings} />
          <Route path="/@:username" component={Profile} />
          <Route path="/development/:developmentId" component={Development} />
          <Route path="/" component={Home} />
          <Redirect to="/" />
        </Switch>
      </Suspense>
    </MainLayout>
  );
};

export default App;
