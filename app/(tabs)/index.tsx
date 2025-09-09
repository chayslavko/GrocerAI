import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { debounce } from 'lodash';
import { FlatList, RefreshControl, View } from 'react-native';
import {
  Text,
  Button,
  ButtonText,
  Input,
  InputField,
  Fab,
  FabIcon,
  AddIcon,
  InputIcon,
  CloseIcon,
  Pressable,
  CheckCircleIcon,
  ClockIcon,
  Heading,
} from '@gluestack-ui/themed';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants/Colors';
import { GroceryItemCard, GroceryItemModal } from '@/components/grocery';
import { useGroceryItems } from '@/hooks/useGrocery';
import { GroceryItem } from '@/types';

type ListItem =
  | { type: 'header'; title: string; count: number }
  | { type: 'item'; item: GroceryItem };

export default function HomeScreen() {
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GroceryItem | null>(null);

  const { data: grocery = [], isLoading, refetch } = useGroceryItems();

  const debouncedSearch = useMemo(
    () =>
      debounce((input: string) => {
        if (input.length >= 2 || input.length === 0) {
          setSearchQuery(input);
        }
      }, 300),
    [],
  );

  const handleSearchInputChange = useCallback(
    (input: string) => {
      setSearchInput(input);
      debouncedSearch(input);
    },
    [debouncedSearch],
  );

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const { pendingItems, purchasedItems } = useMemo(() => {
    let filtered = grocery.filter(item => {
      const matchesSearch = item.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      return matchesSearch;
    });

    const pending = filtered.filter(item => !item.isPurchased);
    const purchased = filtered.filter(item => item.isPurchased);

    pending.sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    purchased.sort((a, b) => {
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });

    return {
      pendingItems: pending,
      purchasedItems: purchased,
    };
  }, [grocery, searchQuery]);

  const listData = useMemo((): ListItem[] => {
    const data: ListItem[] = [];

    if (pendingItems.length > 0) {
      data.push({
        type: 'header',
        title: 'To Buy',
        count: pendingItems.length,
      });
      pendingItems.forEach(item => {
        data.push({ type: 'item', item });
      });
    }

    if (purchasedItems.length > 0) {
      data.push({
        type: 'header',
        title: 'Purchased',
        count: purchasedItems.length,
      });
      purchasedItems.forEach(item => {
        data.push({ type: 'item', item });
      });
    }

    return data;
  }, [pendingItems, purchasedItems]);

  const handleEditItem = useCallback((item: GroceryItem) => {
    setEditingItem(item);
  }, []);

  const handleModalClose = useCallback(() => {
    setIsModalOpen(false);
    setEditingItem(null);
  }, []);

  const handleFabPress = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const handleRefetch = useCallback(() => {
    refetch();
  }, [refetch]);

  const handleClearSearch = useCallback(() => {
    setSearchInput('');
    setSearchQuery('');
  }, []);

  const renderGroceryItem = useCallback(
    ({ item }: { item: GroceryItem }) => (
      <GroceryItemCard item={item} onEdit={handleEditItem} />
    ),
    [handleEditItem],
  );

  const renderSectionHeader = useCallback((title: string, count: number) => {
    const isPurchased = title === 'Purchased';
    const IconComponent = isPurchased ? CheckCircleIcon : ClockIcon;

    return (
      <View className="flex flex-row items-center py-3 px-1">
        <View className="flex flex-row items-center mr-2">
          <IconComponent size="lg" color="$green500" />
        </View>

        <Text fontSize="$lg" fontWeight="$semibold" color="$gray800">
          {title} ({count})
        </Text>
      </View>
    );
  }, []);

  const renderListItem = useCallback(
    ({ item }: { item: ListItem }) => {
      if (item.type === 'header') {
        return renderSectionHeader(item.title, item.count);
      } else {
        return renderGroceryItem({ item: item.item });
      }
    },
    [renderSectionHeader, renderGroceryItem],
  );

  const renderEmptyState = useCallback(
    () => (
      <View className="flex-1 justify-center items-center p-8">
        <View className="flex flex-col items-center space-y-4">
          <Text
            fontSize="$sm"
            color="$gray500"
            textAlign="center"
            className="mt-2"
          >
            {searchQuery
              ? 'No items match your search'
              : 'Start adding items to your grocery list'}
          </Text>
          {!searchQuery && (
            <Button
              onPress={handleFabPress}
              bgColor="$green500"
              className="mt-4"
            >
              <ButtonText>Add First Item</ButtonText>
            </Button>
          )}
        </View>
      </View>
    ),
    [searchQuery, handleFabPress],
  );

  const totalItems = pendingItems.length + purchasedItems.length;

  return (
    <SafeAreaView
      className="flex-1"
      edges={['top']}
      style={{
        backgroundColor: Colors.background,
        borderBottomColor: Colors.background,
      }}
    >
      <View className="flex-1 p-4 pb-0">
        <View className="flex flex-col pb-4">
          <View className="flex flex-col justify-center items-center">
            <Heading size="xl" color="$gray900">
              GrocerAI 🛒
            </Heading>
            <Text fontSize="$sm" color="$gray600"></Text>
          </View>

          <View className="flex flex-row items-center mt-2 h-6 justify-between">
            {totalItems > 0 && (
              <Text fontSize="$sm" color="$gray600">
                {totalItems} item{totalItems !== 1 ? 's' : ''}
              </Text>
            )}
          </View>
        </View>
        {(totalItems > 0 || searchInput.length > 0) && (
          <View className="flex flex-col pb-4">
            <Input borderColor="$green500" backgroundColor="$white">
              <InputField
                placeholder="Search items..."
                value={searchInput}
                onChangeText={handleSearchInputChange}
                color="$gray600"
              />
              {searchInput.length > 0 && (
                <Pressable
                  onPress={handleClearSearch}
                  className="mr-2 flex justify-center "
                >
                  <InputIcon as={CloseIcon} size="lg" color="$gray500" />
                </Pressable>
              )}
            </Input>
          </View>
        )}

        <View className="flex-1">
          {isLoading ? (
            <View className="flex-1 justify-center items-center">
              <Text color="$gray500">Loading...</Text>
            </View>
          ) : totalItems === 0 ? (
            renderEmptyState()
          ) : (
            <FlatList
              data={listData}
              renderItem={renderListItem}
              keyExtractor={(item, index) => {
                if (item.type === 'header') {
                  return `header-${item.title}`;
                } else {
                  return `item-${item.item.id}`;
                }
              }}
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl
                  refreshing={isLoading}
                  onRefresh={handleRefetch}
                  tintColor="#48bb78"
                />
              }
              contentContainerStyle={{ paddingBottom: 64 }}
            />
          )}
        </View>
      </View>

      {totalItems > 0 && (
        <Fab
          size="lg"
          bgColor="$green500"
          placement="bottom right"
          onPress={handleFabPress}
        >
          <FabIcon as={AddIcon} />
        </Fab>
      )}

      <GroceryItemModal
        isOpen={isModalOpen || !!editingItem}
        onClose={handleModalClose}
        item={editingItem}
      />
    </SafeAreaView>
  );
}
