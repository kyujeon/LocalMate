import { create } from "zustand";
import type { UserProfile } from "@/types";

interface ProfileStore {
  profile: UserProfile | null;
  setProfile: (profile: UserProfile | null) => void;
  resetProfile: () => void;
}

export const UseProfileStore = create<ProfileStore>((set) => ({
  profile: null,
  setProfile: (profile) => set({ profile }),
  resetProfile: () => set({ profile: null }),
}));
