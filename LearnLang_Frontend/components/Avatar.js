// src/components/Avatar.js
import React from 'react';
import { Image, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Avatar = ({
  source,
  name,
  size = 'medium', // small, medium, large
  showEditButton = false,
  onPress,
  onEditPress,
  style
}) => {
  const getSize = () => {
    switch(size) {
      case 'small':
        return 40;
      case 'large':
        return 80;
      case 'medium':
      default:
        return 50;
    }
  };
  
  const getFontSize = () => {
    switch(size) {
      case 'small':
        return 14;
      case 'large':
        return 24;
      case 'medium':
      default:
        return 18;
    }
  };
  
  const avatarSize = getSize();
  const fontSize = getFontSize();
  
  // If no image source provided, display initials
  const getInitials = () => {
    if (!name) return '';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  const AvatarComponent = onPress ? TouchableOpacity : View;
  
  return (
    <View style={[styles.container, style]}>
      <AvatarComponent 
        style={[
          styles.avatar, 
          { 
            width: avatarSize, 
            height: avatarSize,
            borderRadius: avatarSize / 2 
          }
        ]} 
        onPress={onPress}
        activeOpacity={0.8}
      >
        {source ? (
          <Image 
            source={typeof source === 'string' ? { uri: source } : source}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.initialsContainer, { backgroundColor: '#4F8EF7' }]}>
            <Text style={[styles.initials, { fontSize }]}>
              {getInitials()}
            </Text>
          </View>
        )}
      </AvatarComponent>
      
      {showEditButton && (
        <TouchableOpacity 
          style={[
            styles.editButton, 
            { 
              width: avatarSize / 3, 
              height: avatarSize / 3,
              borderRadius: avatarSize / 6,
              right: 0,
              bottom: 0
            }
          ]}
          onPress={onEditPress || onPress}
        >
          <Ionicons name="camera" size={avatarSize / 5} color="#fff" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
});