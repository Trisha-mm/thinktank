import { Stack } from "expo-router";

export default function StackLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="login"
        options={{
          headerShown: true,
        }}
      />
       <Stack.Screen
        name="loginOptions"
        options={{
          headerShown: true,
        }}
      />
    </Stack>
  );
}
