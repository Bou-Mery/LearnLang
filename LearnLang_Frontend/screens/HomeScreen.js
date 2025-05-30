import React, { useState, useEffect, useContext } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Image,
  ActivityIndicator,
  FlatList
} from 'react-native';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import ProgressBar from 'react-native-progress/Bar';
import Ionicons from 'react-native-vector-icons/Ionicons';

const HomeScreen = ({ navigation }) => {
  const { userInfo } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(true);
  const [articles, setArticles] = useState([]);
  const [userProgress, setUserProgress] = useState(0.3); 

  useEffect(() => {
    fetchArticles();
  }, []);

const fetchArticles = async () => {
  try {
    const response = await axios.get('http://192.168.11.104:5000/listArticle');
    
    // Check both possible response formats
    let articlesData = [];
    if (response.data.rows) {
      articlesData = response.data.rows;
    } else if (response.data.row) {
      articlesData = Array.isArray(response.data.row) 
        ? response.data.row 
        : [response.data.row];
    }
    
    setArticles(articlesData.slice(0, 3));
  } catch (error) {
    console.error('Error fetching articles:', error);
  } finally {
    setIsLoading(false);
  }
};

  // Card component for lessons/activities
  const ActivityCard = ({ title, description, icon, onPress, level }) => (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.cardHeader}>
        <Ionicons name={icon} size={24} color="#4F8EF7" />
        {level && <Text style={styles.levelBadge}>Level {level}</Text>}
      </View>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardDescription}>{description}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Header with user info */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello, {userInfo?.name || 'User'}!</Text>
          <Text style={styles.subtitle}>Ready to continue learning?</Text>
        </View>
        <Image 
          source={userInfo?.image ? { uri: userInfo.image } : require('../assets/logo.png')} 
          style={styles.avatar}
        />
      </View>
      
      {/* Progress section */}
      <View style={styles.progressContainer}>
        <Text style={styles.sectionTitle}>Your Progress</Text>
        <ProgressBar 
          progress={userProgress} 
          width={null} 
          color="#4F8EF7" 
          unfilledColor="#E1E1E1" 
          borderWidth={0}
          height={10}
          borderRadius={5}
        />
        <View style={styles.progressDetails}>
          <Text style={styles.progressText}>Level 1</Text>
          <Text style={styles.progressPercentage}>{Math.floor(userProgress * 100)}%</Text>
        </View>
      </View>
      
      {/* Activities section */}
      <Text style={styles.sectionTitle}>Continue Learning</Text>
      <View style={styles.cardsContainer}>
        <ActivityCard 
          title="Pronunciation Practice" 
          description="Improve your accent with voice exercises" 
          icon="mic-outline"
                    level="1"

          onPress={() => navigation.navigate('Lessons')}

        />
        
        <ActivityCard 
          title="Spelling Quiz" 
          description="Test your spelling skills" 
          icon="create-outline"
          level="1"
          onPress={() => navigation.navigate('Lessons', { 
            screen: 'Spelling', 
            params: { level: 1 } 
          })}
        />
      </View>
      
      {/* Articles section */}
      <Text style={styles.sectionTitle}>Featured Articles</Text>
      {isLoading ? (
        <ActivityIndicator size="large" color="#4F8EF7" style={styles.loader} />
      ) : (
        <FlatList
          data={articles}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.articleCard}
              onPress={() => navigation.navigate('ArticleDetail', { articleId: item.id })}
            >
              <Image 
                source={require('../assets/logo.png')} 
                style={styles.articleImage}
              />
              <View style={styles.articleContent}>
                <Text style={styles.articleTitle} numberOfLines={2}>
                  {item.title}
                </Text>
                <Text style={styles.articleDescription} numberOfLines={3}>
                  {item.description || "Learn more about language learning techniques and tips."}
                </Text>
              </View>
            </TouchableOpacity>
          )}
          style={styles.articlesList}
          contentContainerStyle={styles.articlesListContent}
        />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#888',
    marginTop: 5,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#ddd',
  },
  progressContainer: {
    backgroundColor: '#fff',
    padding: 20,
    margin: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginHorizontal: 15,
    marginTop: 20,
    marginBottom: 10,
  },
  progressDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  progressText: {
    color: '#888',
    fontSize: 14,
  },
  progressPercentage: {
    color: '#4F8EF7',
    fontSize: 14,
    fontWeight: 'bold',
  },
  cardsContainer: {
    padding: 15,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  levelBadge: {
    backgroundColor: '#E8F1FF',
    color: '#4F8EF7',
    fontSize: 12,
    fontWeight: 'bold',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  cardDescription: {
    fontSize: 14,
    color: '#888',
  },
  loader: {
    marginTop: 20,
  },
  articlesList: {
    paddingLeft: 15,
  },
  articlesListContent: {
    paddingRight: 15,
  },
  articleCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    width: 250,
    marginRight: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  articleImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  articleContent: {
    padding: 15,
  },
  articleTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  articleDescription: {
    fontSize: 14,
    color: '#888',
  },
});

export default HomeScreen;