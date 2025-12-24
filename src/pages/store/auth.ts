import { create } from "zustand";
import { persist } from "zustand/middleware";
import supabase from "@/utils/supabase";

export type AuthUser = {
  id: string;
  email?: string;
  role?: string; // sign-in.tsx에서 세팅 중 :contentReference[oaicite:5]{index=5}
  name?: string; // 헤더에서 표시용(없으면 profile.display_name 사용) :contentReference[oaicite:6]{index=6}
  avatarUrl?: string; // 헤더/카드에서 사용 :contentReference[oaicite:7]{index=7} :contentReference[oaicite:8]{index=8}
  isGuide?: boolean; // MyPage에서 사용 :contentReference[oaicite:9]{index=9}
};

type AuthStore = {
  user: AuthUser | null;
  setUser: (u: AuthUser | null) => void;
  reset: () => Promise<void>;
};

export const UseAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      setUser: (u) => set({ user: u }),
      reset: async () => {
        await supabase.auth.signOut();
        set({ user: null });
      },
    }),
    { name: "auth-store" }
  )
);
