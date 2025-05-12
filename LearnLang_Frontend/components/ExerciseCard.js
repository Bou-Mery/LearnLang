// src/components/ExerciseCard.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const ExerciseCard = ({
  title,
  description,
  icon,
  type = 'pronunciation', // pronunciation, spelling, vocabulary
  level,
  duration,
  completed = false,
  onPress,
  style
}) => {
  
  const getIconName = () => {
    if (icon) return icon;
    
    switch(type) {
      case 'pronunciation':
        return 'mic-outline';
      case 'spelling':
        return 'create-outline';
      case 'vocabulary':
        return 'book-outline';
      default:
        return 'school-outline';
    }
  };
  
  const getIconColor = () => {
    switch(type) {
      case 'pronunciation':
        return '#FF6B6B';
      case 'spelling':
        return '#4F8EF7';
      case 'vocabulary':
        return '#4CAF50';
      default:
        return '#FFC107';
    }
  };
  
  return (
    <TouchableOpacity 
      style={[styles.container, completed && styles.completedCard, style]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={[styles.iconContainer, { backgroundColor: getIconColor() + '20' }]}>
        <Ionicons name={getIconName()} size={26} color={getIconColor()} />
      </View>
      
      <View style={styles.contentContainer}>
        <View style={styles.headerRow}>
          <Text style={styles.title} numberOfLines={1}>{title}</Text>
          {completed && (
            <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
          )}
        </View>
        
        {description && (
          <Text style={styles.description} numberOfLines={2}>
            {description}
          </Text>
        )}
        
        <View style={styles.footerRow}>
          {level && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Level {level}</Text>
            </View>
          )}
          
          {duration && (
            <View style={styles.durationContainer}>
              <Ionicons name="time-outline" size={14} color="#888" style={styles.durationIcon} />
              <Text style={styles.duration}>{duration}</Text>
            </View>
          )}
        </View>
      </View>
      
      <Ionicons name="chevron-forward" size={20} color="#888" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  completedCard: {
    opacity: 0.8,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  contentContainer: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    backgroundColor: '#E8F1FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 10,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#4F8EF7',
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  durationIcon: {
    marginRight: 4,
  },
  duration: {
    fontSize: 12,
    color: '#888',
  }
});

export default ExerciseCard;