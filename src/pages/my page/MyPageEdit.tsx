import { useEffect, useState } from "react";
import supabase from "@/utils/supabase";

import { UseAuthStore } from "@/pages/store/auth";
import { Switch } from "@/components/ui/switch";
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

import { UseProfileStore } from "../store/ProfileStore";

function MyPageEdit() {
  const user = UseAuthStore((s) => s.user);
  const setUser = UseAuthStore((s) => s.setUser);

  const profile = UseProfileStore((s) => s.profile);
  const setProfile = UseProfileStore((s) => s.setProfile);
  const navigate = useNavigate();

  /* ================= state ================= */

  const [name, setName] = useState("");
  const [birth, setBirth] = useState("");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [job, setJob] = useState("");
  const [school, setSchool] = useState("");
  const [bio, setBio] = useState("");
  const [showTravel, setShowTravel] = useState(true);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [interestOpen, setInterestOpen] = useState(false);

  /* ================= 초기값 세팅 ================= */

  useEffect(() => {
    if (!profile) return;

    setName(profile.name ?? "");
    setBirth(profile.birth_date ?? "");
    setJob(profile.job ?? "");
    setSchool(profile.school ?? "");
    setBio(profile.bio ?? "");
    setSelectedInterests(profile.interests ?? []);
    setAvatarPreview(profile.avatar_url ?? null);
  }, [profile]);

  /* ================= 관심사 ================= */

  const INTERESTS = [
    { label: "여행", icon: Plane },
    { label: "사진", icon: Camera },
    { label: "디자인", icon: Palette },
    { label: "음식", icon: Utensils },
    { label: "음악", icon: Music },
    { label: "영화", icon: Film },
    { label: "운동", icon: Dumbbell },
    { label: "자연", icon: Mountain },
    { label: "카페", icon: Coffee },
  ];

  const toggleInterest = (label: string) => {
    setSelectedInterests((prev) =>
      prev.includes(label) ? prev.filter((i) => i !== label) : [...prev, label]
    );
  };

  /* ================= 저장 ================= */

  const handleSave = async () => {
    if (!profile) return;

    const { error } = await supabase
      .from("profiles")
      .update({
        name,
        birth_date: birth || null,
        job,
        school,
        bio,
        interests: selectedInterests,
        updated_at: new Date().toISOString(),
      })
      .eq("user_uid", profile.user_uid);

    if (error) {
      console.error(error);
      toast.error("프로필 저장에 실패했어요");
      return;
    }

    // ✅ store 즉시 반영
    const updatedProfile = {
      ...profile,
      name,
      birth_date: birth || null,
      job,
      school,
      bio,
      interests: selectedInterests,
    };

    setProfile(updatedProfile);

    const currentUser = UseAuthStore.getState().user;

    if (currentUser) {
      setUser({
        ...currentUser,
        name,
      });
    }

    toast.success("프로필이 저장되었습니다");
    navigate("/my-page");
  };

  if (!user) return null;

  return (
    <div className="w-full flex justify-center bg-gray-50">
      <div className="w-full max-w-[420px] bg-white rounded-xl shadow-sm p-6 my-10">
        <h2 className="text-lg font-bold mb-6">프로필</h2>

        {/* ===== 프로필 기본 ===== */}
        <div className="flex items-center gap-4 mb-8">
          <div className="relative">
            <Avatar className="w-20 h-20">
              <AvatarImage src={avatarPreview ?? undefined} />
              <AvatarFallback className="text-xl">
                {user.email?.[0]?.toUpperCase()}
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
                }}
              />
            </label>
          </div>

          <div className="flex-1 space-y-3">
            <Field label="이름">
              <Input value={name} onChange={(e) => setName(e.target.value)} />
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

        <Section title="지금까지 가본 여행지">
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
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setInterestOpen(true)}
              >
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
                    >
                      <Icon size={18} />
                      {label}
                    </button>
                  );
                })}
              </div>

              <div className="flex justify-between mt-6">
                <p className="text-xs text-muted-foreground">
                  {selectedInterests.length}/20 선택됨
                </p>
                <Button
                  onClick={() => {
                    setInterestOpen(false);
                  }}
                >
                  확인
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* ✅ 선택된 관심사 미리보기 */}
          {selectedInterests.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {selectedInterests.map((item) => {
                const Icon = INTEREST_ICON_MAP[item];

                return (
                  <span
                    key={item}
                    className="
            flex items-center gap-1
            px-3 py-1
            text-xs
            rounded-full
            bg-gray-100
            text-gray-700
          "
                  >
                    {Icon && <Icon size={14} />}
                    {item}
                  </span>
                );
              })}
            </div>
          )}
        </Section>

        <Button className="w-full mt-6" onClick={handleSave}>
          저장
        </Button>
      </div>
    </div>
  );
}

/* ================= 공통 ================= */

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-6">
      <h3 className="text-sm font-semibold mb-3">{title}</h3>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="text-xs text-gray-500 mb-1 block">{label}</label>
      {children}
    </div>
  );
}

export default MyPageEdit;
