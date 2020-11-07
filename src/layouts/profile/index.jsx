import React from 'react';
import PropTypes from 'prop-types';
import { useProfile } from '@providers/profile';
import { useTitle } from '@providers/layout';

const ProfileLayout = ({ children }) => {
  const { isOwner, profile, loadingProfile } = useProfile();

  useTitle(loadingProfile ? '' : isOwner ? 'Mi perfil' : `Perfil de ${profile.firstName}`);

  return <>{children}</>;
};

ProfileLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ProfileLayout;
