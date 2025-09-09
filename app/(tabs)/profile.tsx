import React, { useState } from 'react';
import { Alert, View } from 'react-native';
import {
  Box,
  Text,
  Button,
  ButtonText,
  Input,
  InputField,
  Heading,
} from '@gluestack-ui/themed';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { useUser } from '@/hooks/useUser';
import { useAuth } from '@/contexts/AuthContext';
import { userStorageService } from '@/services/storage';
import { useSafeAreaPadding } from '@/hooks/useSafeAreaPadding';

export default function ProfileScreen() {
  const [name, setName] = useState('');
  const { user, isLoading, saveUser, clearUser } = useUser();
  const { login, logout, isAuthenticated } = useAuth();
  const { bottomNavPadding } = useSafeAreaPadding();

  const handleSaveName = async () => {
    const success = await saveUser({ name: name.trim() });
    if (success) {
      setName('');
      const userData = await userStorageService.getUser();
      if (userData) {
        await login(userData);
        router.replace('/(tabs)');
      }
    } else {
      Alert.alert('Error', 'Failed to save ur name.');
    }
  };

  const handleClearData = () => {
    Alert.alert('Are u sure?', '', [
      { text: 'No', style: 'cancel' },
      {
        text: 'Yes',
        style: 'destructive',
        onPress: async () => {
          await clearUser();
          await logout();
        },
      },
    ]);
  };

  if (isLoading) {
    return (
      <Box flex={1} justifyContent="center" alignItems="center" bg="$gray50">
        <Text color="$gray500">Loading...</Text>
      </Box>
    );
  }

  return (
    <SafeAreaView
      className="flex-1"
      edges={['top']}
      style={{ backgroundColor: Colors.background }}
    >
      <View
        className="flex-1 justify-between p-4"
        style={{ marginBottom: bottomNavPadding }}
      >
        <View className="flex-1 flex-col justify-between items-center">
          <View className="flex flex-col justify-center items-center">
            <Heading size="xl" color="$gray900">
              Welcome to GrocerAI!
            </Heading>
          </View>

          <View className="flex flex-col justify-center">
            {user ? (
              <View className="flex flex-col">
                <Text fontSize="$lg" color="$gray700" className="text-center">
                  Hi, {user.name}!
                </Text>
                <Button
                  variant="outline"
                  action="secondary"
                  onPress={handleClearData}
                  className="mt-10"
                >
                  <ButtonText>Logout 🥲</ButtonText>
                </Button>
              </View>
            ) : (
              <View className="flex flex-col justify-center">
                <Text fontSize="$lg" color="$gray700" className="text-center">
                  But first let me know who you are!
                </Text>
                <View className="mt-6">
                  <Input borderColor="$green500" backgroundColor="$white">
                    <InputField
                      color="$gray600"
                      placeholder="Enter your name"
                      value={name}
                      onChangeText={setName}
                    />
                  </Input>
                  <Button
                    bgColor="$green500"
                    size="md"
                    className="mt-6"
                    onPress={handleSaveName}
                    isDisabled={!name.trim()}
                  >
                    <ButtonText>Let's go</ButtonText>
                  </Button>
                </View>
              </View>
            )}
          </View>
          <View />
        </View>
      </View>
    </SafeAreaView>
  );
}
