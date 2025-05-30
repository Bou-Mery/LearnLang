import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ActivityIndicator,
  Alert,
  ScrollView,
  TextInput,
} from 'react-native';
import axios from 'axios';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as Speech from 'expo-speech';

const SpellingScreen = ({ route, navigation }) => {
  const { level } = route.params || { level: 1 };
  const [isLoading, setIsLoading] = useState(true);
  const [quizList, setQuizList] = useState([]);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [userInput, setUserInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    fetchSpellingQuizzes();
  }, [level]);

  const fetchSpellingQuizzes = async () => {
    try {
      const response = await axios.get(`http://192.168.11.104:5000/spellingListByLevel/${level}`);
      if (response.data.status === 'Success') {
        setQuizList(response.data.row);
        // Set the first quiz as current if available
        if (response.data.row.length > 0) {
          setCurrentQuiz(response.data.row[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching quizzes:', error);
      Alert.alert('Error', 'Could not load spelling exercises');
    } finally {
      setIsLoading(false);
    }
  };

  const speakText = () => {
    if (currentQuiz) {
      Speech.speak(currentQuiz.text, {
        language: 'en-US',
        pitch: 1,
        rate: 0.8
      });
    }
  };

  const submitSpelling = async () => {
    if (!userInput.trim() || !currentQuiz) return;

    setIsSubmitting(true);
    try {
      // Compare user input with the correct text
      const isCorrect = userInput.trim().toLowerCase() === currentQuiz.text.toLowerCase();
      
      // In a real app, you would submit to your API for more complex checking
      // For now, we'll just simulate the result
      
      setResult({
        status: isCorrect ? 'Perfect' : 'Not Bad',
        userInput: userInput.trim(),
        correctText: currentQuiz.text
      });

      // If we had a backend submission, it would look something like this:
      /*
      const formData = new FormData();
      formData.append('text', userInput.trim());

      const response = await axios.post(
        `http://YOUR_API_URL/checkSpelling/${currentQuiz.id}`,
        formData
      );

      if (response.data.status) {
        setResult({
          status: response.data.status,
          userInput: userInput.trim(),
          correctText: currentQuiz.text
        });
      }
      */
    } catch (error) {
      console.error('Error submitting spelling:', error);
      Alert.alert('Error', 'Failed to check spelling');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetExercise = () => {
    setUserInput('');
    setResult(null);
  };

  const moveToNextQuiz = () => {
    const currentIndex = quizList.findIndex(quiz => quiz.id === currentQuiz.id);
    if (currentIndex < quizList.length - 1) {
      setCurrentQuiz(quizList[currentIndex + 1]);
      resetExercise();
    } else {
      // If it's the last quiz, show completion message
      Alert.alert(
        'Level Completed', 
        'You have completed all spelling exercises for this level!',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4F8EF7" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Spelling Practice</Text>
        <Text style={styles.subtitle}>Level {level}</Text>
      </View>

      {currentQuiz ? (
        <View style={styles.quizContainer}>
          <View style={styles.instructionContainer}>
            <Text style={styles.instruction}>Listen and type what you hear</Text>
            <TouchableOpacity onPress={speakText} style={styles.listenButton}>
              <Ionicons name="volume-high" size={24} color="#fff" />
              <Text style={styles.listenButtonText}>Listen</Text>
            </TouchableOpacity>
          </View>

          {!result && (
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                placeholder="Type what you hear..."
                value={userInput}
                onChangeText={setUserInput}
                autoCapitalize="none"
                autoCorrect={false}
              />
              
              <TouchableOpacity 
                onPress={submitSpelling} 
                style={[styles.submitButton, (!userInput.trim() || isSubmitting) && styles.buttonDisabled]}
                disabled={!userInput.trim() || isSubmitting}
              >
                {isSubmitting ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <>
                    <Ionicons name="checkmark-circle" size={24} color="#fff" />
                    <Text style={styles.submitButtonText}>Check Answer</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          )}

          {result && (
            <View style={styles.resultContainer}>
              <View style={[
                styles.resultHeader, 
                result.status === 'Perfect' ? styles.perfectResult : styles.notBadResult
              ]}>
                <Ionicons 
                  name={result.status === 'Perfect' ? 'checkmark-circle' : 'alert-circle'} 
                  size={28} 
                  color="#fff" 
                />
                <Text style={styles.resultStatus}>{result.status}</Text>
              </View>
              
              <View style={styles.resultDetails}>
                <View style={styles.resultRow}>
                  <Text style={styles.resultLabel}>Correct spelling:</Text>
                  <Text style={styles.resultText}>{result.correctText}</Text>
                </View>
                
                <View style={styles.resultRow}>
                  <Text style={styles.resultLabel}>Your answer:</Text>
                  <Text style={styles.resultText}>{result.userInput}</Text>
                </View>
                
                <TouchableOpacity onPress={moveToNextQuiz} style={styles.nextButton}>
                  <Text style={styles.nextButtonText}>Next Exercise</Text>
                  <Ionicons name="arrow-forward" size={20} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="sad-outline" size={64} color="#ccc" />
          <Text style={styles.emptyText}>No spelling exercises available for this level</Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  quizContainer: {
    padding: 20,
  },
  instructionContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  instruction: {
    fontSize: 18,
    color: '#333',
    marginBottom: 20,
  },
  listenButton: {
    flexDirection: 'row',
    backgroundColor: '#4F8EF7',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listenButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  inputContainer: {
    marginTop: 20,
  },
  textInput: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 20,
  },
  submitButton: {
    flexDirection: 'row',
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    paddingVertical: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 10,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  resultContainer: {
    marginTop: 30,
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
  },
  perfectResult: {
    backgroundColor: '#4CAF50',
  },
  notBadResult: {
    backgroundColor: '#FFC107',
  },
  resultStatus: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  resultDetails: {
    padding: 20,
  },
  resultRow: {
    marginBottom: 15,
  },
  resultLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#555',
    marginBottom: 5,
  },
  resultText: {
    fontSize: 16,
    color: '#333',
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 5,
  },
  nextButton: {
    flexDirection: 'row',
    backgroundColor: '#4F8EF7',
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 25,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 20,
  },
  nextButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginRight: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default SpellingScreen;