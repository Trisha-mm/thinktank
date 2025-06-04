import { Link } from "expo-router";
import { Text, View, } from "react-native";

export default function LoginOptions() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Link href="./tabs"><Text>Dashboard</Text></Link>
    </View>
  );
}
