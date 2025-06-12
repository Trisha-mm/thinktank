import React from 'react';
import { Image, ImageSourcePropType, StyleSheet, Text, View } from 'react-native';

type UserAvatarProps = {
  source?: ImageSourcePropType;
  emoji?: string;
  size?: number;
};

export default function UserAvatar({ source, emoji = '👤', size = 40 }: UserAvatarProps) {
  return (
    <View style={[styles.avatar, { width: size, height: size, borderRadius: size / 2 }]}>
      {source ? (
        <Image source={source} style={{ width: size, height: size, borderRadius: size / 2 }} />
      ) : (
        <Text style={[styles.emoji, { fontSize: size / 2 }]}>{emoji}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    backgroundColor: '#3E5946',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  emoji: {
    color: '#fff',
  },
});