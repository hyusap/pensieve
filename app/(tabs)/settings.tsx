import { remindersAtom, settingsAtom } from "@/constants/atoms";
import { useAtom } from "jotai";
import { Button, Text, View, Alert } from "react-native";

export default function Settings() {
  const [settings, setSettings] = useAtom(settingsAtom);
  const [reminders, setReminders] = useAtom(remindersAtom);

  async function setAPIKey() {
    Alert.prompt(
      "Update Key",
      "Enter your OpenAI API key",
      (value) => {
        if (value) {
          setSettings({ ...settings, openaiApiKey: value });
        }
      },
      "secure-text"
    );
  }

  async function clearAllReminders() {
    setReminders([]);
  }

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>OpenAI API Key: {settings.openaiApiKey}</Text>
      <Button title="Set OpenAI API Key" onPress={setAPIKey} />
      <Button title="Clear all reminders" onPress={clearAllReminders} />
    </View>
  );
}
