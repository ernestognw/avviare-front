import { useState, createContext } from 'react';
import PropTypes from 'prop-types';

const layoutContext = createContext({});

const initialDisplayValues = {
  documents: 'table', // table || grid
};

const LayoutProvider = ({ children }) => {
  const [title, setTitle] = useState('');
  const [layoutDisplays, setLayoutDisplays] = useState(
    JSON.parse(localStorage.getItem('displays')) ?? initialDisplayValues
  );

  const setDisplays = (newValues) => {
    const newLayoutsDisplay = { ...layoutDisplays, ...newValues };
    localStorage.setItem('displays', JSON.stringify(newLayoutsDisplay));
    setLayoutDisplays(newLayoutsDisplay);
  };

  return (
    <layoutContext.Provider
      value={{
        title,
        setTitle,
        displays: layoutDisplays,
        setDisplays,
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
