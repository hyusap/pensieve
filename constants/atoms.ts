import { atomWithStorage, createJSONStorage } from "jotai/utils";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Reminder, Settings } from "./types";

function createAtomWithStorage<T>(key: string, initialValue: T) {
  const storage = createJSONStorage<T>(() => AsyncStorage);
  return atomWithStorage<T>(key, initialValue, storage);
}

export const remindersAtom = createAtomWithStorage<Reminder[]>("reminders", []);
export const numberOfRemindersCreatedAtom = createAtomWithStorage<number>(
  "numberOfRemindersCreated",
  0
);
export const numberOfRemindersCompletedAtom = createAtomWithStorage<number>(
  "numberOfRemindersCompleted",
  0
);
export const settingsAtom = createAtomWithStorage<Settings>("settings", {
  openaiApiKey: "",
});
