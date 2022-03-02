import { useContext, createContext } from 'react';
import { ROOT_FOCUS_KEY } from './SpatialNavigation';

export const FocusContext = createContext(ROOT_FOCUS_KEY);
export const useFocusContext = () => useContext(FocusContext);
