import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import {
  Text,
  Checkbox,
  CheckboxIndicator,
  CheckboxIcon,
  CheckIcon,
  Pressable,
} from '@gluestack-ui/themed';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { GroceryItem } from '@/types';
import { useTogglePurchase, useDeleteGroceryItem } from '@/hooks/useGrocery';
import { Colors } from '@/constants/colors';

interface GroceryItemCardProps {
  item: GroceryItem;
  onEdit: (item: GroceryItem) => void;
  onPress?: (item: GroceryItem) => void;
}

export const GroceryItemCard: React.FC<GroceryItemCardProps> = ({
  item,
  onEdit,
  onPress,
}) => {
  const togglePurchase = useTogglePurchase();
  const deleteItem = useDeleteGroceryItem();

  const handleTogglePurchase = () => {
    togglePurchase.mutate({
      id: item.id,
      isPurchased: !item.isPurchased,
    });
  };

  const handleDelete = () => {
    deleteItem.mutate(item.id);
  };

  return (
    <Pressable onPress={() => onPress?.(item)}>
      <View className="bg-white rounded-lg p-4 mb-3 border border-gray-200 shadow-sm">
        <View className="flex flex-row items-center">
          <Checkbox
            value={item.isPurchased.toString()}
            isChecked={item.isPurchased}
            onChange={handleTogglePurchase}
            isDisabled={togglePurchase.isPending}
            size="md"
            className="mr-4"
          >
            <CheckboxIndicator
              borderColor="$green500"
              bgColor={item.isPurchased ? '$green500' : 'transparent'}
            >
              <CheckboxIcon as={CheckIcon} color="white" />
            </CheckboxIndicator>
          </Checkbox>

          <View className="flex-1 flex flex-col">
            <Text
              fontSize="$lg"
              fontWeight="$bold"
              textDecorationLine={item.isPurchased ? 'line-through' : 'none'}
              color={item.isPurchased ? '$gray400' : '$gray800'}
              className="mb-1"
            >
              {item.name}
            </Text>
            <Text fontSize="$sm" color="$gray500">
              {item.quantity} piece{item.quantity !== 1 ? 's' : ''}
            </Text>
          </View>

          <View className="flex flex-row">
            <TouchableOpacity
              onPress={() => onEdit(item)}
              className="p-2"
              disabled={deleteItem.isPending}
            >
              <IconSymbol size={20} name="pencil" color={Colors.tint} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleDelete}
              className="p-2"
              disabled={deleteItem.isPending}
            >
              <IconSymbol size={20} name="trash" color={Colors.tint} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Pressable>
  );
};
