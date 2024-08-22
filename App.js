import React, { useEffect } from "react";
import { LogBox } from 'react-native';
import Navigation from './navigation/index';

export default function App() {
  // Temporary
  useEffect(() => {
    LogBox.ignoreLogs([
      'In React 18, SSRProvider is not necessary and is a noop. You can remove it from your app.',
      'Non-serializable values were found in the navigation state. Check:',
      'Each child in a list should have a unique "key" prop',
    ]);
  }, []);
  return (
    <Navigation/>
  );
}