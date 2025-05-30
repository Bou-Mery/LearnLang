import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Screens
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
//import LessonScreen from '../screens/lessons/LessonScreen';
import LessonDetailScreen from '../screens/lessons/LessonDetailScreen';
import PronunciationScreen from '../screens/lessons/PronunciationScreen';
import SpellingScreen from '../screens/lessons/SpellingScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import HistoryScreen from '../screens/history/HistoryScreen';

//new screens
import LanguageSelection from '../screens/lessons/LanguageSelection';
import QuizList from '../screens/lessons/QuizList';
// Context
import { AuthContext } from '../context/AuthContext';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const LessonStack = createStackNavigator(); // Add this line
// Define LessonStackNavigator FIRST
const LessonStackNavigator = () => {
  return (
    <LessonStack.Navigator>
      <LessonStack.Screen 
        name="LanguageSelection" 
        component={LanguageSelection} 
        options={{ title: 'Select Language' }}
      />
      <LessonStack.Screen 
        name="QuizList" 
        component={QuizList} 
        options={{ title: 'Word List' }}
      />
      <LessonStack.Screen 
        name="Pronunciation" 
        component={PronunciationScreen} 
      />
      <LessonStack.Screen 
        name="Spelling" 
        component={SpellingScreen} 
      />
      {/* Add other screens here */}
    </LessonStack.Navigator>
  );
};


// Tab Navigator
const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Lessons') {
            iconName = focused ? 'book' : 'book-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else if (route.name === 'History') {
            iconName = focused ? 'time' : 'time-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#4F8EF7',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Lessons" component={LessonStackNavigator} />
      <Tab.Screen name="History" component={HistoryScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

// Main Navigation
const AppNavigator = () => {
  const { userToken } = useContext(AuthContext);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {userToken === null ? (
          // Auth screens
          <>
            <Stack.Screen 
              name="Login" 
              component={LoginScreen} 
              options={{ headerShown: false }}
            />
            <Stack.Screen 
              name="Register" 
              component={RegisterScreen} 
              options={{ headerShown: false }}
            />
          </>
        ) : (
          // App screens
          <Stack.Screen
            name="Main"
            component={TabNavigator}
            options={{ headerShown: false }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;