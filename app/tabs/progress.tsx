import LogoHeader from "@/components/LogoHeader";
import UserAvatar from "@/components/UserAvatar";
import React from "react";
import { FlatList, Image, StyleSheet, Text, View } from "react-native";

const leaderboard = [
  { name: "user", rank: 1, medal: require("@/assets/images/gold.png") },
  { name: "user", rank: 2, medal: require("@/assets/images/silver.png") },
  { name: "user", rank: 3, medal: require("@/assets/images/bronze.png") },
  { name: "user", rank: 4 },
  { name: "user", rank: 5 },
];

export default function Progress() {
  return (
    <View style={styles.container}>
      <View style={styles.logoWrapper}>
  <LogoHeader />
</View>

      <Text style={styles.title}>Leaderboard</Text>

      <FlatList
        data={leaderboard}
        keyExtractor={(item) => item.rank.toString()}
        renderItem={({ item }) => (
          <View
            style={[styles.row, item.rank === 1 ? styles.highlightRow : null]}
          >
            <UserAvatar />
            <Text style={styles.username}>{item.name}</Text>
            <View style={styles.rankSection}>
              <Text style={styles.rank}>{item.rank}</Text>
              {item.medal && <Image source={item.medal} style={styles.medal} />}
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F5", paddingTop: 20 },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#006650",
    textAlign: "center",
    marginVertical: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    marginHorizontal: 10,
    marginVertical: 4,
    backgroundColor: "#F0F0F0",
    borderRadius: 8,
  },
  highlightRow: {
    backgroundColor: "#CDE390",
  },
  username: {
    flex: 1,
    fontSize: 18,
    color: "#006650",
    marginLeft: 10,
  },
  rankSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  rank: {
    fontSize: 18,
    color: "#006650",
    marginRight: 5,
  },
  medal: {
    width: 24,
    height: 24,
  },
  logoWrapper: {
    marginHorizontal: -30,
    marginTop: -20,
    paddingBottom: 30, 
  },
  
});
