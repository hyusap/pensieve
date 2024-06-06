import ReminderView from "@/components/ReminderView";
import { Reminder } from "@/constants/types";
import {
  numberOfRemindersCompletedAtom,
  remindersAtom,
} from "@/constants/atoms";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { View, Text, FlatList, Button, Alert } from "react-native";

export default function Reminders() {
  const [reminders, setReminders] = useAtom(remindersAtom);
  const [numberOfRemindersCompleted, setNumberOfRemindersCompleted] = useAtom(
    numberOfRemindersCompletedAtom
  );
  async function deleteReminder(reminder: Reminder) {
    const index = reminders.findIndex((r) => r.uuid === reminder.uuid);
    Alert.prompt(
      "Delete",
      "Are you sure you want to delete this reminder?",
      [
        {
          text: "Cancel",
          onPress: () => {},
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () => {
            setReminders([
              ...reminders.slice(0, index),
              ...reminders.slice(index + 1),
            ]);
            setNumberOfRemindersCompleted(numberOfRemindersCompleted + 1);
          },
          style: "destructive",
        },
      ],
      "default"
    );
  }

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        // alignItems: "center",
        padding: 20,
      }}
    >
      <Text
        style={{
          fontWeight: "bold",
          fontSize: 30,
        }}
      >
        Reminders
      </Text>
      <FlatList
        data={reminders}
        renderItem={({ item }) => (
          <ReminderView reminder={item} onPress={() => deleteReminder(item)} />
        )}
      />
    </View>
  );
}
