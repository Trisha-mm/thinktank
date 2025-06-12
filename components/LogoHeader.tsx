import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function LogoHeader() {
  return (
    <View style={styles.header}>
      <Text style={styles.headerText}>think tank</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#CDE390',
    paddingVertical: 12,
    alignItems: 'center',
    height:50,
    width: 500,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#006650',
    textTransform: 'lowercase',
  },
});
