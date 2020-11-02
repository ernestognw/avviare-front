import { useContext } from 'react';
import DevelopmentProvider, { developmentContext } from './provider';

const useDevelopment = () => useContext(developmentContext);

export { useDevelopment, DevelopmentProvider };
