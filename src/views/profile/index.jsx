import React from 'react';
import { useTitle } from '@providers/layout';

const Profile = () => {
  useTitle('Mi perfil');

  return (
    <>
      <p>Profile</p>
    </>
  );
};

export default Profile;
