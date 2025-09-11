import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import {
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Heading,
  Button,
  ButtonText,
  Text,
  Divider,
  Input,
  InputField,
} from '@gluestack-ui/themed';
import { GroceryItem } from '@/types';
import { useCreateGroceryItem, useUpdateGroceryItem } from '@/hooks/useGrocery';
import { useAuth } from '@/contexts/AuthContext';
import { VoiceInputButton } from '@/components/VoiceInputButton';

interface GroceryItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  item?: GroceryItem | null;
}

export const GroceryItemModal: React.FC<GroceryItemModalProps> = ({
  isOpen,
  onClose,
  item,
}) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    quantity: 1,
  });

  const createItem = useCreateGroceryItem();
  const updateItem = useUpdateGroceryItem();

  const isEditMode = !!item;

  useEffect(() => {
    if (isOpen) {
      if (item) {
        setFormData({
          name: item.name,
          quantity: item.quantity,
        });
      } else {
        setFormData({
          name: '',
          quantity: 1,
        });
      }
    }
  }, [isOpen, item]);

  const handleSubmit = () => {
    if (!formData.name.trim()) return;

    if (isEditMode && item) {
      updateItem.mutate(
        {
          id: item.id,
          data: formData,
        },
        {
          onSuccess: onClose,
        },
      );
    } else {
      if (!user?.id) {
        throw new Error('User not authenticated');
      }
      createItem.mutate(
        { ...formData, userId: user.id },
        {
          onSuccess: onClose,
        },
      );
    }
  };

  const handleClose = () => {
    onClose();
  };

  const handleVoiceCommand = (command: { name: string; quantity: number }) => {
    setFormData({
      name: command.name,
      quantity: command.quantity,
    });
  };

  const isLoading = isEditMode ? updateItem.isPending : createItem.isPending;
  const title = isEditMode ? 'Edit Item' : 'Add Item';
  const submitButtonText = isEditMode
    ? isLoading
      ? 'Saving...'
      : 'Save'
    : isLoading
    ? 'Adding...'
    : 'Add';

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="lg">
      <ModalBackdrop />
      <ModalContent>
        <ModalHeader>
          <Heading size="lg">{title}</Heading>
          <ModalCloseButton>
            <Text>✕</Text>
          </ModalCloseButton>
        </ModalHeader>
        <Divider />
        <ModalBody>
          <View className="flex flex-col pt-6">
            <View className="flex flex-col">
              <Text
                size="sm"
                fontWeight="$medium"
                color="$gray700"
                className="pb-2"
              >
                Item Name
              </Text>
              <Input className="border-green-500">
                <InputField
                  placeholder={isEditMode ? item?.name : 'Enter item name'}
                  value={formData.name}
                  onChangeText={text =>
                    setFormData({ ...formData, name: text })
                  }
                  className="text-gray-800"
                />
              </Input>
            </View>

            <View className="flex flex-col pt-4">
              <Text
                size="sm"
                fontWeight="$medium"
                color="$gray700"
                className="pb-2"
              >
                Amount
              </Text>
              <Input>
                <InputField
                  value={
                    formData.quantity === 0 ? '' : formData.quantity.toString()
                  }
                  onChangeText={text => {
                    const numValue = text === '' ? 0 : parseInt(text);
                    setFormData({
                      ...formData,
                      quantity: numValue,
                    });
                  }}
                  onBlur={() => {
                    if (formData.quantity === 0) {
                      setFormData({ ...formData, quantity: 1 });
                    }
                  }}
                  keyboardType="numeric"
                  className="text-gray-800"
                />
              </Input>
            </View>

            {!isEditMode && (
              <View className="flex flex-col pt-6">
                <Text
                  size="sm"
                  fontWeight="$medium"
                  color="$gray700"
                  className="pb-3 text-center"
                >
                  AI for poor
                </Text>
                <View className="flex items-center">
                  <VoiceInputButton
                    onCommandParsed={handleVoiceCommand}
                    disabled={isLoading}
                  />
                </View>
                <Text size="xs" color="$gray500" className="pt-2 text-center">
                  Say something like &ldquo;Milk two&rdquo; or &ldquo;Apple
                  one&rdquo;
                </Text>
              </View>
            )}
          </View>
        </ModalBody>
        <ModalFooter>
          <View className="flex flex-row flex-1 pt-4">
            <Button
              onPress={handleSubmit}
              isDisabled={!formData.name.trim() || isLoading}
              className="flex-1"
              bgColor="$green500"
            >
              <ButtonText color="white">{submitButtonText}</ButtonText>
            </Button>
          </View>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
