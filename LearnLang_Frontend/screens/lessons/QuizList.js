// screens/lessons/QuizList.js
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import axios from 'axios';

const QuizList = ({ route, navigation }) => {
  const { language } = route.params;
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Call your backend API to get quizzes by language
    axios
      .get(`http://192.168.11.104:5000/pronunciationListByLevel/${encodeURIComponent(language)}`)
      .then((res) => {
        if (res.data.status === 'Success') {
          setQuizzes(res.data.row);
        } else {
          alert('No exercises found for this language.');
        }
      })
      .catch((error) => {
        console.error(error);
        alert('Error fetching data.');
      })
      .finally(() => setLoading(false));
  }, [language]);

  if (loading) return <ActivityIndicator size="large" style={{ flex:1, justifyContent:'center', alignItems:'center' }} />;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Words in {language}</Text>
      {quizzes.length === 0 ? (
        <Text style={styles.noData}>No words available.</Text>
      ) : (
        <FlatList
          data={quizzes}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.item}
onPress={() => navigation.navigate('Pronunciation', { quiz: item })}
            >
              <Text style={styles.word}>{item.text}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  header: { fontSize: 22, marginBottom: 20, fontWeight: 'bold' },
  noData: { textAlign: 'center', marginTop: 50, fontSize: 16 },
  item: {
    padding: 15,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  word: { fontSize: 18 },
});

export default QuizList;