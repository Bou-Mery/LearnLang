import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ActivityIndicator,
  Alert,
  ScrollView
} from 'react-native';
import axios from 'axios';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as FileSystem from 'expo-file-system';
import { Audio } from 'expo-av';
import * as Speech from 'expo-speech';

const PronunciationScreen = ({ route, navigation }) => {
  const { level } = route.params || { level: 1 };
  const [isLoading, setIsLoading] = useState(true);
  const [quizList, setQuizList] = useState([]);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [recording, setRecording] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingURI, setRecordingURI] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [sound, setSound] = useState(null);
  // Map numeric level to language name
  const mapLevelToLanguage = (levelNum) => {
    const levelMap = {
      1: 'English',
      2: 'Arabic',
      3: 'French'
    };
    return levelMap[levelNum] || 'English';
  };

  useEffect(() => {
    fetchPronunciationQuizzes();
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [level]);

  const fetchPronunciationQuizzes = async () => {
    try {
      const language = mapLevelToLanguage(level);
      console.log('Fetching quizzes for:', language);
      
      const response = await axios.get(
        `http://192.168.11.104:5000/pronunciationListByLevel/${language}`
      );
      
      if (response.data.status === 'Success') {
        setQuizList(response.data.row);
        if (response.data.row.length > 0) {
          setCurrentQuiz(response.data.row[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching quizzes:', error);
      Alert.alert('Error', 'Could not load pronunciation exercises');
    } finally {
      setIsLoading(false);
    }
  };

  const speakText = () => {
    if (currentQuiz) {
      // Determine language for speech synthesis
      let lang = 'en-US';
      const currentLanguage = mapLevelToLanguage(level);
      
      if (currentLanguage === 'Arabic') lang = 'ar-SA';
      if (currentLanguage === 'French') lang = 'fr-FR';
      
      Speech.speak(currentQuiz.text, {
        language: lang,
        pitch: 1,
        rate: 0.8
      });
    }
  };

  const startRecording = async () => {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
      );
      
      setRecording(recording);
      setIsRecording(true);
    } catch (error) {
      console.error('Failed to start recording:', error);
      Alert.alert('Error', 'Failed to start recording');
    }
  };

  const stopRecording = async () => {
    if (!recording) return;

    setIsRecording(false);
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    setRecordingURI(uri);
    setRecording(null);
  };

  const playRecording = async () => {
    if (!recordingURI) return;

    try {
      const { sound } = await Audio.Sound.createAsync({ uri: recordingURI });
      setSound(sound);
      await sound.playAsync();
    } catch (error) {
      console.error('Failed to play recording:', error);
      Alert.alert('Error', 'Failed to play recording');
    }
  };
  const submitRecording = async () => {
    if (!recordingURI || !currentQuiz) return;

    setIsSubmitting(true);
    try {
      // Create form data for file upload
      const formData = new FormData();
      const fileInfo = await FileSystem.getInfoAsync(recordingURI);
      
      formData.append('file', {
        uri: recordingURI,
        name: 'recording.wav',
        type: 'audio/wav'
      });

      // Send recording to backend for evaluation
      
      const response = await axios.post(
        `http://192.168.11.104:5000/checkPronunciation/${currentQuiz.id}`, 
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.data.status) {
        setResult({
          status: response.data.status,
          recognized_text: response.data.recognized_text,
          expected_text: currentQuiz.text
        });
      }
    } catch (error) {
      console.error('Error submitting recording:', error);
      Alert.alert('Error', 'Failed to submit recording for evaluation');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetExercise = () => {
    setRecordingURI(null);
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
        'You have completed all pronunciation exercises for this level!',
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
        <Text style={styles.title}>Pronunciation Practice</Text>
        <Text style={styles.subtitle}>Level {level}</Text>
      </View>

      {currentQuiz ? (
        <View style={styles.quizContainer}>
          <View style={styles.textContainer}>
            <Text style={styles.pronounceText}>{currentQuiz.text}</Text>
            <TouchableOpacity onPress={speakText} style={styles.listenButton}>
              <Ionicons name="volume-high" size={24} color="#fff" />
              <Text style={styles.listenButtonText}>Listen</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.controlsContainer}>
            {!isRecording ? (
              <TouchableOpacity 
                onPress={startRecording} 
                style={[styles.recordButton, recordingURI && styles.buttonDisabled]}
                disabled={!!recordingURI}
              >
                <Ionicons name="mic" size={32} color="#fff" />
                <Text style={styles.buttonText}>Start Recording</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={stopRecording} style={[styles.recordButton, styles.stopButton]}>
                <Ionicons name="stop-circle" size={32} color="#fff" />
                <Text style={styles.buttonText}>Stop Recording</Text>
              </TouchableOpacity>
            )}

            {recordingURI && !result && (
              <View style={styles.recordingActions}>
                <TouchableOpacity onPress={playRecording} style={styles.actionButton}>
                  <Ionicons name="play" size={24} color="#4F8EF7" />
                  <Text style={styles.actionText}>Play</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={resetExercise} style={styles.actionButton}>
                  <Ionicons name="refresh" size={24} color="#4F8EF7" />
                  <Text style={styles.actionText}>Reset</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  onPress={submitRecording} 
                  style={[styles.submitButton, isSubmitting && styles.buttonDisabled]}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <>
                      <Ionicons name="checkmark-circle" size={24} color="#fff" />
                      <Text style={styles.submitButtonText}>Submit</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            )}
          </View>

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
                  <Text style={styles.resultLabel}>Expected:</Text>
                  <Text style={styles.resultText}>{result.expected_text}</Text>
                </View>
                
                <View style={styles.resultRow}>
                  <Text style={styles.resultLabel}>Recognized:</Text>
                  <Text style={styles.resultText}>{result.recognized_text || '(Could not recognize speech)'}</Text>
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
          <Text style={styles.emptyText}>No pronunciation exercises available for this level</Text>
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
  textContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  pronounceText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
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
    alignSelf: 'center',
  },
  listenButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  controlsContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  recordButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF6B6B',
    borderRadius: 30,
    paddingHorizontal: 30,
    paddingVertical: 15,
    width: '80%',
  },
  stopButton: {
    backgroundColor: '#FF4949',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 10,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  recordingActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
  },
  actionButton: {
    alignItems: 'center',
    padding: 10,
  },
  actionText: {
    color: '#4F8EF7',
    marginTop: 5,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 5,
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

export default PronunciationScreen;