import { useState, createContext } from 'react';
import PropTypes from 'prop-types';

const layoutContext = createContext({});

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

export { layoutContext };
export default LayoutProvider;
