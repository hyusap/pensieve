import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <Stack
    // screenOptions={{
    //   statusBarStyle: "dark",
    // }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="createModal" options={{ presentation: "modal" }} />
    </Stack>
  );
}
