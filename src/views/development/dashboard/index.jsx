import React from 'react';
import { useTitle } from '@providers/layout';

const Dashboard = () => {
  useTitle('Dashboard');

  return (
    <>
      <p>Dashboard</p>
    </>
  );
};

export default Dashboard;
