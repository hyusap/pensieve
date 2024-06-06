import { Reminder } from "@/constants/types";
import { View, Text, Pressable } from "react-native";

interface ReminderViewProps {
  reminder: Reminder;
  onPress?: () => void;
}

export default function ReminderView({ reminder, onPress }: ReminderViewProps) {
  return (
    <Pressable
      style={{
        marginTop: 20,
        padding: 10,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
      }}
      onPress={onPress}
    >
      <Text style={{ fontWeight: "bold", fontSize: 18 }}>{reminder.title}</Text>
      <Text style={{ color: "#555", marginTop: 5 }}>
        Due Date: {reminder.dueDate}
      </Text>
      <Text style={{ color: "#555", marginTop: 5 }}>
        {reminder.description}
      </Text>
    </Pressable>
  );
}
