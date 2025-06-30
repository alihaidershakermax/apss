import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet, useColorScheme } from 'react-native';
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Toaster } from 'sonner-native';
import React, { createContext, useState, useEffect } from 'react';
import HomeScreen from "./screens/HomeScreen";
import SettingsScreen from "./screens/SettingsScreen";
import NewBookScreen from "./screens/NewBookScreen";
import BookViewScreen from "./screens/BookViewScreen";
import NewPageScreen from "./screens/NewPageScreen";
import ChapterManagementScreen from "./screens/ChapterManagementScreen";
import BookExportScreen from "./screens/BookExportScreen";

// Create AppContext
export const AppContext = createContext(null);

const Stack = createNativeStackNavigator();

function RootStack() {
  return (
    <Stack.Navigator screenOptions={{
      headerShown: false
    }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="NewBook" component={NewBookScreen} />
      <Stack.Screen name="BookView" component={BookViewScreen} />
      <Stack.Screen name="NewPage" component={NewPageScreen} />
      <Stack.Screen name="ChapterManagement" component={ChapterManagementScreen} />
      <Stack.Screen name="BookExport" component={BookExportScreen} />
    </Stack.Navigator>
  );
}

export default function App() {
  const colorScheme = useColorScheme();
  const [settings, setSettings] = useState({
    darkMode: colorScheme === 'dark',
    language: 'ar',
    notifications: true,
    fontFamily: 'Cairo',
    fontSize: 'medium',
    bookDesign: 'classic',
    appLock: false,
    telegramBackup: false,
    telegramBot: '',
    telegramChannel: '',
    autoBackup: false,
    backupFrequency: 'weekly'
  });

  // Update settings function
  const updateSettings = (newSettings) => {
    setSettings(prevSettings => ({
      ...prevSettings,
      ...newSettings
    }));
  };

  // Context value
  const contextValue = {
    settings,
    updateSettings
  };

  return (
    <AppContext.Provider value={contextValue}>
      <SafeAreaProvider style={[
        styles.container, 
        { backgroundColor: settings.darkMode ? '#121212' : '#f5f5f5' }
      ]}>
        <Toaster />
        <NavigationContainer>
          <RootStack />
        </NavigationContainer>
      </SafeAreaProvider>
    </AppContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    userSelect: "none"
  }
});