import React, { useContext } from 'react';
import UserProvider, { userContext } from './provider';

const useUser = () => useContext(userContext);

const withUser = (Component) => (props) => (
  <userContext.Consumer>{(state) => <Component {...props} auth={state} />}</userContext.Consumer>
);

export { useUser, withUser, UserProvider };
