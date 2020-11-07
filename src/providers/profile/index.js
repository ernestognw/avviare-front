import { useContext } from 'react';
import ProfileProvider, { profileContext } from './provider';

const useProfile = () => useContext(profileContext);

export { useProfile, ProfileProvider };
