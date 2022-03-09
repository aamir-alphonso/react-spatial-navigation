/**
 * Since this file is for development purposes only, some of the dependencies are in devDependencies
 * Disabling ESLint rules for these dependencies since we know it is only for development purposes
 */

import React, {
  useCallback,
  useEffect,
  useState,
  useMemo,
  useRef
} from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import ReactDOM from 'react-dom';
// eslint-disable-next-line import/no-extraneous-dependencies
import styled, { createGlobalStyle } from 'styled-components';
import { shuffle } from 'lodash';
import { FocusContext } from './useFocusedContext';
import useFocused from './useFocused';
import SpatialNavigation, {
  FocusableComponentLayout,
  FocusDetails,
  KeyPressDetails
} from './SpatialNavigation';

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
  border-color: darkviolet;
  border-style: solid;
  border-width: ${({ focused }) => (focused ? '3px' : 0)};
  box-sizing: border-box;
`;

function MenuItem() {
  const { ref, focused } = useFocused();

  return <MenuItemBox ref={ref} focused={focused} />;
}

interface MenuWrapperProps {
  hasFocusedChild: boolean;
}

const MenuWrapper = styled.div<MenuWrapperProps>`
  flex: 1;
  max-width: 80px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  background-color: ${({ hasFocusedChild }) =>
    hasFocusedChild ? '#1c1c1c' : '#3f3f3f'};
`;

interface MenuProps {
  focusKey: string;
}

function Menu({ focusKey: focusKeyParam }: MenuProps) {
  const {
    ref,
    focusSelf,
    hasFocusedChild,
    focusKey
    // setFocus, -- to set focus manually to some focusKey
    // navigateByDirection, -- to manually navigate by direction
    // pause, -- to pause all navigation events
    // resume, -- to resume all navigation events
    // updateAllLayouts -- to force update all layouts when needed
  } = useFocused({
    focusable: true,
    saveLastFocusedChild: false,
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
      <MenuWrapper ref={ref} hasFocusedChild={hasFocusedChild}>
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
  border-color: darkviolet;
  border-style: solid;
  border-width: ${({ focused }) => (focused ? '3px' : 0)};
  box-sizing: border-box;
`;

const AssetTitle = styled.div`
  color: white;
  margin-top: 10px;
`;

interface AssetProps {
  title: string;
  color: string;
  onEnterPress: (props: object, details: KeyPressDetails) => void;
  onFocus: (
    layout: FocusableComponentLayout,
    props: object,
    details: FocusDetails
  ) => void;
}

function Asset({ title, color, onEnterPress, onFocus }: AssetProps) {
  const { ref, focused } = useFocused({
    onEnterPress,
    onFocus,
    extraProps: {
      title,
      color
    }
  });

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
  padding-left: 20px;
`;

const ContentRowScrollingWrapper = styled.div`
  overflow-x: auto;
  overflow-y: hidden;
  flex-shrink: 1;
  flex-grow: 1;
  padding-left: 20px;
`;

const ContentRowScrollingContent = styled.div`
  display: flex;
  flex-direction: row;
`;

interface ContentRowProps {
  title: string;
  onAssetPress: (props: object, details: KeyPressDetails) => void;
  onFocus: (
    layout: FocusableComponentLayout,
    props: object,
    details: FocusDetails
  ) => void;
}

function ContentRow({
  title: rowTitle,
  onAssetPress,
  onFocus
}: ContentRowProps) {
  const { ref, focusKey } = useFocused({
    onFocus
  });

  const shuffledAssets = useMemo(() => shuffle(assets), []);

  const scrollingRef = useRef(null);

  const onAssetFocus = useCallback(
    ({ x }) => {
      scrollingRef.current.scrollTo({
        left: x,
        behavior: 'smooth'
      });
    },
    [scrollingRef]
  );

  return (
    <FocusContext.Provider value={focusKey}>
      <ContentRowWrapper ref={ref}>
        <ContentRowTitle>{rowTitle}</ContentRowTitle>
        <ContentRowScrollingWrapper ref={scrollingRef}>
          <ContentRowScrollingContent>
            {shuffledAssets.map(({ title, color }) => (
              <Asset
                key={title}
                title={title}
                color={color}
                onEnterPress={onAssetPress}
                onFocus={onAssetFocus}
              />
            ))}
          </ContentRowScrollingContent>
        </ContentRowScrollingWrapper>
      </ContentRowWrapper>
    </FocusContext.Provider>
  );
}

const ContentWrapper = styled.div`
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const SelectedItemWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 200px;
`;

const SelectedItemBox = styled.div`
  height: 160px;
  width: 160px;
  background-color: ${({ color }) => color};
`;

const SelectedItemTitle = styled.div`
  margin-top: 10px;
  color: white;
`;

const ScrollingRows = styled.div`
  overflow-y: auto;
  overflow-x: hidden;
  flex-shrink: 1;
  flex-grow: 1;
`;

function Content() {
  const { ref, focusKey } = useFocused();

  const [selectedAsset, setSelectedAsset] = useState(null);

  const onAssetPress = useCallback((asset) => {
    setSelectedAsset(asset);
  }, []);

  const onRowFocus = useCallback(
    ({ y }) => {
      ref.current.scrollTo({
        top: y,
        behavior: 'smooth'
      });
    },
    [ref]
  );

  return (
    <FocusContext.Provider value={focusKey}>
      <ContentWrapper>
        <SelectedItemWrapper>
          <SelectedItemBox color={selectedAsset?.color} />
          <SelectedItemTitle>
            {selectedAsset
              ? selectedAsset.title
              : 'Press "Enter" to select an asset'}
          </SelectedItemTitle>
        </SelectedItemWrapper>
        <ScrollingRows ref={ref}>
          <div>
            {rows.map(({ title }) => (
              <ContentRow
                key={title}
                title={title}
                onAssetPress={onAssetPress}
                onFocus={onRowFocus}
              />
            ))}
          </div>
        </ScrollingRows>
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

const GlobalStyle = createGlobalStyle`
  ::-webkit-scrollbar {
    display: none;
  }
`;

function App() {
  return (
    <AppContainer>
      <GlobalStyle />
      <Menu focusKey="MENU" />
      <Content />
    </AppContainer>
  );
}

ReactDOM.render(<App />, document.querySelector('#root'));
