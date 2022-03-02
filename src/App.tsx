import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import ReactDOM from 'react-dom';
import { FocusContext } from './useFocusedContext';
import useFocused from './useFocused';

function MenuItem() {
  const { ref, focused } = useFocused();

  return <div ref={ref}>Menu Item</div>;
}

function Menu() {
  const {
    ref,
    focusSelf,
    hasFocusedChild,
    focusKey,
    setFocus,
    navigateByDirection,
    pause,
    resume,
    updateAllLayouts
  } = useFocused({
    focusable: true,
    saveLastFocusedChild: true,
    trackChildren: true,
    autoRestoreFocus: true,
    isFocusBoundary: false,
    focusKey: 'MENU',
    preferredChildFocusKey: null,
    onEnterPress: () => {},
    onEnterRelease: () => {},
    onArrowPress: () => {},
    onFocus: () => {},
    onBlur: () => {}
  });

  return (
    <FocusContext.Provider value={focusKey}>
      <div ref={ref}>Menu</div>
    </FocusContext.Provider>
  );
}

function App() {
  return <div>Hello</div>;
}

ReactDOM.render(<App />, document.querySelector('#root'));
