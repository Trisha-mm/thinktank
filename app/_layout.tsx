import { Stack } from "expo-router";

export default function StackLayout() {

  return (
    <Stack screenOptions={{
      headerShown:false,
    }}>
      <Stack.Screen
        name="index"
        options={{
          headerShown:false,
        }}
      />
      <Stack.Screen
        name="login"
        options={{
          headerShown:false,
        }}
      />
       <Stack.Screen
        name="loginOptions"
        options={{
          headerShown:false,
        }}
      />
      <Stack.Screen
        name="chat"
        options={{
          headerShown:false,
        }}
      />
      <Stack.Screen
        name="chatUsers"
        options={{
          headerShown:false,
        }}
      />
        <Stack.Screen
        name="reward"
        options={{
          headerShown:false,
        }}
      />
    </Stack>
    
  );
}
