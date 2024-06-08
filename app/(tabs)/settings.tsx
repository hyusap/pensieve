import { remindersAtom, settingsAtom } from "@/constants/atoms";
import { useAtom } from "jotai";
import { Button, Text, View, Alert, StyleSheet, TextInput } from "react-native";
import { useState } from "react";

export default function Settings() {
  const [settings, setSettings] = useAtom(settingsAtom);
  const [reminders, setReminders] = useAtom(remindersAtom);
  const [apiKeyInput, setApiKeyInput] = useState("");

  async function setAPIKey() {
    if (apiKeyInput) {
      setSettings({ ...settings, openaiApiKey: apiKeyInput });
      Alert.alert("Success", "API Key updated successfully");
    } else {
      Alert.alert("Error", "API Key cannot be empty");
    }
  }

  async function clearAllReminders() {
    setReminders([]);
    Alert.alert("Success", "All reminders cleared");
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>OpenAI API Key:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your OpenAI API key"
        placeholderTextColor={"#ccc"}
        secureTextEntry
        value={apiKeyInput}
        onChangeText={setApiKeyInput}
      />
      <Button title="Set OpenAI API Key" onPress={setAPIKey} />
      <Button title="Clear all reminders" onPress={clearAllReminders} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f0f4f7",
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  input: {
    width: "80%",
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
    backgroundColor: "white",
  },
});
