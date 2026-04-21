import { create } from "zustand";
import type { DashboardStore } from "../model/dashboard";

export const useDashboardStore = create<DashboardStore>((set) => ({
  selectedProjectId: null,
  selectedTopicKey: null,
  topicFilter: "",
  setSelectedProjectId: (value) => set({ selectedProjectId: value }),
  setSelectedTopicKey: (value) => set({ selectedTopicKey: value }),
  setTopicFilter: (value) => set({ topicFilter: value })
}));
