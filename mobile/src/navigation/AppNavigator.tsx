import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';

// Screens
import LoginScreen from '../screens/auth/LoginScreen';
import HomeScreen from '../screens/home/HomeScreen';
import NotesScreen from '../screens/notes/NotesScreen';
import CalendarScreen from '../screens/calendar/CalendarScreen';
import FilesScreen from '../screens/files/FilesScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Stack Navigator para cada tab
function NotesStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="NotesList" component={NotesScreen} options={{ title: 'Notas' }} />
    </Stack.Navigator>
  );
}

function CalendarStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="CalendarList" component={CalendarScreen} options={{ title: 'Calendário' }} />
    </Stack.Navigator>
  );
}

function FilesStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="FilesList" component={FilesScreen} options={{ title: 'Arquivos' }} />
    </Stack.Navigator>
  );
}


export default function AppNavigator() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return null; // Ou um componente de loading
  }

  if (!isAuthenticated) {
    return (
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName: keyof typeof Ionicons.glyphMap;

            if (route.name === 'Home') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Notes') {
              iconName = focused ? 'document-text' : 'document-text-outline';
            } else if (route.name === 'Calendar') {
              iconName = focused ? 'calendar' : 'calendar-outline';
            } else if (route.name === 'Files') {
              iconName = focused ? 'folder' : 'folder-outline';
            } else {
              iconName = 'help-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#007AFF',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ title: 'Início' }} 
        />
        <Tab.Screen 
          name="Notes" 
          component={NotesStack} 
          options={{ title: 'Notas' }} 
        />
        <Tab.Screen 
          name="Calendar" 
          component={CalendarStack} 
          options={{ title: 'Calendário' }} 
        />
        <Tab.Screen 
          name="Files" 
          component={FilesStack} 
          options={{ title: 'Arquivos' }} 
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
