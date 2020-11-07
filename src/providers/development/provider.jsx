import React from 'react';
import { useQuery } from '@apollo/client';
import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import { GET_DEVELOPMENT } from './requests';

export const developmentContext = React.createContext({});

const DevelopmentProvider = ({ children }) => {
  const { developmentId } = useParams('/development/:developmentId');

  const { data, loading } = useQuery(GET_DEVELOPMENT, {
    variables: { id: developmentId },
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
