import { useContext, useEffect } from 'react';
import LayoutProvider, { layoutContext } from './provider';

const useLayout = () => useContext(layoutContext);

const useTitle = (title) => {
  const { setTitle } = useLayout();

  useEffect(() => setTitle(title), [setTitle, title]);
};

export { useLayout, LayoutProvider, useTitle };
