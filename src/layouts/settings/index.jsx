import React from 'react';
import PropTypes from 'prop-types';

const SettingsLayout = ({ children }) => {
  return <>{children}</>;
};

SettingsLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default SettingsLayout;
