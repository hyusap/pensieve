export interface Reminder {
  title: string;
  dueDate: string;
  description: string;
  uuid: string;
}

export interface Settings {
  openaiApiKey: string;
}
