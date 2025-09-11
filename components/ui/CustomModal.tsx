import React from 'react';
import {
  View,
  Modal as RNModal,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export interface CustomModalProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  showCloseButton?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  closeOnBackdropPress?: boolean;
  footer?: React.ReactNode;
}

const { width: screenWidth } = Dimensions.get('window');

export const CustomModal: React.FC<CustomModalProps> = ({
  visible,
  onClose,
  children,
  title,
  showCloseButton = true,
  size = 'lg',
  closeOnBackdropPress = true,
  footer,
}) => {
  const getModalWidth = () => {
    switch (size) {
      case 'sm':
        return screenWidth * 0.7;
      case 'md':
        return screenWidth * 0.8;
      case 'lg':
        return screenWidth * 0.9;
      case 'xl':
        return screenWidth * 0.95;
      default:
        return screenWidth * 0.9;
    }
  };

  const handleBackdropPress = () => {
    if (closeOnBackdropPress) {
      onClose();
    }
  };

  const handleContentPress = (e: any) => {
    e.stopPropagation();
  };

  if (!visible) return null;

  return (
    <RNModal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={handleBackdropPress}>
        <View className="absolute inset-0 bg-black/50">
          <SafeAreaView className="flex-1 justify-center items-center px-5">
            <TouchableWithoutFeedback onPress={handleContentPress}>
              <View
                className="bg-white rounded-xl max-h-[80%] shadow-lg"
                style={{ width: getModalWidth() }}
              >
                {(title || showCloseButton) && (
                  <View className="flex-row items-center justify-between px-5 pt-5 pb-2.5 border-b border-gray-100">
                    {title && (
                      <Text className="text-xl font-semibold text-gray-800 flex-1">
                        {title}
                      </Text>
                    )}
                    {showCloseButton && (
                      <TouchableOpacity
                        onPress={onClose}
                        className="w-8 h-8 justify-center items-center ml-4"
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                      >
                        <Text className="text-lg font-semibold text-gray-500">
                          ✕
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                )}
                <View className="p-5">{children}</View>
                {footer && <View className="px-5 pb-5">{footer}</View>}
              </View>
            </TouchableWithoutFeedback>
          </SafeAreaView>
        </View>
      </TouchableWithoutFeedback>
    </RNModal>
  );
};

export default CustomModal;
