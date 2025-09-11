import React, { useEffect, useRef } from "react";
import { View, Pressable, Alert, Animated } from "react-native";
import { Text } from "@gluestack-ui/themed";
import { useVoiceRecognition } from "@/hooks/useVoiceRecognition";

interface VoiceInputButtonProps {
  onCommandParsed: (command: { name: string; quantity: number }) => void;
  onTranscriptChange?: (transcript: string) => void;
  disabled?: boolean;
}

export const VoiceInputButton: React.FC<VoiceInputButtonProps> = ({
  onCommandParsed,
  onTranscriptChange,
  disabled = false,
}) => {
  const {
    isListening,
    transcript,
    error,
    startListening,
    stopListening,
    parseCommand,
    clearTranscript,
  } = useVoiceRecognition();

  // Animation refs for the dots
  const dot1Anim = useRef(new Animated.Value(1)).current;
  const dot2Anim = useRef(new Animated.Value(1)).current;
  const dot3Anim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (onTranscriptChange) {
      onTranscriptChange(transcript);
    }
  }, [transcript, onTranscriptChange]);

  useEffect(() => {
    if (error) {
      Alert.alert("Voice Recognition Error", error);
    }
  }, [error]);

  // Animation effect for listening dots
  useEffect(() => {
    if (isListening) {
      const createPulseAnimation = (
        animValue: Animated.Value,
        delay: number
      ) => {
        return Animated.loop(
          Animated.sequence([
            Animated.timing(animValue, {
              toValue: 0.3,
              duration: 600,
              delay,
              useNativeDriver: true,
            }),
            Animated.timing(animValue, {
              toValue: 1,
              duration: 600,
              useNativeDriver: true,
            }),
          ])
        );
      };

      const animation1 = createPulseAnimation(dot1Anim, 0);
      const animation2 = createPulseAnimation(dot2Anim, 200);
      const animation3 = createPulseAnimation(dot3Anim, 400);

      animation1.start();
      animation2.start();
      animation3.start();

      return () => {
        animation1.stop();
        animation2.stop();
        animation3.stop();
      };
    } else {
      // Reset animations when not listening
      dot1Anim.setValue(1);
      dot2Anim.setValue(1);
      dot3Anim.setValue(1);
    }
  }, [isListening, dot1Anim, dot2Anim, dot3Anim]);

  const handlePress = async () => {
    if (disabled) return;

    if (isListening) {
      await stopListening();

      if (transcript) {
        const parsed = parseCommand(transcript);
        if (parsed) {
          onCommandParsed(parsed);
          clearTranscript();
        } else {
          Alert.alert(
            "Could not understand",
            `Please try speaking more clearly, like "Milk two" or "Bread one"`
          );
        }
      }
    } else {
      await startListening();
    }
  };

  const handleLongPress = () => {
    if (isListening) {
      stopListening();
      clearTranscript();
    }
  };

  return (
    <View className="flex flex-col items-center space-y-3">
      <Pressable
        onPress={handlePress}
        onLongPress={handleLongPress}
        disabled={disabled}
        className={`
          w-20 h-20 rounded-full items-center justify-center shadow-lg
          ${
            isListening
              ? "bg-red-500 shadow-red-200"
              : disabled
              ? "bg-gray-300"
              : "bg-green-500 shadow-green-200"
          }
        `}
        style={{
          shadowColor: isListening ? "#ef4444" : "#10b981",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 8,
        }}
      >
        <Text color="$white" fontSize="$4xl">
          {isListening ? "⏹️" : "🎤"}
        </Text>
      </Pressable>

      <Text fontSize="$sm" color="$gray600" textAlign="center" className="mt-4">
        {isListening ? "Listening..." : "Tap to speak"}
      </Text>

      {transcript && (
        <View className="bg-gray-100 rounded-lg p-3 max-w-xs">
          <Text fontSize="$sm" color="$gray700" textAlign="center">
            &ldquo;{transcript}&rdquo;
          </Text>
        </View>
      )}

      {isListening && (
        <View className="flex flex-row space-x-1">
          <Animated.View
            className="w-2 h-2 bg-red-500 rounded-full"
            style={{ opacity: dot1Anim }}
          />
          <Animated.View
            className="w-2 h-2 bg-red-500 rounded-full"
            style={{ opacity: dot2Anim }}
          />
          <Animated.View
            className="w-2 h-2 bg-red-500 rounded-full"
            style={{ opacity: dot3Anim }}
          />
        </View>
      )}
    </View>
  );
};
