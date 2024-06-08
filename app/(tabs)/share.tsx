import ReminderView from "@/components/ReminderView";
import { remindersAtom } from "@/constants/atoms";
import { Reminder } from "@/constants/types";
import { useAtomValue } from "jotai";
import { useEffect } from "react";
import { Share, View, Text, FlatList, Button } from "react-native";

export default function SharePage() {
  async function shareReminder(reminder: Reminder) {
    const shareData = {
      title: reminder.title,
      message: reminder.description,
    };
    await Share.share(shareData);
  }

  const reminders = useAtomValue(remindersAtom);

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
        Share Reminders
      </Text>
      <FlatList
        data={reminders}
        renderItem={({ item }) => (
          <ReminderView reminder={item} onPress={() => shareReminder(item)} />
        )}
      />
    </View>
  );
}
