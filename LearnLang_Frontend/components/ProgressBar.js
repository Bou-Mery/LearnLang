// src/components/ProgressBar.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ProgressBar = ({
  progress, // Value between 0 and 1
  height = 8,
  backgroundColor = '#E1E1E1',
  fillColor = '#4F8EF7',
  animated = true,
  showPercentage = false,
  percentagePosition = 'right', // 'right', 'center', 'above'
  style,
  percentageStyle,
}) => {
  const width = Math.max(0, Math.min(1, progress)) * 100;
  
  const renderPercentage = () => {
    if (!showPercentage) return null;
    
    const percentage = Math.round(progress * 100);
    
    if (percentagePosition === 'above') {
      return (
        <Text style={[styles.percentageAbove, percentageStyle]}>
          {percentage}%
        </Text>
      );
    }
    
    return (
      <Text style={[
        styles.percentage, 
        percentagePosition === 'center' ? styles.percentageCenter : styles.percentageRight,
        percentageStyle
      ]}>
        {percentage}%
      </Text>
    );
  };
  
  return (
    <View style={[styles.container, style]}>
      {percentagePosition === 'above' && renderPercentage()}
      
      <View style={[styles.background, { height, backgroundColor }]}>
        <View 
          style={[
            styles.fill, 
            { 
              width: `${width}%`, 
              backgroundColor: fillColor,
              height: '100%'
            },
            animated && styles.animated
          ]} 
        />
        
        {(percentagePosition === 'right' || percentagePosition === 'center') && renderPercentage()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  background: {
    borderRadius: 4,
    overflow: 'hidden',
    position: 'relative',
  },
  fill: {
    position: 'absolute',
    left: 0,
    top: 0,
  },
  animated: {
    transition: 'width 0.5s ease',
  },
  percentage: {
    position: 'absolute',
    top: 0,
    fontSize: 12,
    fontWeight: 'bold',
    color: '#555',
  },
  percentageRight: {
    right: -40,
  },
  percentageCenter: {
    alignSelf: 'center',
    textAlign: 'center',
    width: '100%',
  },
  percentageAbove: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#555',
    marginBottom: 5,
    textAlign: 'right',
  }
});

export default ProgressBar;