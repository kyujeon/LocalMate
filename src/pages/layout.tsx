import { Outlet, useLocation, useNavigate } from "react-router";
import { useEffect } from "react";
import { Toaster } from "@/components/ui/sonner";

import supabase from "@/utils/supabase";
import { AppHeader, AppFooter } from "@/components/common";
import { UseAuthStore } from "./store/auth";
import { UseProfileStore } from "./store/ProfileStore";

function pickName(meta: any, email?: string | null) {
  return (
    meta?.full_name ||
    meta?.name ||
    meta?.given_name ||
    (email ? email.split("@")[0] : null) ||
    "User"
  );
}
function pickAvatar(meta: any) {
  return meta?.avatar_url || meta?.picture || null;
}

async function syncAll() {
  const { data } = await supabase.auth.getUser();
  const user = data.user;

  if (!user) {
    UseAuthStore.getState().setUser(null);
    UseProfileStore.getState().resetProfile();
    return;
  }

  UseAuthStore.getState().setUser({
    id: user.id,
    email: user.email ?? undefined,
  });

  // ✅ 0 row면 error 대신 data:null 로 받기 위해 maybeSingle()
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (error) {
    console.error("profiles select error:", error);
    return;
  }

  // 없으면 생성
  if (!profile) {
    const fallbackName = pickName(user.user_metadata, user.email);
    const fallbackAvatar = pickAvatar(user.user_metadata);

    const created = await supabase
      .from("profiles")
      .insert({
        id: user.id,
        role: "traveler",
        display_name: fallbackName,
        avatar_url: fallbackAvatar,
        is_guide: false,
        interests: [],
        languages: [],
      })
      .select("*")
      .single();

    if (created.error || !created.data) {
      console.error("profiles insert error:", created.error);
      return;
    }

    UseProfileStore.getState().setProfile(created.data);
    return;
  }

  // 있으면(보강 필요 시만)
  const fallbackName = pickName(user.user_metadata, user.email);
  const fallbackAvatar = pickAvatar(user.user_metadata);

  const patch: any = {};
  if (!profile.display_name) patch.display_name = fallbackName;
  if (!profile.avatar_url && fallbackAvatar) patch.avatar_url = fallbackAvatar;

  if (Object.keys(patch).length > 0) {
    const updated = await supabase
      .from("profiles")
      .update(patch)
      .eq("id", user.id)
      .select("*")
      .single();

    if (!updated.error && updated.data) {
      UseProfileStore.getState().setProfile(updated.data);
      return;
    }
  }

  UseProfileStore.getState().setProfile(profile);
}

export default function RootLayout() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    syncAll();

    // ✅ 구글 로그인/리다이렉트 직후 세션 변화를 즉시 반영
    const { data: sub } = supabase.auth.onAuthStateChange(async (event) => {
      await syncAll();
      if (event === "SIGNED_OUT") navigate("/", { replace: true });
    });

    return () => sub.subscription.unsubscribe();
  }, [navigate]);

  // ✅ 로그아웃 상태에서 my-page/edit 접근 방지
  useEffect(() => {
    const user = UseAuthStore.getState().user;
    if (!user && pathname.startsWith("/my-page")) {
      navigate("/", { replace: true });
    }
  }, [pathname, navigate]);

  return (
    <div className="min-h-dvh flex flex-col">
      <AppHeader />
      <main className="flex-1 pt-12 flex justify-center">
        <Outlet />
      </main>
      <AppFooter />
      <Toaster position="top-center" richColors />
    </div>
  );
}
