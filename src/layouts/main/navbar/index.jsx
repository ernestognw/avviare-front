/* eslint-disable no-unused-expressions */
import React from 'react';
import { PageHeader } from 'antd';
import { useLayout } from '@providers/layout';
import { env } from '@config/environment';
import { NavbarContainer, Menu } from './elements';

const { Item } = Menu;

const NavBar = () => {
  const { title } = useLayout();

  const handleLogout = () => {
    if (env.development) {
      document.cookie = 'token= ; expires = Thu, 01 Jan 1970 00:00:00 GMT;path=/';
    } else {
      document.cookie =
        'token= ; domain=.avviare.site ; expires = Thu, 01 Jan 1970 00:00:00 GMT;path=/';
    }
    window.location.reload();
  };

  return (
    <NavbarContainer>
      <Menu mode="horizontal" style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <PageHeader
          backIcon={false}
          style={{ marginRight: 'auto', padding: '0px 20px' }}
          title={title}
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
