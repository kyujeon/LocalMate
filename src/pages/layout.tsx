import { Outlet, useLocation } from "react-router";
import { useEffect } from "react";
import { Toaster } from "@/components/ui/sonner";
import { AppHeader, AppFooter } from "@/components/common";

import supabase from "@/utils/supabase";
import { UseAuthStore } from "./store/auth";
import { UseProfileStore } from "./store/ProfileStore";

function RootLayout() {
  const { pathname } = useLocation();

  /* ================= 스크롤 최상단 ================= */
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  /* ================= Auth + Profile 동기화 (핵심) ================= */
  useEffect(() => {
    const syncProfile = async () => {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) return;

      const user = auth.user;

      // 1️⃣ profiles 조회
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_uid", user.id)
        .single();

      // 2️⃣ profile 없으면 생성 (email / google 모두 대응)
      if (!profile) {
        const fallbackName =
          user.user_metadata?.name ?? user.email?.split("@")[0] ?? "User";

        const { data: newProfile } = await supabase
          .from("profiles")
          .insert({
            user_uid: user.id,
            name: fallbackName,
            avatar_url: user.user_metadata?.avatar_url ?? null,
            is_guide: false,
          })
          .select()
          .single();

        // ProfileStore
        UseProfileStore.getState().setProfile(newProfile);

        // AuthStore
        UseAuthStore.getState().setUser({
          id: user.id,
          email: user.email ?? undefined,
          name: newProfile?.name ?? undefined,
          avatarUrl: newProfile?.avatar_url ?? undefined,
        });

        return;
      }

      // 3️⃣ profile 있으면 그대로 세팅
      UseProfileStore.getState().setProfile(profile);

      UseAuthStore.getState().setUser({
        id: user.id,
        email: user.email ?? undefined,
        name: profile.name ?? undefined,
        avatarUrl: profile.avatar_url ?? undefined,
      });
    };

    syncProfile();
  }, []);

  /* ================= Layout ================= */
  return (
    <div className="relative flex flex-col items-center w-full">
      <div className="w-full flex flex-col">
        <AppHeader />

        <main className="w-full flex-1 flex justify-center mt-12">
          <Outlet />
        </main>

        <AppFooter />
        <Toaster position="top-center" richColors />
      </div>
    </div>
  );
}

export default RootLayout;
