import ReminderView from "@/components/ReminderView";
import {
  numberOfRemindersCreatedAtom,
  remindersAtom,
  settingsAtom,
  transcriptionAtom,
} from "@/constants/atoms";
import { Reminder } from "@/constants/types";
import { FontAwesome5, FontAwesome6 } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAtom, useAtomValue } from "jotai";
import OpenAI from "openai";
import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Alert,
  StyleSheet,
} from "react-native";

import { v4 as uuidv4 } from "uuid";

export default function CreateModal() {
  const router = useRouter();

  const [transcription, setTranscription] = useAtom(transcriptionAtom);
  const settings = useAtomValue(settingsAtom);
  const [finalReminder, setFinalReminder] = useState<Reminder>();
  const [reminders, setReminders] = useAtom(remindersAtom);
  const [numberOfRemindersCreated, setNumberOfRemindersCreated] = useAtom(
    numberOfRemindersCreatedAtom
  );

  async function AIify() {
    if (settings.openaiApiKey === "") {
      Alert.alert("Error", "OpenAI API Key is not set");
      return;
    }
    const openai = new OpenAI({
      apiKey: settings.openaiApiKey,
    });

    if (transcription) {
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `You are ReminderBot. You will be provided with a transcription of what the user wants to remember. You should create a clear reminder with good english. The current date is ${new Date().toLocaleDateString()}.`,
          },
          { role: "user", content: transcription },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "create_reminder",
              description: "Create a reminder based on the user's input",
              parameters: {
                type: "object",
                properties: {
                  title: {
                    type: "string",
                    description: "The title of the reminder",
                  },
                  dueDate: {
                    type: "string",
                    description: "When the reminder should be due",
                  },
                  description: {
                    type: "string",
                    description: "The description of the reminder",
                  },
                },
              },
            },
          },
        ],
      });

      const toolCall =
        response.choices[0].message.tool_calls?.[0].function.arguments;
      if (toolCall) {
        const reminder = JSON.parse(toolCall);
        setFinalReminder({ ...reminder, uuid: uuidv4() });
      } else {
        alert("Error creating reminder");
      }
    }
  }

  async function saveReminder() {
    if (finalReminder) {
      setReminders([...reminders, finalReminder]);
      setNumberOfRemindersCreated(numberOfRemindersCreated + 1);
    }
    router.back();
  }

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}
    >
      <TextInput
        style={{
          width: "80%",
          height: 70,
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 10,
          padding: 10,
          backgroundColor: "white",
        }}
        onChangeText={(text) => setTranscription(text)}
        defaultValue={transcription}
      />
      <Pressable style={styles.button} onPress={AIify}>
        <Text
          style={{
            color: "white",
            fontSize: 20,
          }}
        >
          Create
        </Text>
        <FontAwesome6 name="wand-magic-sparkles" size={20} color="white" />
      </Pressable>
      {finalReminder && (
        <>
          <ReminderView reminder={finalReminder} />
          <Pressable style={styles.button} onPress={saveReminder}>
            <Text
              style={{
                color: "white",
                fontSize: 20,
              }}
            >
              Save
            </Text>
            <FontAwesome6 name="save" size={20} color="white" />
          </Pressable>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#007AFF",
    borderRadius: 20,
    padding: 20,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
});
