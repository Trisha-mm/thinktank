import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs
    screenOptions={{
      headerShown:false,
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
            <Ionicons name={focused ? 'calculator' : 'calculator-outline'} color={color} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: 'Progress',
    
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'calculator' : 'calculator-outline'} color={color} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'calculator' : 'calculator-outline'} color={color} size={24} />
          ),
        }}
      />
      
    </Tabs>
  );
}
