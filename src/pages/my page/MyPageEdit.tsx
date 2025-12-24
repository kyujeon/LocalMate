import { useEffect, useMemo, useState } from "react";
import supabase from "@/utils/supabase";

import { UseAuthStore } from "@/pages/store/auth";
import { UseProfileStore } from "../store/ProfileStore";

import { toast } from "sonner";
import { useNavigate } from "react-router";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  Textarea,
} from "@/components/ui";

import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";

import {
  Camera,
  Plane,
  Palette,
  Utensils,
  Music,
  Film,
  Dumbbell,
  Mountain,
  Coffee,
} from "lucide-react";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <p className="text-xs text-muted-foreground">{label}</p>
      {children}
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-8">
      <h3 className="text-sm font-semibold mb-3">{title}</h3>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function MyPageEdit() {
  const navigate = useNavigate();
  const authUser = UseAuthStore((s) => s.user);
  const setAuthUser = UseAuthStore((s) => s.setUser);

  const profile = UseProfileStore((s) => s.profile);
  const setProfile = UseProfileStore((s) => s.setProfile);

  const [displayName, setDisplayName] = useState("");
  const [birth, setBirth] = useState("");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [job, setJob] = useState("");
  const [school, setSchool] = useState("");
  const [bio, setBio] = useState("");
  const [showTravel, setShowTravel] = useState(true); // (아직 DB 저장 안 함)
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [interestOpen, setInterestOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  // 로그아웃 상태로 edit에 남아있는 문제 방지
  useEffect(() => {
    if (!authUser) navigate("/", { replace: true });
  }, [authUser, navigate]);

  useEffect(() => {
    if (!profile) return;
    setDisplayName(profile.display_name ?? "");
    setBirth(profile.birth_date ?? "");
    setJob(profile.job ?? "");
    setSchool(profile.school ?? "");
    setBio(profile.bio ?? "");
    setSelectedInterests(profile.interests ?? []);
    setAvatarPreview(profile.avatar_url ?? null);
  }, [profile]);

  const INTERESTS = useMemo(
    () => [
      { label: "여행", icon: Plane },
      { label: "사진", icon: Camera },
      { label: "디자인", icon: Palette },
      { label: "음식", icon: Utensils },
      { label: "음악", icon: Music },
      { label: "영화", icon: Film },
      { label: "운동", icon: Dumbbell },
      { label: "자연", icon: Mountain },
      { label: "카페", icon: Coffee },
    ],
    []
  );

  const toggleInterest = (label: string) => {
    setSelectedInterests((prev) =>
      prev.includes(label) ? prev.filter((i) => i !== label) : [...prev, label]
    );
  };

  const handleSave = async () => {
    if (!authUser) return;
    setSaving(true);

    try {
      const { data, error } = await supabase
        .from("profiles")
        .update({
          display_name: displayName,
          birth_date: birth || null,
          job: job || null,
          school: school || null,
          bio: bio || null,
          interests: selectedInterests,
          // ⚠️ avatarPreview는 로컬 blob URL이라 DB에 저장하면 안 됨.
          // 스토리지 업로드 붙인 뒤 public URL 넣는 구조로 가자.
        })
        .eq("id", authUser.id)
        .select("*")
        .single();

      if (error || !data) {
        console.error(error);
        toast.error("프로필 저장에 실패했어요");
        return;
      }

      setProfile(data);
      setAuthUser({
        ...authUser,
        name: data.display_name ?? undefined,
        avatarUrl: data.avatar_url ?? undefined,
        isGuide: !!data.is_guide,
      });

      toast.success("프로필이 저장되었습니다");
      navigate("/my-page");
    } finally {
      setSaving(false);
    }
  };

  if (!authUser) return null;

  const selectedMap = new Map(INTERESTS.map((x) => [x.label, x.icon]));

  return (
    <div className="w-full flex justify-center bg-gray-50">
      <div className="w-full max-w-[420px] bg-white rounded-xl shadow-sm p-6 my-10">
        <h2 className="text-lg font-bold mb-6">프로필</h2>

        <div className="flex items-center gap-4 mb-8">
          <div className="relative">
            <Avatar className="w-20 h-20">
              <AvatarImage
                src={avatarPreview ?? profile?.avatar_url ?? undefined}
              />
              <AvatarFallback className="text-xl">
                {(displayName || authUser.email || "U")[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <label className="absolute -bottom-1 -right-1 bg-black text-white text-xs px-2 py-1 rounded-full cursor-pointer">
              사진 변경
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  setAvatarPreview(URL.createObjectURL(file));
                  toast.message(
                    "사진 업로드는 다음 단계(스토리지)에서 연결할게요."
                  );
                }}
              />
            </label>
          </div>

          <div className="flex-1 space-y-3">
            <Field label="이름">
              <Input
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
              />
            </Field>

            <Field label="생년월일">
              <Input
                type="date"
                value={birth}
                onChange={(e) => setBirth(e.target.value)}
              />
            </Field>
          </div>
        </div>

        <Section title="기본 정보 (선택)">
          <Field label="직업 / 직장">
            <Input value={job} onChange={(e) => setJob(e.target.value)} />
          </Field>

          <Field label="출신 학교">
            <Input value={school} onChange={(e) => setSchool(e.target.value)} />
          </Field>
        </Section>

        <Section title="자기소개">
          <Textarea value={bio} onChange={(e) => setBio(e.target.value)} />
        </Section>

        <Section title="이전 여행 표시 (임시)">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              프로필에 이전 여행을 표시합니다
            </p>
            <Switch checked={showTravel} onCheckedChange={setShowTravel} />
          </div>
        </Section>

        <Section title="관심사">
          <Dialog open={interestOpen} onOpenChange={setInterestOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full">
                관심 분야 추가하기
              </Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>어떤 분야에 관심이 가시나요?</DialogTitle>
              </DialogHeader>

              <div className="grid grid-cols-3 gap-3 mt-6">
                {INTERESTS.map(({ label, icon: Icon }) => {
                  const active = selectedInterests.includes(label);
                  return (
                    <button
                      key={label}
                      onClick={() => toggleInterest(label)}
                      className={`border rounded-xl py-3 text-sm flex flex-col items-center gap-1 ${
                        active
                          ? "border-black bg-gray-100 font-semibold"
                          : "hover:bg-gray-50"
                      }`}
                      type="button"
                    >
                      <Icon size={18} />
                      {label}
                    </button>
                  );
                })}
              </div>

              <div className="flex justify-end mt-6">
                <Button type="button" onClick={() => setInterestOpen(false)}>
                  완료
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* ✅ 아이콘+배지로 선택된 관심사 표시 */}
          {selectedInterests.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {selectedInterests.map((x) => {
                const Icon = selectedMap.get(x);
                return (
                  <Badge key={x} variant="secondary" className="gap-1">
                    {Icon && <Icon size={14} />}
                    {x}
                  </Badge>
                );
              })}
            </div>
          )}
        </Section>

        <div className="flex gap-2 mt-10">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => navigate("/my-page")}
            disabled={saving}
          >
            취소
          </Button>
          <Button className="w-full" onClick={handleSave} disabled={saving}>
            {saving ? "저장 중..." : "저장"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default MyPageEdit;
