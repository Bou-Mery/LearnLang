    // screens/lessons/LanguageSelection.js
    import React from 'react';
    import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

    const LanguageSelection = ({ navigation }) => {
    const handleSelect = (language) => {
        // Navigate to QuizList with selected language
        navigation.navigate('QuizList', { language });
    };

    return (
        <View style={styles.container}>
        <Text style={styles.title}>Choose a Language</Text>
        {['English', 'Arabic', 'French'].map((lang) => (
            <TouchableOpacity
            key={lang}
            style={styles.button}
            onPress={() => handleSelect(lang)}
            >
            <Text style={styles.buttonText}>{lang}</Text>
            </TouchableOpacity>
        ))}
        </View>
    );
    };

    const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        marginBottom: 30,
    },
    button: {
        padding: 15,
        marginVertical: 10,
        backgroundColor: '#4F8EF7',
        borderRadius: 10,
        width: '70%',
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
    },
    });

    export default LanguageSelection;