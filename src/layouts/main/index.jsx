import React from 'react';
import PropTypes from 'prop-types';
import { Layout as Layer } from 'antd';
import Sidebar from './sidebar';
import Footer from './footer';

const MainLayout = ({ children }) => {
  return (
    <Layer style={{ minHeight: '100vh', maxHeight: '100vh' }}>
      <Sidebar />
      <Layer>
        {children}
        <Footer />
      </Layer>
    </Layer>
  );
};

MainLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default MainLayout;
