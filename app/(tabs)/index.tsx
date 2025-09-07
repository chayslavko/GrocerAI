import { Image } from "expo-image";
import { StyleSheet } from "react-native";

import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Input, InputField } from "@gluestack-ui/themed";

export default function HomeScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <Image
          source={require("@/assets/images/partial-react-logo.png")}
          style={styles.reactLogo}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">GrocerAI 🛒</ThemedText>
        <HelloWave />
      </ThemedView>
      <ThemedView className={`flex-1 `}>
        <Input
          variant="outline"
          size="md"
          isDisabled={false}
          isInvalid={false}
          isReadOnly={false}
        >
          <InputField placeholder="Search for groceries..." />
        </Input>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Smart Grocery Shopping</ThemedText>
        <ThemedText>
          GrocerAI helps you find the best deals, create shopping lists, and
          discover new products. Use the search bar above to find groceries, or
          explore our features below.
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">AI-Powered Features</ThemedText>
        <ThemedText>
          Discover intelligent features like price comparison, nutritional
          analysis, and personalized recommendations tailored to your shopping
          habits.
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Get Started</ThemedText>
        <ThemedText>
          Start your smart grocery shopping journey today! Search for products,
          create lists, and let GrocerAI help you make better shopping
          decisions.
        </ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});
