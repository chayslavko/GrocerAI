import React, { useState, useEffect } from 'react';
import { Alert, View } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Box,
  Text,
  Button,
  ButtonText,
  Input,
  InputField,
  Heading,
} from '@gluestack-ui/themed';
import {
  FormControl,
  FormControlError,
  FormControlErrorText,
} from '@gluestack-ui/themed';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { useAuth } from '@/contexts/AuthContext';
import { useCreateUser } from '@/hooks/useUsers';
import { userApi } from '@/services/api';
import { useSafeAreaPadding } from '@/hooks/useSafeAreaPadding';
import { usernameSchema, type UsernameFormData } from '@/schemas';

export default function ProfileScreen() {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const { login, logout, isAuthenticated, isLoading, user } = useAuth();
  const { mutate: createUser, isPending: isCreating } = useCreateUser();
  const { bottomNavPadding } = useSafeAreaPadding();

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<UsernameFormData>({
    resolver: zodResolver(usernameSchema),
    mode: 'onChange',
    defaultValues: {
      username: '',
    },
  });

  const onSubmit = async (data: UsernameFormData) => {
    setIsLoggingIn(true);
    const username = data.username.trim();

    try {
      const existingUser = await userApi.getByUsername(username);

      if (existingUser) {
        await login(existingUser);
        reset();
        router.replace('/(tabs)');
      } else {
        createUser(
          { username },
          {
            onSuccess: newUser => {
              login(newUser);
              reset();
              router.replace('/(tabs)');
            },
            onError: error => {
              Alert.alert('Error', 'Failed to create user. Please try again.');
              console.error('Create user error:', error);
            },
          },
        );
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to login. Please check your connection.');
      console.error('Login error:', error);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleClearData = () => {
    Alert.alert('Are u sure?', '', [
      { text: 'No', style: 'cancel' },
      {
        text: 'Yes',
        style: 'destructive',
        onPress: async () => {
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
                  Hi, {user.username}!
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
              <View className="flex flex-col justify-center items-center">
                <Text fontSize="$lg" color="$gray700" className="text-center">
                  But first let me know who you are!
                </Text>
                <View className="mt-6 flex flex-col justify-center items-center w-full max-w-[250px] relative">
                  <FormControl isInvalid={!!errors.username}>
                    <Controller
                      control={control}
                      name="username"
                      render={({ field: { onChange, onBlur, value } }) => (
                        <Input
                          borderColor={
                            errors.username ? '$red500' : '$green500'
                          }
                          backgroundColor="$white"
                          className="w-full"
                        >
                          <InputField
                            color="$gray600"
                            placeholder="Enter your username"
                            value={value}
                            onChangeText={onChange}
                            onBlur={onBlur}
                            maxLength={12}
                          />
                        </Input>
                      )}
                    />
                    {errors.username && (
                      <FormControlError className="absolute top-10 left-0 right-0 ">
                        <FormControlErrorText>
                          {errors.username.message}
                        </FormControlErrorText>
                      </FormControlError>
                    )}
                  </FormControl>
                  <Button
                    bgColor="$green500"
                    size="md"
                    className="mt-6 w-full max-w-[250px]"
                    onPress={handleSubmit(onSubmit)}
                    isDisabled={!isValid || isLoggingIn || isCreating}
                  >
                    <ButtonText>
                      {isLoggingIn || isCreating ? 'Logging in...' : "Let's go"}
                    </ButtonText>
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
