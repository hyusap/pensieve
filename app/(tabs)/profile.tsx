import {
  numberOfRemindersCompletedAtom,
  numberOfRemindersCreatedAtom,
} from "@/constants/atoms";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";

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
    <View style={styles.container}>
      <Text style={styles.header}>Profile</Text>
      <View style={styles.statsContainer}>
        <Text style={styles.statText}>Number of reminders created:</Text>
        <Text style={styles.statNumber}>{numberOfRemindersCreated}</Text>
      </View>
      <View style={styles.statsContainer}>
        <Text style={styles.statText}>Number of reminders completed:</Text>
        <Text style={styles.statNumber}>{numberOfRemindersCompleted}</Text>
      </View>
      <Pressable style={styles.button} onPress={clearAllStats}>
        <Text style={styles.buttonText}>Clear all stats</Text>
      </Pressable>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f4f7",
    padding: 20,
  },
  header: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  statsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  statText: {
    fontSize: 18,
    color: "#555",
  },
  statNumber: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#007AFF",
    marginLeft: 5,
  },
  button: {
    marginTop: 20,
    backgroundColor: "#007AFF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
