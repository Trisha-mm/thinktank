import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router';
import { SafeAreaView } from "react-native-safe-area-context";

export default function TabLayout() {
  return (
    <SafeAreaView style = {{
      flex:1
    }}>
    <Tabs
      screenOptions={{
      headerShown:false,
      tabBarActiveTintColor: '#809354',
      tabBarInactiveTintColor: '#8E8E93',
    }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'home' : 'home-outline'} color={color} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="games"
        options={{
          title: 'Games',
  
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'game-controller' : 'game-controller-outline'} color={color} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: 'Progress',
    
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'bar-chart' : 'bar-chart-outline'} color={color} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'settings' : 'settings-outline'} color={color} size={24} />
          ),
        }}
      />
      
    </Tabs>
    
    </SafeAreaView>
  );
}
