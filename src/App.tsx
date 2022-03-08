/**
 * Since this file is for development purposes only, some of the dependencies are in devDependencies
 * Disabling ESLint rules for these dependencies since we know it is only for development purposes
 */

import React, { useEffect } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import ReactDOM from 'react-dom';
// eslint-disable-next-line import/no-extraneous-dependencies
import styled from 'styled-components';
import { shuffle } from 'lodash';
import { FocusContext } from './useFocusedContext';
import useFocused from './useFocused';
import SpatialNavigation from './SpatialNavigation';

SpatialNavigation.init({
  debug: false,
  visualDebug: false
});

const rows = shuffle([
  {
    title: 'Row 1'
  },
  {
    title: 'Row 2'
  },
  {
    title: 'Row 3'
  },
  {
    title: 'Row 4'
  },
  {
    title: 'Row 5'
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

interface MenuItemBoxProps {
  focused: boolean;
}

const MenuItemBox = styled.div<MenuItemBoxProps>`
  width: 40px;
  height: 40px;
  background-color: ${({ focused }) => (focused ? 'white' : 'yellow')};
`;

function MenuItem() {
  const { ref, focused } = useFocused();

  return <MenuItemBox ref={ref} focused={focused} />;
}

const MenuWrapper = styled.div`
  flex: 1;
  max-width: 80px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  background-color: #1c1c1c;
`;

interface MenuProps {
  focusKey: string;
}

function Menu({ focusKey: focusKeyParam }: MenuProps) {
  const {
    ref,
    focusSelf,
    // hasFocusedChild,
    focusKey
    // setFocus,
    // navigateByDirection,
    // pause,
    // resume,
    // updateAllLayouts
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

  useEffect(() => {
    focusSelf();
  }, [focusSelf]);

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

const AssetWrapper = styled.div`
  margin-right: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

interface AssetBoxProps {
  focused: boolean;
  color: string;
}

const AssetBox = styled.div<AssetBoxProps>`
  width: 80px;
  height: 80px;
  background-color: ${({ color, focused }) => (focused ? 'white' : color)};
`;

const AssetTitle = styled.div`
  color: white;
  margin-top: 10px;
`;

interface AssetProps {
  title: string;
  color: string;
}

function Asset({ title, color }: AssetProps) {
  const { ref, focused } = useFocused();

  return (
    <AssetWrapper ref={ref}>
      <AssetBox color={color} focused={focused} />
      <AssetTitle>{title}</AssetTitle>
    </AssetWrapper>
  );
}

const ContentRowWrapper = styled.div`
  margin-bottom: 20px;
`;

const ContentRowTitle = styled.div`
  color: white;
  margin-bottom: 10px;
  font-size: 20px;
  font-weight: bold;
`;

const ContentRowScrollingContent = styled.div`
  display: flex;
  flex-direction: row;
`;

interface ContentRowProps {
  title: string;
}

function ContentRow({ title: rowTitle }: ContentRowProps) {
  const { ref, focusKey } = useFocused();

  return (
    <FocusContext.Provider value={focusKey}>
      <ContentRowWrapper ref={ref}>
        <ContentRowTitle>{rowTitle}</ContentRowTitle>
        <ContentRowScrollingContent>
          {shuffle(
            assets.map(({ title, color }) => (
              <Asset key={title} title={title} color={color} />
            ))
          )}
        </ContentRowScrollingContent>
      </ContentRowWrapper>
    </FocusContext.Provider>
  );
}

const ContentWrapper = styled.div`
  flex: 1;
  overflow: hidden;
  padding: 20px;
`;

const SelectedItemWrapper = styled.div``;

const SelectedItemBox = styled.div``;

const SelectedItemTitle = styled.div``;

const ContentRows = styled.div``;

function Content() {
  const { ref, focusKey } = useFocused();

  return (
    <FocusContext.Provider value={focusKey}>
      <ContentWrapper ref={ref}>
        <SelectedItemWrapper>
          <SelectedItemBox />
          <SelectedItemTitle>Selected</SelectedItemTitle>
        </SelectedItemWrapper>
        <ContentRows>
          {rows.map(({ title }) => (
            <ContentRow key={title} title={title} />
          ))}
        </ContentRows>
      </ContentWrapper>
    </FocusContext.Provider>
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
