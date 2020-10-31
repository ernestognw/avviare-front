import React, { useState } from 'react';
import PropTypes from 'prop-types';

export const layoutContext = React.createContext({});

const LayoutProvider = ({ children }) => {
  const [title, setTitle] = useState('');

  return (
    <layoutContext.Provider
      value={{
        title,
        setTitle,
      }}
    >
      {children}
    </layoutContext.Provider>
  );
};

LayoutProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default LayoutProvider;
