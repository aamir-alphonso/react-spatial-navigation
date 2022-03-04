/**
 * Since this file is for development purposes only, some of the dependencies are in devDependencies
 * Disabling ESLint rules for these dependencies since we know it is only for development purposes
 */

import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import ReactDOM from 'react-dom';
// eslint-disable-next-line import/no-extraneous-dependencies
import styled from 'styled-components';
import { shuffle } from 'lodash';
import { FocusContext } from './useFocusedContext';
import useFocused from './useFocused';

const rows = shuffle([
  {
    title: 'Row 1'
  },
  {
    title: 'Row 2'
  },
  {
    title: 'Row 3'
  }
]);

const assets = shuffle([
  {
    title: 'Asset 1',
    color: '#337fdd'
  },
  {
    title: 'Asset 2',
    color: '#dd4558'
  },
  {
    title: 'Asset 3',
    color: '#7ddd6a'
  },
  {
    title: 'Asset 4',
    color: '#dddd4d'
  },
  {
    title: 'Asset 5',
    color: '#8299dd'
  },
  {
    title: 'Asset 6',
    color: '#edab83'
  },
  {
    title: 'Asset 7',
    color: '#60ed9e'
  },
  {
    title: 'Asset 8',
    color: '#d15fb6'
  },
  {
    title: 'Asset 9',
    color: '#c0ee33'
  }
]);

function MenuItem() {
  const { ref, focused } = useFocused();

  return <div ref={ref}>Menu Item</div>;
}

const MenuWrapper = styled.div`
  flex: 1;
  max-width: 100px;
`;

interface MenuProps {
  focusKey: string;
}

function Menu({ focusKey: focusKeyParam }: MenuProps) {
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
    focusKey: focusKeyParam,
    preferredChildFocusKey: null,
    onEnterPress: () => {},
    onEnterRelease: () => {},
    onArrowPress: () => true,
    onFocus: () => {},
    onBlur: () => {},
    extraProps: { foo: 'bar' }
  });

  return (
    <FocusContext.Provider value={focusKey}>
      <MenuWrapper ref={ref}>
        <MenuItem />
        <MenuItem />
        <MenuItem />
        <MenuItem />
        <MenuItem />
      </MenuWrapper>
    </FocusContext.Provider>
  );
}

const AssetBox = styled.div`
  background-color: ${({ color }) => color};
`;

interface AssetProps {
  title: string;
  color: string;
}

function Asset({ title, color }: AssetProps) {
  return (
    <div>
      <AssetBox color={color} />
      <div>{title}</div>
    </div>
  );
}

interface ContentRowProps {
  title: string;
}

function ContentRow({ title: rowTitle }: ContentRowProps) {
  return (
    <div>
      <div>{rowTitle}</div>
      <div>
        {assets.map(({ title, color }) => (
          <Asset title={title} color={color} />
        ))}
      </div>
    </div>
  );
}

const ContentWrapper = styled.div`
  flex: 1;
`;

const SelectedItem = styled.div``;

const ContentRows = styled.div``;

function Content() {
  return (
    <ContentWrapper>
      <SelectedItem />
      <ContentRows>
        {rows.map(({ title }) => (
          <ContentRow title={title} />
        ))}
      </ContentRows>
    </ContentWrapper>
  );
}

const AppContainer = styled.div`
  background-color: #2f2f2f;
  width: 800px;
  height: 600px;
  display: flex;
  flex-direction: row;
`;

function App() {
  return (
    <AppContainer>
      <Menu focusKey="MENU" />
      <Content />
    </AppContainer>
  );
}

ReactDOM.render(<App />, document.querySelector('#root'));
