import { ShieldCheck } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

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

  const title = profile.display_name ?? user.email ?? "User";

  return (
    <Card className="w-full max-w-[720px]">
      <CardHeader className="flex flex-row items-start justify-between">
        <div className="flex items-start gap-4">
          <div className="relative">
            <Avatar className="w-16 h-16">
              <AvatarImage src={profile.avatar_url ?? user.avatarUrl} />
              <AvatarFallback className="text-lg">
                {title[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-1 -right-1 bg-pink-500 rounded-full p-1">
              <ShieldCheck size={14} className="text-white" />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <p className="text-lg font-semibold">{title}</p>
              {profile.is_guide && <Badge variant="secondary">Guide</Badge>}
            </div>

            {profile.home_location && (
              <p className="text-sm text-muted-foreground">
                {profile.home_location}
              </p>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {profile.bio && (
          <p className="text-sm leading-relaxed text-gray-700">{profile.bio}</p>
        )}

        {(profile.job || profile.school || profile.birth_date) && (
          <>
            <Separator />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
              {profile.job && (
                <div>
                  <p className="text-xs text-muted-foreground">직업</p>
                  <p className="font-medium">{profile.job}</p>
                </div>
              )}
              {profile.school && (
                <div>
                  <p className="text-xs text-muted-foreground">학교</p>
                  <p className="font-medium">{profile.school}</p>
                </div>
              )}
              {profile.birth_date && (
                <div>
                  <p className="text-xs text-muted-foreground">생년월일</p>
                  <p className="font-medium">{profile.birth_date}</p>
                </div>
              )}
            </div>
          </>
        )}

        {profile.interests?.length > 0 && (
          <>
            <Separator />
            <div className="flex flex-wrap gap-2">
              {profile.interests.map((item) => {
                const Icon = INTEREST_ICON_MAP[item];
                return (
                  <Badge key={item} variant="secondary" className="gap-1">
                    {Icon && <Icon size={14} />}
                    {item}
                  </Badge>
                );
              })}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
export default ProfileCard;
