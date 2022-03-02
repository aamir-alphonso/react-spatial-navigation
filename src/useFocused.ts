import {
  RefObject,
  useCallback,
  useMemo,
  useRef,
  useEffect,
  useState
} from 'react';
import { uniqueId, noop } from 'lodash';
import SpatialNavigation from './SpatialNavigation';
import { useFocusContext } from './useFocusedContext';

interface UseFocusedConfig {
  focusable?: boolean;
  saveLastFocusedChild?: boolean;
  trackChildren?: boolean;
  autoRestoreFocus?: boolean;
  isFocusBoundary?: boolean;
  focusKey?: string;
  preferredChildFocusKey?: string;
  onEnterPress?: Function;
  onEnterRelease?: Function;
  onArrowPress?: Function;
  onFocus?: Function;
  onBlur?: Function;
}

interface UseFocusedResult {
  ref: RefObject<any>; // <any> since we don't know which HTML tag is passed here
  focusSelf: () => void;
  focused: boolean;
  hasFocusedChild: boolean;
  focusKey: string;
  setFocus: (focusKey: string) => void;
  navigateByDirection: (direction: string) => void;
  pause: () => void;
  resume: () => void;
  updateAllLayouts: () => void;
}

const useFocused = ({
  focusable = true,
  saveLastFocusedChild = true,
  trackChildren = false,
  autoRestoreFocus = true,
  isFocusBoundary = false,
  focusKey: propFocusKey,
  preferredChildFocusKey,
  onEnterPress = noop,
  onEnterRelease = noop,
  onArrowPress = noop,
  onFocus = noop,
  onBlur = noop
}: UseFocusedConfig = {}): UseFocusedResult => {
  const ref = useRef(null);

  const [focused, setFocused] = useState(false);
  const [hasFocusedChild, setHasFocusedChild] = useState(false);

  const parentFocusKey = useFocusContext();

  /**
   * Either using the propFocusKey passed in, or generating a random one
   */
  const focusKey = useMemo(
    () => propFocusKey || uniqueId('sn:focusable-item-'),
    [propFocusKey]
  );

  const focusSelf = useCallback(() => {
    SpatialNavigation.setFocus(focusKey);
  }, [focusKey]);

  useEffect(() => {
    const node = ref.current;

    SpatialNavigation.addFocusable({
      focusKey,
      node,
      parentFocusKey,
      preferredChildFocusKey,
      onEnterPress,
      onEnterRelease,
      onArrowPress,
      onFocus,
      onBlur,
      onUpdateFocus: (isFocused = false) => setFocused(isFocused),
      onUpdateHasFocusedChild: (isFocused = false) =>
        setHasFocusedChild(isFocused),
      saveLastFocusedChild,
      trackChildren,
      isFocusBoundary,
      autoRestoreFocus,
      focusable
    });

    return () => {
      SpatialNavigation.removeFocusable({
        focusKey
      });
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const node = ref.current;

    SpatialNavigation.updateFocusable(focusKey, {
      node,
      preferredChildFocusKey,
      focusable,
      isFocusBoundary
    });
  }, [focusKey, preferredChildFocusKey, focusable, isFocusBoundary]);

  return {
    ref,
    focusSelf,
    focused,
    hasFocusedChild,
    focusKey, // returns either the same focusKey as passed in, or generated one
    setFocus: SpatialNavigation.setFocus,
    navigateByDirection: SpatialNavigation.navigateByDirection,
    pause: SpatialNavigation.pause,
    resume: SpatialNavigation.resume,
    updateAllLayouts: SpatialNavigation.updateAllLayouts
  };
};

export default useFocused;
