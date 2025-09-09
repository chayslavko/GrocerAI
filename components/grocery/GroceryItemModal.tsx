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
} from '@gluestack-ui/themed';
import { Input, InputField } from '@gluestack-ui/themed';
import { GroceryItem } from '@/types';
import { useCreateGroceryItem, useUpdateGroceryItem } from '@/hooks/useGrocery';

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
      createItem.mutate(formData, {
        onSuccess: onClose,
      });
    }
  };

  const handleClose = () => {
    onClose();
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
                  placeholder="1"
                  value={formData.quantity.toString()}
                  onChangeText={text =>
                    setFormData({
                      ...formData,
                      quantity: parseInt(text) || 1,
                    })
                  }
                  keyboardType="numeric"
                  className="text-gray-800"
                />
              </Input>
            </View>
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
