import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

export default function AnswerFeedback({
  isCorrect,
  correctAnswer,
  onContinue,
}: {
  isCorrect: boolean;
  correctAnswer: string;
  onContinue: () => void;
}) {
  return (
    <View className="absolute inset-0 bg-white/90 justify-center items-center px-6">
      {isCorrect ? (
        <Text className="text-2xl text-[#027361] mb-6">Correct! +$10</Text>
      ) : (
        <>
          <Text className="text-xl text-red-600 mb-2">Incorrect</Text>
          <Text className="text-base text-gray-700 mb-6">Correct Answer: {correctAnswer}</Text>
        </>
      )}
      <TouchableOpacity
        onPress={onContinue}
        className="bg-white border border-gray-300 px-6 py-3 rounded-xl"
      >
        <Text className="text-base">Continue</Text>
      </TouchableOpacity>
    </View>
  );
}