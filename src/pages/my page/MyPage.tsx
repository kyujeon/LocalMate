import { useState } from "react";
import { UseAuthStore } from "@/pages/store/auth";
import { User, Map, Users, CreditCard, Package } from "lucide-react";
import { ProfileCard } from "./ProfileCard";

function MyPage() {
  const user = UseAuthStore((state) => state.user);
  const [menu, setMenu] = useState("intro");

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-[1200px] flex gap-10 px-8 py-10">
        {/* 왼쪽 사이드 */}
        <aside className="w-[260px]">
          <h2 className="text-xl font-bold mb-6">프로필</h2>

          <MenuItem
            icon={User}
            active={menu === "intro"}
            onClick={() => setMenu("intro")}
          >
            자기소개
          </MenuItem>
          <MenuItem
            icon={Map}
            active={menu === "travel"}
            onClick={() => setMenu("travel")}
          >
            이전 여행
          </MenuItem>
          <MenuItem
            icon={Users}
            active={menu === "relation"}
            onClick={() => setMenu("relation")}
          >
            인연
          </MenuItem>
          <MenuItem
            icon={CreditCard}
            active={menu === "payment"}
            onClick={() => setMenu("payment")}
          >
            결제수단 관리
          </MenuItem>

          {/* ⭐ 가이드일 때만 */}
          {user?.role === "guide" && (
            <MenuItem
              icon={Package}
              active={menu === "guide"}
              onClick={() => setMenu("guide")}
            >
              가이드 상품 관리
            </MenuItem>
          )}
        </aside>

        {/* 오른쪽 내용 */}
        <main className="flex-1">
          {/* 제목 + 수정 버튼 */}
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-2xl font-bold">자기소개</h2>
            <button
              className="text-sm px-3 py-1 rounded-full border hover:bg-gray-50"
              onClick={() => {
                // 나중에 edit 페이지로 이동
                window.location.href = "/my-page/edit";
              }}
            >
              수정
            </button>
          </div>

          <ProfileCard user={user} />
        </main>
      </div>
    </div>
  );
}

function MenuItem({ icon: Icon, active, children, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-1
        ${
          active
            ? "bg-gray-100 font-semibold"
            : "hover:bg-gray-50 text-gray-600"
        }
      `}
    >
      <Icon size={18} />
      {children}
    </button>
  );
}

export default MyPage;
