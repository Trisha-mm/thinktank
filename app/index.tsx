import { Link } from 'expo-router';
import React from 'react';
import { StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { GoogleAuthService } from '../GoogleAuthService';

export default function WelcomeScreen() {

  const handleGooglesignin=async()=>{
    const result = await GoogleAuthService.signInWithGoogle();
    console.log(result);
  }


  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F7F5F2" />

      <Text style={styles.welcome}>Welcome to</Text>
      <Text style={styles.title}>Think Tank</Text>

      <View style={styles.buttonContainer}>
        //<Link href={{ pathname: '/loginOptions', params: { mode: 'login' } }} asChild>
          <TouchableOpacity style={styles.button} onPress={handleGooglesignin}>
            <Text style={styles.buttonText}>Log In</Text>
          </TouchableOpacity>
        //</Link>

        <Link href={{ pathname: '/loginOptions', params: { mode: 'signup' } }} asChild>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F5F2',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  welcome: {
    fontSize: 32,
    fontWeight: '600',
    color: '#144D4D',
    marginBottom: 8,
  },

  title: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#144D4D',
    marginBottom: 60,
  },
  buttonContainer: {
    width: '100%',
    gap: 18,
  },
  button: {
    backgroundColor: '#A3C86E',
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonText: {
    textAlign: 'center',
    color: '#144D4D',
    fontWeight: '700',
    fontSize: 18,
  },
});
