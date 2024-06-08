import {
  Button,
  Text,
  View,
  Image,
  Alert,
  Pressable,
  StyleSheet,
} from "react-native";
import { Audio } from "expo-av";
import { useState } from "react";
import OpenAI from "openai";
import "react-native-get-random-values";

import { Reminder } from "@/constants/types";
import ReminderView from "@/components/ReminderView";

import { useAtom, useAtomValue } from "jotai";
import {
  numberOfRemindersCreatedAtom,
  remindersAtom,
  settingsAtom,
  transcriptionAtom,
} from "@/constants/atoms";
import { FontAwesome5 } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function Index() {
  const [permissionResponse, requestPermission] = Audio.usePermissions();
  const [recording, setRecording] = useState<Audio.Recording>();

  const settings = useAtomValue(settingsAtom);
  const [transcription, setTranscription] = useAtom(transcriptionAtom);

  const router = useRouter();

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
      setRecording(undefined);
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
        router.push("/createModal");
      }
    }
  }

  const [reminders, setReminders] = useAtom(remindersAtom);
  const [numberOfRemindersCreated, setNumberOfRemindersCreated] = useAtom(
    numberOfRemindersCreatedAtom
  );

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* <Button title="Start Recording" onPress={startRecording} />
      <Button title="Stop Recording" onPress={stopRecording} />
      <Text>{transcription}</Text>
      <Button title="AIify" onPress={AIify} />
      {finalReminder && <ReminderView reminder={finalReminder} />}
      <Button title="Save Reminder" onPress={saveReminder} /> */}
      {recording ? (
        <Pressable style={styles.button} onPress={stopRecording}>
          <FontAwesome5 name="pause" size={200} color="white" />
        </Pressable>
      ) : (
        <Pressable style={styles.button} onPress={startRecording}>
          <FontAwesome5 name="microphone" size={200} color="white" />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#007AFF",
    borderRadius: 9999,
    padding: 50,
    aspectRatio: 1,
  },
});
