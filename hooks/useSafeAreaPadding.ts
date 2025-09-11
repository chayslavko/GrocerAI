import { useSafeAreaInsets } from "react-native-safe-area-context";

export const useSafeAreaPadding = () => {
  const insets = useSafeAreaInsets();

  return {
    bottomNavPadding: insets.bottom, // + 50,
    bottomPadding: insets.bottom,
    topPadding: insets.top,
    leftPadding: insets.left,
    rightPadding: insets.right,
    allInsets: insets,
  };
};
