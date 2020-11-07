import React from 'react';
import { useQuery } from '@apollo/client';
import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useUser } from '@providers/user';
import { GET_USER } from './requests';

export const profileContext = React.createContext({});

const ProfileProvider = ({ children }) => {
  const { username } = useParams('/@:username');
  const { user } = useUser();

  const { data, loading } = useQuery(GET_USER, {
    variables: { username },
  });

  return (
    <profileContext.Provider
      value={{
        profile: data?.user ?? {},
        loadingProfile: loading,
        isOwner: !loading && user.username === username,
      }}
    >
      {children}
    </profileContext.Provider>
  );
};

ProfileProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ProfileProvider;
