import React from 'react';
import { useQuery } from '@apollo/client';
import { useRouteMatch } from 'react-router-dom';
import PropTypes from 'prop-types';
import { GET_DEVELOPMENT } from './requests';

export const developmentContext = React.createContext({});

const DevelopmentProvider = ({ children }) => {
  const match = useRouteMatch('/development/:developmentId');

  const { data, loading } = useQuery(GET_DEVELOPMENT, {
    variables: { id: match?.params?.developmentId },
  });

  return (
    <developmentContext.Provider
      value={{
        development: data?.development ?? {},
        loadingDevelopment: loading,
        developmentRole: data?.userDevelopmentRoleByToken,
      }}
    >
      {children}
    </developmentContext.Provider>
  );
};

DevelopmentProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default DevelopmentProvider;
