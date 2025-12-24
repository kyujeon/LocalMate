import { ShieldCheck } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UseAuthStore } from "@/pages/store/auth";
import { UseProfileStore } from "../store/ProfileStore";

import {
  Plane,
  Camera,
  Palette,
  Utensils,
  Music,
  Film,
  Dumbbell,
  Mountain,
  Coffee,
} from "lucide-react";

const INTEREST_ICON_MAP: Record<string, any> = {
  여행: Plane,
  사진: Camera,
  디자인: Palette,
  음식: Utensils,
  음악: Music,
  영화: Film,
  운동: Dumbbell,
  자연: Mountain,
  카페: Coffee,
};

export function ProfileCard() {
  const user = UseAuthStore((s) => s.user);
  const profile = UseProfileStore((s) => s.profile);

  if (!user || !profile) return null;

  return (
    <div className="bg-white rounded-2xl shadow-sm px-8 py-6 max-w-[640px]">
      <div className="flex items-start gap-6">
        {/* 아바타 */}
        <div className="relative">
          <Avatar className="w-20 h-20">
            <AvatarImage src={profile.avatar_url ?? user.avatarUrl} />
            <AvatarFallback className="text-xl">
              {user.email?.[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>

          {/* 인증 배지 */}
          <div className="absolute -bottom-1 -right-1 bg-pink-500 rounded-full p-1">
            <ShieldCheck size={14} className="text-white" />
          </div>
        </div>

        {/* 이름 + 정보 */}
        <div className="flex-1">
          <p className="text-lg font-semibold">{profile.name ?? user.email}</p>

          <p className="text-sm text-muted-foreground">서울, 한국</p>

          {/* ✅ 자기소개 */}
          {profile.bio && (
            <p className="mt-3 text-sm text-gray-700 leading-relaxed">
              {profile.bio}
            </p>
          )}

          {/* 통계 (임시) */}
          <div className="flex gap-6 mt-4">
            <Stat label="여행" value="0회" />
            <Stat label="후기" value="0개" />
            <Stat label="가입 기간" value="0년" />
          </div>

          {/* ✅ 관심사 */}
          {profile.interests && profile.interests.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {profile.interests.map((item) => {
                const Icon = INTEREST_ICON_MAP[item];

                return (
                  <span
                    key={item}
                    className="flex items-center gap-1 px-3 py-1 text-xs rounded-full bg-gray-100"
                  >
                    {Icon && <Icon size={14} />}
                    {item}
                  </span>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-semibold text-sm">{value}</p>
    </div>
  );
}

export default ProfileCard;
