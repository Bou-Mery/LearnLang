// src/components/Loading.js
import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';

const Loading = ({ 
  size = 'large', 
  color = '#4F8EF7', 
  message, 
  fullScreen = false,
  overlay = false,
  style
}) => {
  if (fullScreen || overlay) {
    return (
      <View style={[
        styles.fullScreenContainer, 
        overlay ? styles.overlay : {},
        style
      ]}>
        <ActivityIndicator size={size} color={color} />
        {message && <Text style={styles.message}>{message}</Text>}
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      <ActivityIndicator size={size} color={color} />
      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    zIndex: 999,
  },
  message: {
    marginTop: 10,
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
  }
});

export default Loading;