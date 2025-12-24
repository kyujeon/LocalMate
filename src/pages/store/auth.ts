import type { AuthStore, User } from "@/types";
import supabase from "@/utils/supabase";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const UseAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      setUser: (newUser: User | null) => set({ user: newUser }),

      //* 로그아웃 (상태 + Supabase 세션 모두 제거)
      reset: async () => {
        await supabase.auth.signOut(); // supabase 세션 제거

        set({ user: null }); // zustand 상태 초기화
        localStorage.removeItem("auth-storage"); //로컬 스토리지 (auth-storgae) 제거
      },
    }),
    { name: "auth-storage" } //persist 로컬 스토리지 저장
  )
);
