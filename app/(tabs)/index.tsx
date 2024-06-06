import { Button, Text, View, Image, Alert } from "react-native";
import { Audio } from "expo-av";
import { useState } from "react";
import OpenAI from "openai";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import { Reminder } from "@/constants/types";
import ReminderView from "@/components/ReminderView";

import { useAtom, useAtomValue } from "jotai";
import {
  numberOfRemindersCreatedAtom,
  remindersAtom,
  settingsAtom,
} from "@/constants/atoms";

export default function Index() {
  const [permissionResponse, requestPermission] = Audio.usePermissions();
  const [recording, setRecording] = useState<Audio.Recording>();
  const [transcription, setTranscription] = useState<string>("default");
  const [finalReminder, setFinalReminder] = useState<Reminder>();
  const settings = useAtomValue(settingsAtom);

  async function startRecording() {
    if (settings.openaiApiKey === "") {
      Alert.alert("Error", "OpenAI API Key is not set");
      return;
    }

    try {
      if (permissionResponse?.status !== "granted") {
        console.log("Requesting permission");
        await requestPermission();
      }
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync();
      setRecording(recording);
    } catch (error) {
      console.log("Error starting recording", error);
    }
  }

  async function stopRecording() {
    if (recording) {
      await recording.stopAndUnloadAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
      });
      const uri = recording.getURI();
      if (uri) {
        console.log("Recording saved to", uri);

        const formData = new FormData();
        formData.append("file", {
          uri,
          name: "test.m4a",
          type: "audio/m4a",
        } as any);
        formData.append("model", "whisper-1");

        const response = await fetch(
          "https://api.openai.com/v1/audio/transcriptions",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${settings.openaiApiKey}`,
              "Content-Type": "multipart/form-data",
            },
            body: formData,
          }
        );

        const trans = await response.json();
        console.log(trans);
        setTranscription(trans.text);
      }

      setRecording(undefined);
    }
  }

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
            content:
              "You are ReminderBot. You will be provided with a transcription of what the user wants to remember. You should create a clear reminder with good english.",
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

  const [reminders, setReminders] = useAtom(remindersAtom);
  const [numberOfRemindersCreated, setNumberOfRemindersCreated] = useAtom(
    numberOfRemindersCreatedAtom
  );

  async function saveReminder() {
    if (finalReminder) {
      setReminders([...reminders, finalReminder]);
      setNumberOfRemindersCreated(numberOfRemindersCreated + 1);
    }
  }

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Button title="Start Recording" onPress={startRecording} />
      <Button title="Stop Recording" onPress={stopRecording} />
      <Text>{transcription}</Text>
      <Button title="AIify" onPress={AIify} />
      {finalReminder && <ReminderView reminder={finalReminder} />}
      <Button title="Save Reminder" onPress={saveReminder} />
    </View>
  );
}
