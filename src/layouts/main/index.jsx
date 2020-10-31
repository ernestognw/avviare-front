import React from 'react';
import PropTypes from 'prop-types';
import { Layout } from 'antd';
import Sidebar from './sidebar';
import Footer from './footer';
import Navbar from './navbar';

const { Content } = Layout;

const MainLayout = ({ children }) => {
  return (
    <Layout style={{ minHeight: '100vh', maxHeight: '100vh' }}>
      <Sidebar />
      <Layout>
        <Navbar />
        <Content>{children}</Content>
        <Footer />
      </Layout>
    </Layout>
  );
};

MainLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default MainLayout;
