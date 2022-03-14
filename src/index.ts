import SpatialNavigation from './SpatialNavigation';
import useFocusable from './useFocusable';
import { FocusContext } from './useFocusedContext';

export default {
  init: SpatialNavigation.init,
  destroy: SpatialNavigation.destroy,
  setKeyMap: SpatialNavigation.setKeyMap,
  useFocusable,
  FocusContext
};
