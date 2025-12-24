import { create } from "zustand";

export type UserProfile = {
  id: string; // uuid (auth.users.id)
  role: "traveler" | "guide" | "admin";
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  phone: string | null;
  languages: string[]; // text[]
  home_location: string | null;
  is_guide: boolean;
  created_at: string;
  updated_at: string;

  birth_date: string | null; // date -> string
  job: string | null;
  school: string | null;
  interests: string[]; // text[]
};

type ProfileStore = {
  profile: UserProfile | null;
  setProfile: (p: UserProfile | null) => void;
  resetProfile: () => void;
};

export const UseProfileStore = create<ProfileStore>((set) => ({
  profile: null,
  setProfile: (profile) => set({ profile }),
  resetProfile: () => set({ profile: null }),
}));
