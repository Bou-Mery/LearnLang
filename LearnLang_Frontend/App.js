import React from 'react';
import { StatusBar } from 'react-native';
import { AuthProvider } from './context/AuthContext';
import AppNavigator from './navigation';

// Create a directory for temporary audio files
import * as FileSystem from 'expo-file-system';
const tempDir = FileSystem.documentDirectory + 'temp/';
FileSystem.makeDirectoryAsync(tempDir, { intermediates: true })
  .catch(e => console.log('Temp directory may already exist'));

export default function App() {
  return (
    <AuthProvider>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <AppNavigator />
    </AuthProvider>
  );
}