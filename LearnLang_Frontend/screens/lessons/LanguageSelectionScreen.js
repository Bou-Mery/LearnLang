import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const LanguageSelectionScreen = ({ navigation }) => {
  const languages = ['English', 'Arabic', 'French'];

  const selectLanguage = (language) => {
    navigation.navigate('Spelling', { level: language });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.header}>
        <Text style={styles.title}>Select a Language</Text>
        <Text style={styles.subtitle}>Choose a language to start the spelling quiz</Text>
      </View>
      <View style={styles.languageContainer}>
        {languages.map((language) => (
          <TouchableOpacity
            key={language}
            style={styles.languageButton}
            onPress={() => selectLanguage(language)}
          >
            <Ionicons name="globe-outline" size={24} color="#fff" />
            <Text style={styles.languageText}>{language}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    padding: 20,
    backgroundColor: '#4F8EF7',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 5,
  },
  languageContainer: {
    padding: 20,
  },
  languageButton: {
    flexDirection: 'row',
    backgroundColor: '#4F8EF7',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  languageText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 10,
  },
});

export default LanguageSelectionScreen;