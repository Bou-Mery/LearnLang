// src/components/Button.js
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';

const Button = ({ 
  title, 
  onPress, 
  type = 'primary', // primary, secondary, outline
  size = 'medium', // small, medium, large
  disabled = false,
  loading = false,
  icon = null,
  style = {},
  textStyle = {}
}) => {
  
  const getButtonStyle = () => {
    let buttonStyle = [styles.button];
    
    // Button type
    if (type === 'primary') {
      buttonStyle.push(styles.primaryButton);
    } else if (type === 'secondary') {
      buttonStyle.push(styles.secondaryButton);
    } else if (type === 'outline') {
      buttonStyle.push(styles.outlineButton);
    }
    
    // Button size
    if (size === 'small') {
      buttonStyle.push(styles.smallButton);
    } else if (size === 'large') {
      buttonStyle.push(styles.largeButton);
    }
    
    // Disabled state
    if (disabled || loading) {
      buttonStyle.push(styles.disabledButton);
    }
    
    // Custom style
    buttonStyle.push(style);
    
    return buttonStyle;
  };
  
  const getTextStyle = () => {
    let btnTextStyle = [styles.buttonText];
    
    if (type === 'outline') {
      btnTextStyle.push(styles.outlineButtonText);
    }
    
    if (size === 'small') {
      btnTextStyle.push(styles.smallButtonText);
    } else if (size === 'large') {
      btnTextStyle.push(styles.largeButtonText);
    }
    
    // Custom text style
    btnTextStyle.push(textStyle);
    
    return btnTextStyle;
  };
  
  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={type === 'outline' ? '#4F8EF7' : '#FFFFFF'} />
      ) : (
        <>
          {icon}
          <Text style={getTextStyle()}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  primaryButton: {
    backgroundColor: '#4F8EF7',
  },
  secondaryButton: {
    backgroundColor: '#6c757d',
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#4F8EF7',
  },
  smallButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  largeButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
  outlineButtonText: {
    color: '#4F8EF7',
  },
  smallButtonText: {
    fontSize: 14,
  },
  largeButtonText: {
    fontSize: 18,
  }
});

export default Button;