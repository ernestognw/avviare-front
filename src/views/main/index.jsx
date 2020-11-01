import React from 'react';
import { Redirect, Switch, Route, Link, useLocation } from 'react-router-dom';
import TopBarProgress from 'react-topbar-progress-indicator';
import Loadable from 'react-loadable';
import { useUser } from '@providers/user';
import { BlockOutlined, AppstoreOutlined, UserOutlined } from '@ant-design/icons';
import { Menu } from 'antd';

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
  const { pathname } = useLocation();
  const { overall } = useUser();

  return (
    <>
      <Menu mode="horizontal" selectedKeys={[pathname]}>
        {overall?.admin && (
          <Menu.Item key="/all" icon={<AppstoreOutlined />}>
            <Link to="/all">Todos los desarrollos</Link>
          </Menu.Item>
        )}
        <Menu.Item key="/" icon={<BlockOutlined />}>
          <Link to="/">Mis desarrollos</Link>
        </Menu.Item>
        {overall?.admin && (
          <Menu.Item key="/users" icon={<UserOutlined />}>
            <Link to="/users">Usuarios</Link>
          </Menu.Item>
        )}
      </Menu>
      <Switch>
        <Route exact path="/" component={MyDevelopments} />
        {overall?.admin && <Route path="/all" component={AllDevelopments} />}
        {overall?.admin && <Route path="/users" component={Users} />}
        <Redirect to="/" />
      </Switch>
    </>
  );
};

export default Main;
