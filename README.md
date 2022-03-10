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
## Making your [leaf](#leaf-component) component focusable
## Wrapping [leaf](#leaf-component) components with a focusable [container](#container-component)
## Manually setting the focus
## Tracking children components
## Restricting focus to a certain component boundaries
## Using the library in React Native environment

# API
## Top Level exports
## `useFocusable` hook
### Hook params
### Hook output

# Technical details and concepts
## Focusable components
### Tree of focusable components
### Leaf component
### Container component
## Navigation Service
### Purpose of the navigation service
### Coordinates calculation

# Migration from v2 (HOC based) to v3 (Hook based)
## Reasons
## Challenges and Solutions
### Getting node reference
### Passing `parentFocusKey` down the tree
## Examples
### Migrating a [leaf](#leaf-component) focusable component
### Migrating a [container](#container-component) focusable component

# Development
```bash
npm i
npm start
```

# Contributing
Please follow the [Contribution Guide](https://github.com/NoriginMedia/react-spatial-navigation/blob/master/CONTRIBUTING.md)

# License
**MIT Licensed**
