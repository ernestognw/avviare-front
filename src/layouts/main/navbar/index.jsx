import { PageHeader, Avatar, Dropdown, Menu, Typography } from 'antd';
import { useLayout } from '@providers/layout';
import { useUser } from '@providers/user';
import { useHistory } from 'react-router-dom';
import { UserOutlined, DownOutlined, LogoutOutlined, SettingOutlined } from '@ant-design/icons';
import { NavbarContainer, NameContainer, ProfileButton } from './elements';

const { Item, ItemGroup } = Menu;
const { Text } = Typography;

const NavBar = () => {
  const { title } = useLayout();
  const { user, logout } = useUser();
  const { push } = useHistory();

  return (
    <NavbarContainer>
      <PageHeader
        backIcon={false}
        style={{ marginRight: 'auto', padding: '0px 20px' }}
        title={title}
      />
      <Dropdown
        trigger={['click']}
        overlay={
          <Menu mode="vertical">
            <ItemGroup title="Cuenta">
              <Item onClick={() => push(`/@${user.username}`)} icon={<UserOutlined />}>
                Mi perfil
              </Item>
              <Item onClick={() => push('/settings')} icon={<SettingOutlined />}>
                Settings
              </Item>
            </ItemGroup>
            <ItemGroup title="Sesión">
              <Item onClick={logout} icon={<LogoutOutlined />}>
                Salir
              </Item>
            </ItemGroup>
          </Menu>
        }
      >
        <ProfileButton type="text">
          <Avatar style={{ marginRight: 15 }} size={35} src={user.profileImg}>
            {user.firstName?.[0]}
          </Avatar>
          <NameContainer>
            <Text style={{ fontSize: 12 }} type="secondary">
              Bienvenido
            </Text>
            <Text style={{ marginTop: -5 }} strong>
              {user.firstName}
            </Text>
          </NameContainer>
          <DownOutlined />
        </ProfileButton>
      </Dropdown>
    </NavbarContainer>
  );
};

export default NavBar;
