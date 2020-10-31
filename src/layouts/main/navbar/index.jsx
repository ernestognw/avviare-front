/* eslint-disable no-unused-expressions */
import React from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { PageHeader } from 'antd';
import { env } from '@config/environment';
import { NavbarContainer, Menu } from './elements';

const { Item } = Menu;

const NavBar = () => {
  const { goBack } = useHistory();
  const { pathname } = useLocation();

  const handleLogout = () => {
    if (env.development) {
      document.cookie = 'token= ; expires = Thu, 01 Jan 1970 00:00:00 GMT;path=/';
    } else {
      document.cookie =
        'token= ; domain=.avviare.site ; expires = Thu, 01 Jan 1970 00:00:00 GMT;path=/';
    }
    window.location.reload();
  };

  const format = (path) => {
    const title = path.substring(path.lastIndexOf('/') + 1).replace(/-/g, ' ');
    return title.charAt(0).toUpperCase() + title.slice(1);
  };

  return (
    <NavbarContainer>
      <Menu mode="horizontal" style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <PageHeader
          style={{ marginRight: 'auto', padding: '0px 20px' }}
          onBack={goBack}
          title={format(pathname)}
        />
        <Item key="1" disabled>
          Foo Bar
        </Item>
        <Item key="3" onClick={handleLogout}>
          <span>Salir</span>
        </Item>
      </Menu>
    </NavbarContainer>
  );
};

export default NavBar;
