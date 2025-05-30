import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
  Platform,
} from 'react-native';
import axios from 'axios';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Audio } from 'expo-av';
import { useFocusEffect } from '@react-navigation/native';

const SpellingScreen = ({ route, navigation }) => {
  const { level } = route.params || {};
  const [isLoading, setIsLoading] = useState(true);
  const [phrases, setPhrases] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [recording, setRecording] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [result, setResult] = useState(null);
  const [score, setScore] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const totalPhrases = 5;

  useEffect(() => {
    if (!level) {
      Alert.alert('Error', 'No language selected', [
        { text: 'OK', onPress: () => navigation.navigate('LanguageSelectionScreen') }
      ]);
    }
    async function requestPermissions() {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Microphone access is required to record audio.');
      }
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
    }
    requestPermissions();
  }, [level, navigation]);

  const fetchPhrases = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`http://192.168.11.104:5000/spellingPhrases/${encodeURIComponent(level)}`);
      if (response.data.status === 'Success') {
        setPhrases(response.data.rows);
        setCurrentIndex(0);
        setScore(0);
        setResult(null);
      } else {
        setPhrases([]); // Display empty state message
      }
    } catch (error) {
      console.error('Error fetching phrases:', error);
      setPhrases([]); // Display empty state message
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      if (level) {
        fetchPhrases();
      }
    }, [level])
  );

  const startRecording = async () => {
    try {
      const { recording } = await Audio.Recording.createAsync(
        Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
      );
      setRecording(recording);
      setIsRecording(true);
    } catch (err) {
      console.error('Failed to start recording:', err);
      Alert.alert('Error', 'Could not start recording');
    }
  };

  const stopRecording = async () => {
    try {
      await recording.stopAndUnloadAsync();
      setIsRecording(false);
      const uri = recording.getURI();
      setRecording(null);
      await submitSpelling(uri);
    } catch (err) {
      console.error('Failed to stop recording:', err);
      Alert.alert('Error', 'Could not stop recording');
      setIsRecording(false);
      setRecording(null);
    }
  };

  const submitSpelling = async (uri) => {
    if (!uri || !phrases[currentIndex]) return;

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('file', {
        uri: Platform.OS === 'android' ? uri : uri.replace('file://', ''),
        name: `recording-${Date.now()}.wav`,
        type: 'audio/wav',
      });
      formData.append('language', level);

      const response = await axios.post(
        `http://192.168.11.104:5000/checkSpelling/${phrases[currentIndex].id}`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      if (response.data.status) {
        const resultStatus = response.data.status;
        setResult({
          status: resultStatus,
          recognizedText: response.data.recognized_text,
          correctText: response.data.text,
        });
        const points = resultStatus === 'Perfect' ? 2 : 1;
        setScore((prevScore) => prevScore + points);
      } else {
        Alert.alert('Error', 'Failed to check spelling');
      }
    } catch (error) {
      console.error('Error submitting spelling:', error);
      Alert.alert('Error', 'Could not submit spelling');
    } finally {
      setIsSubmitting(false);
    }
  };

  const moveToNextPhrase = () => {
    if (currentIndex < totalPhrases - 1) {
      setCurrentIndex(currentIndex + 1);
      setResult(null);
    } else {
      Alert.alert(
        'Quiz Completed',
        `You scored ${score} out of ${totalPhrases * 2} points!`,
        [
          { text: 'Restart', onPress: fetchPhrases },
          { text: 'Back', onPress: () => navigation.navigate('LanguageSelectionScreen') },
        ]
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

  const currentPhrase = phrases[currentIndex];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.header}>
        <Text style={styles.title}>Spelling Quiz</Text>
        <Text style={styles.subtitle}>Language: {level}</Text>
      </View>

      {phrases.length > 0 && currentPhrase ? (
        <View style={styles.quizContainer}>
          <View style={styles.progressContainer}>
            <Text style={styles.progress}>
              Phrase {currentIndex + 1} of {totalPhrases}
            </Text>
            <Text style={[styles.scoreText, { color: '#4CAF50' }]}>Current Score: {score}</Text>
          </View>

          <View style={styles.phraseContainer}>
            <Text style={styles.phraseText}>{currentPhrase.text}</Text>
          </View>

          {!result && (
            <View style={styles.recordContainer}>
              <TouchableOpacity
                onPress={isRecording ? stopRecording : startRecording}
                style={[styles.recordButton, isRecording && styles.recordingButton]}
                disabled={isSubmitting}
              >
                <Ionicons
                  name={isRecording ? 'stop-circle' : 'mic-circle'}
                  size={24}
                  color="#fff"
                />
                <Text style={styles.recordButtonText}>
                  {isRecording ? 'Stop Recording' : 'Record Spelling'}
                </Text>
              </TouchableOpacity>

              {isSubmitting && (
                <ActivityIndicator size="large" color="#4F8EF7" style={styles.activityIndicator} />
              )}
            </View>
          )}

          {result && (
            <View style={styles.resultContainer}>
              <View
                style={[
                  styles.resultHeader,
                  result.status === 'Perfect' ? styles.perfectResult : styles.notBadResult,
                ]}
              >
                <Ionicons
                  name={result.status === 'Perfect' ? 'checkmark-circle' : 'alert-circle'}
                  size={24}
                  color="#fff"
                />
                <Text style={styles.resultStatus}>{result.status}</Text>
              </View>

              <View style={styles.resultDetails}>
                <View style={styles.resultRow}>
                  <Text style={styles.resultLabel}>Correct Phrase:</Text>
                  <Text style={styles.resultText}>{result.correctText}</Text>
                </View>
                <View style={styles.resultRow}>
                  <Text style={styles.resultLabel}>Recognized:</Text>
                  <Text style={styles.resultText}>{result.recognizedText || 'N/A'}</Text>
                </View>
                <View style={styles.resultRow}>
                  <Text style={styles.resultLabel}>Points Earned:</Text>
                  <Text style={styles.resultText}>
                    {result.status === 'Perfect' ? '2' : '1'}
                  </Text>
                </View>

                <TouchableOpacity onPress={moveToNextPhrase} style={styles.nextButton}>
                  <Text style={styles.nextButtonText}>
                    {currentIndex < totalPhrases - 1 ? 'Next Phrase' : 'Finish Quiz'}
                  </Text>
                  <Ionicons name="arrow-forward" size={20} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="sad-outline" size={64} color="#ccc" />
          <Text style={styles.emptyText}>
            No phrases available for this language. Please try another language.
          </Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.navigate('LanguageSelectionScreen')}
          >
            <Text style={styles.backButtonText}>Choose Another Language</Text>
          </TouchableOpacity>
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
  quizContainer: {
    padding: 20,
  },
  progressContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  progress: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  scoreText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 5,
  },
  phraseContainer: {
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
  phraseText: {
    fontSize: 20,
    color: '#333',
    textAlign: 'center',
  },
  recordContainer: {
    alignItems: 'center',
  },
  recordButton: {
    flexDirection: 'row',
    backgroundColor: '#4F8EF7',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  recordingButton: {
    backgroundColor: '#FF3D00',
  },
  recordButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 10,
  },
  activityIndicator: {
    marginTop: 10,
  },
  resultContainer: {
    marginTop: 20,
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
    marginLeft: 15,
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
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 25,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  nextButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginRight: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: '#4F8EF7',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  backButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default SpellingScreen;