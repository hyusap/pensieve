import {
  numberOfRemindersCompletedAtom,
  numberOfRemindersCreatedAtom,
} from "@/constants/atoms";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { View, Text, Button } from "react-native";

export default function Profile() {
  const [numberOfRemindersCreated, setNumberOfRemindersCreated] = useAtom(
    numberOfRemindersCreatedAtom
  );
  const [numberOfRemindersCompleted, setNumberOfRemindersCompleted] = useAtom(
    numberOfRemindersCompletedAtom
  );

  async function clearAllStats() {
    setNumberOfRemindersCreated(0);
    setNumberOfRemindersCompleted(0);
  }

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Profile</Text>
      <Text>Number of reminders created: {numberOfRemindersCreated}</Text>
      <Text>Number of reminders completed: {numberOfRemindersCompleted}</Text>

      <Button title="Clear all stats" onPress={clearAllStats} />
    </View>
  );
}
