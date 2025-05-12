// src/components/Header.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Header = ({ 
  title, 
  subtitle, 
  leftIcon = 'arrow-back',
  rightIcon,
  onLeftPress,
  onRightPress,
  style,
  titleStyle,
  subtitleStyle,
  transparent = false,
}) => {
  
  return (
    <View style={[
      styles.container, 
      transparent ? styles.transparent : styles.solid,
      style
    ]}>
      {onLeftPress && (
        <TouchableOpacity style={styles.iconButton} onPress={onLeftPress}>
          <Ionicons name={leftIcon} size={24} color={transparent ? '#fff' : '#333'} />
        </TouchableOpacity>
      )}
      
      <View style={styles.titleContainer}>
        {title && (
          <Text 
            style={[
              styles.title, 
              transparent ? styles.whiteText : {}, 
              titleStyle
            ]}
            numberOfLines={1}
          >
            {title}
          </Text>
        )}
        
        {subtitle && (
          <Text 
            style={[
              styles.subtitle, 
              transparent ? styles.lightText : {}, 
              subtitleStyle
            ]}
            numberOfLines={1}
          >
            {subtitle}
          </Text>
        )}
      </View>
      
      {rightIcon && onRightPress ? (
        <TouchableOpacity style={styles.iconButton} onPress={onRightPress}>
          <Ionicons name={rightIcon} size={24} color={transparent ? '#fff' : '#333'} />
        </TouchableOpacity>
      ) : (
        <View style={styles.placeholder} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    height: 56,
  },
  solid: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  transparent: {
    backgroundColor: 'transparent',
  },
  titleContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  whiteText: {
    color: '#fff',
  },
  subtitle: {
    fontSize: 14,
    color: '#888',
    marginTop: 2,
  },
  lightText: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  iconButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  placeholder: {
    width: 40,
  }
});

export default Header;