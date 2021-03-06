import { createContext } from 'react';
import { useQuery } from '@apollo/client';
import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useUser } from '@providers/user';
import { GET_DEVELOPMENT } from './requests';

const developmentContext = createContext({});

const DevelopmentProvider = ({ children }) => {
  const { developmentId } = useParams('/development/:developmentId');

  const { data, loading, refetch } = useQuery(GET_DEVELOPMENT, {
    variables: { id: developmentId },
  });

  const { overallRole } = useUser();

  return (
    <developmentContext.Provider
      value={{
        development: data?.development ?? {},
        loadingDevelopment: loading,
        reloadDevelopment: refetch,
        userHasAccess: loading || !!data?.userDevelopmentRoleByToken || overallRole.admin, // Access is assumed when is loading to avoid hard redirects in the midtime
        developmentRole: (data?.userDevelopmentRoleByToken || overallRole) && {
          manager: data?.userDevelopmentRoleByToken === 'MANAGER' || overallRole.admin,
          edification: data?.userDevelopmentRoleByToken === 'EDIFICATION',
          urbanization: data?.userDevelopmentRoleByToken === 'URBANIZATION',
          sales: data?.userDevelopmentRoleByToken === 'SALES',
        },
        rawDevelopmentRole: overallRole.admin ? 'MANAGER' : data?.userDevelopmentRoleByToken,
      }}
    >
      {children}
    </developmentContext.Provider>
  );
};

DevelopmentProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { developmentContext };
export default DevelopmentProvider;
