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
import Loading from '@components/loading';
import Box from '@components/box';

const New = lazy(() => import(/* webpackChunkName: "New" */ '@views/new'));

const App = () => {
  const { isLogged, overallRole, token } = useUser();

  if (!isLogged) return <Auth />;

  if (!token)
    return (
      <Box height="100vh" width="100%" display="flex" alignItems="center" justifyContent="center">
        <Loading />
      </Box>
    );

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
