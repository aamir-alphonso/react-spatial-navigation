# react-spatial-navigation
[![npm version](https://badge.fury.io/js/%40noriginmedia%2Freact-spatial-navigation.svg)](https://badge.fury.io/js/%40noriginmedia%2Freact-spatial-navigation)

# Motivation
The main motivation to create this package was to bring the best Developer Experience and Performance when working with Spatial Navigation and React. Ideally you wouldn't want to have any logic to define the navigation in your app. It should be as easy as just to tell which components should be focusable. With this package all you have to do is to initialize it, add `useFocusable` hook to your focusable components, and set initial focus. The spatial navigation system will automatically figure out which components to focus next when you navigate with the directional keys by calculating their coordinates on the screen at runtime.

# Article
TO BE ADDED

# Table of Contents
* [Example](#example-app)
* [Installation](#installation)
* [Usage](#usage)
* [API](#api)
* [Technical details and concepts](#technical-details-and-concepts)
* [Migration from v2](#migration-from-v2-hoc-based-to-v3-hook-based)

# Changelog
[CHANGELOG.md](https://github.com/NoriginMedia/react-spatial-navigation/blob/master/CHANGELOG.md)

# Example App
GIF TO BE ADDED

[Example Source](https://github.com/NoriginMedia/react-spatial-navigation/blob/master/src/App.tsx)

# Installation
```bash
npm i @noriginmedia/react-spatial-navigation --save
```

# Usage
## Initialization
[Init options](#init-options)
```jsx
// Called once somewhere in the root of the app

import { init } from '@noriginmedia/react-spatial-navigation';

init({
  // options
});
```

## Making your component focusable
Most commonly you will have Leaf Focusable components. (See [Tree Hierarchy](#tree-hierarchy-of-focusable-components))
Leaf component is the one that doesn't have focusable children.
`ref` is required to link the DOM element with the hook. (to measure its coordinates, size etc.)

```jsx
import { useFocused } from '@noriginmedia/react-spatial-navigation';

function Button() {
  const { ref, focused } = useFocused();

  return (<div ref={ref} className={focused ? 'button-focused' : 'button'}>
    Press me
  </div>);
}
```

## Wrapping Leaf components with a Focusable Container
Focusable Container is the one that has other focusable children. (i.e. a scrollable list) (See [Tree Hierarchy](#tree-hierarchy-of-focusable-components))
`ref` is required to link the DOM element with the hook. (to measure its coordinates, size etc.)
`FocusContext.Provider` is required in order to provide all children components with the `focusKey` of the Container,
which serves as a Parent Focus Key for them. This way your focusable children components can be deep in the DOM tree
while still being able to know who is their Focusable Parent.
Focusable Container cannot have `focused` state, but instead propagates focus down to appropriate Child component.
You can nest multiple Focusable Containers. When focusing the top level Container, it will propagate focus down until it encounters the first Leaf component.
I.e. if you set focus to the `Page`, the focus could propagate as following: `Page` -> `ContentWrapper` -> `ContentList` -> `ListItem`.

```jsx
import { useFocused, FocusContext } from '@noriginmedia/react-spatial-navigation';
import ListItem from './ListItem';

function ContentList() {
  const { ref, focusKey } = useFocused();

  return (<FocusContext.Provider value={focusKey}>
    <div ref={ref}>
      <ListItem />
      <ListItem />
      <ListItem />
    </div>
  </FocusContext.Provider>);
}
```

## Manually setting the focus
You can manually set the focus either to the current component (`focusSelf`), or to any other component providing its `focusKey` to `setFocus`.
It is useful when you first open the page, or i.e. when your modal Popup gets mounted.

```jsx
import React, { useEffect } from 'react';
import { useFocused, FocusContext } from '@noriginmedia/react-spatial-navigation';

function Popup() {
  const { ref, focusKey, focusSelf, setFocus } = useFocused();

  // Focusing self will focus the Popup, which will pass the focus down to the first Child (ButtonPrimary)
  // Alternatively you can manually focus any other component by its 'focusKey'
  useEffect(() => {
    focusSelf();

    // alternatively
    // setFocus('BUTTON_PRIMARY');
  }, [focusSelf]);

  return (<FocusContext.Provider value={focusKey}>
    <div ref={ref}>
      <ButtonPrimary focusKey={'BUTTON_PRIMARY'} />
      <ButtonSecondary />
    </div>
  </FocusContext.Provider>);
}
```

## Tracking children components
Any Focusable Container can track whether it has any Child focused or not. This feature is disabled by default,
but it can be controlled by the `trackChildren` flag passed to the `useFocused` hook. When enabled, the hook will return
a `hasFocusedChild` flag indicating when a Container component is having focused Child down in the focusable Tree.
It is useful for example when you want to style a container differently based on whether it has focused Child or not.

```jsx
import { useFocused, FocusContext } from '@noriginmedia/react-spatial-navigation';
import MenuItem from './MenuItem';

function Menu() {
  const { ref, focusKey, hasFocusedChild } = useFocused({trackChildren: true});

  return (<FocusContext.Provider value={focusKey}>
    <div ref={ref} className={hasFocusedChild ? 'menu-expanded' : 'menu-collapsed'}>
      <MenuItem />
      <MenuItem />
      <MenuItem />
    </div>
  </FocusContext.Provider>);
}
```

## Restricting focus to a certain component boundaries
Sometimes you don't want the focus to leave your component, for example when displaying a Popup, you don't want the focus to go to
a component underneath the Popup. This can be enabled with `isFocusBoundary` flag passed to the `useFocusable` hook.

```jsx
import React, { useEffect } from 'react';
import { useFocused, FocusContext } from '@noriginmedia/react-spatial-navigation';

function Popup() {
  const { ref, focusKey, focusSelf } = useFocused({isFocusBoundary: true});

  useEffect(() => {
    focusSelf();
  }, [focusSelf]);

  return (<FocusContext.Provider value={focusKey}>
    <div ref={ref}>
      <ButtonPrimary />
      <ButtonSecondary />
    </div>
  </FocusContext.Provider>);
}
```

## Using the library in React Native environment
In React Native environment the navigation between focusable (Touchable) components is happening under the hood by the
native focusable engine. This library is NOT doing any coordinates measurements or navigation decisions in the native environment.
But it can still be used to keep the currently focused element node reference and its focused state, which can be used to
highlight components based on the `focused` or `hasFocusedChild` flags.
IMPORTANT: in order to "sync" the focus events coming from the native focus engine to the hook, you have to link
`onFocus` callback with the `focusSelf` method. This way, the hook will know that the component became focused, and will
set the `focused` flag accordingly.

```jsx
import { TouchableOpacity, Text } from 'react-native';
import { useFocused } from '@noriginmedia/react-spatial-navigation';

function Button() {
  const { ref, focused, focusSelf } = useFocused();

  return (<TouchableOpacity
    ref={ref}
    onFocus={focusSelf}
    style={focused ? styles.buttonFocused : styles.button}
  >
    <Text>Press me</Text>
  </TouchableOpacity>);
}
```

# API
## Top Level exports
### `init`
#### Init options
##### `debug`: boolean (default: false)
Enables console debugging.

##### `visualDebug`: boolean (default: false)
Enables visual debugging (all layouts, reference points and siblings reference points are printed on canvases).

##### `nativeMode`: boolean (default: false)
Enables Native mode. It will **disable** certain web-only functionality:
- adding window key listeners
- measuring DOM layout
- `onFocus` and `onBlur` callbacks don't return coordinates, but still return node ref which can be used to measure layout if needed
- coordinates calculations when navigating (`smartNavigate` in `SpatialNavigation.ts`)
- `navigateByDirection`
- focus propagation down the Tree
- last focused child feature
- preferred focus key feature

In other words, in the Native mode this library **DOES NOT** set the native focus anywhere via the native focus engine.
Native mode should be only used to keep the Tree of focusable components and to set the `focused` and `hasFocusedChild` flags to enable styling for focused components and containers.
In Native mode you can only call `focusSelf` in the component that gets **native** focus (via `onFocus` callback of the `Touchable` components) to flag it as `focused`.
Manual `setFocus` method is blocked because it will not propagate to the native focus engine and won't do anything.

##### `throttle`: integer (default: 0)
Enables throttling of the key event listener.

##### `throttleKeypresses`: boolean (default: false)
Works only in combination with `throttle` > 0. By default, `throttle` only throttles key down events (i.e. when you press and hold the button).
When this feature is enabled, it will also throttle rapidly fired key presses (rapid "key down + key up" events).

### `setKeyMap`
Method to set custom key codes. I.e. when the device key codes differ from a standard browser arrow key codes.
```jsx
setKeyMap({
  'left': 9001,
  'up': 9002,
  'right': 9003,
  'down': 9004,
  'enter': 9005
});
```

### `destroy`
Resets all the settings and the storage of focusable components. Disables the navigation service.

### `useFocusable` hook
#### Hook params
#### Hook output

# Technical details and concepts
## Tree Hierarchy of focusable components
As mentioned in the [Usage](#usage) section, all focusable components are organized in a Tree structure. Much like a DOM
tree, the Focusable Tree represents a focusable components' organization in your application. Tree Structure helps to
organize all the focusable areas in the application, measure them and determine the best paths of navigation between
these focusable areas. Without the Tree Structure (assuming all components would be simple Leaf focusable components) it
would be extremely hard to measure relative and absolute coordinates of the elements inside the scrolling lists, as well
as to restrict the focus from jumping outside certain areas. Technically the Focusable Tree structure is achieved by
passing a focus key of the parent component down via the `FocusContext`. Since React Context can be nested, you can have
multiple layers of focusable Containers, each passing their own `focusKey` down the Tree via `FocusContext.Provider` as
shown in [this example](#wrapping-leaf-components-with-a-focusable-container).

## Navigation Service
[Navigation Service](https://github.com/NoriginMedia/react-spatial-navigation/blob/master/src/SpatialNavigation.ts) is a
"brain" of the library. It is responsible for registering each focusable component in its internal database, storing
the node references to measure their coordinates and sizes, and listening to the key press events in order to perform
the navigation between these components. The calculation is performed according to the proprietary algorithm, which
measures the coordinate of the current component and all components in the direction of the navigation, and determines the
best path to pass the focus to the next component.

# Migration from v2 (HOC based) to v3 (Hook based)
## Reasons
## Challenges and Solutions
### Getting node reference
### Passing `parentFocusKey` down the tree
## Examples
### Migrating a [leaf](#making-your-component-focusable) focusable component
### Migrating a [container](#wrapping-leaf-components-with-a-focusable-container) focusable component

# Development
```bash
npm i
npm start
```

# Contributing
Please follow the [Contribution Guide](https://github.com/NoriginMedia/react-spatial-navigation/blob/master/CONTRIBUTING.md)

# License
**MIT Licensed**
