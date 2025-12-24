import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Label,
  Separator,
} from "../ui";

import { NavLink, useNavigate } from "react-router";
import { Switch } from "../ui/switch";
import { useState } from "react";
import { UseAuthStore } from "@/pages/store/auth";
import { UseProfileStore } from "@/pages/store/ProfileStore";

export function LocationMap() {
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(
    null
  );

  const getLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      () => alert("위치 접근이 거부되었습니다.")
    );
  };

  return (
    <div className="space-y-4">
      <Button onClick={getLocation}>내 위치 찾기</Button>

      {coords && (
        <iframe
          title="map"
          width="100%"
          height="300"
          loading="lazy"
          className="rounded-md border"
          src={`https://maps.google.com/maps?q=${coords.lat},${coords.lng}&z=15&output=embed`}
        />
      )}
    </div>
  );
}

function AppHeader() {
  const user = UseAuthStore((state) => state.user);
  const reset = UseAuthStore((state) => state.reset);
  const profile = UseProfileStore((state) => state.profile);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await reset();
    UseProfileStore.getState().resetProfile();
    navigate("/", { replace: true });
  };

  const title = profile?.display_name ?? user?.email ?? "User";

  return (
    <header className="fixed z-20 w-full min-h-12 h-12 flex items-center justify-center p-5 bg-white shadow-sm">
      <div className="w-full h-full max-w-[1328px] flex items-center justify-between">
        <div className="flex items-center gap-4">
          <NavLink to={"/"}>
            <img src="/logo/logo.png" alt="@LOGO" className="w-36" />
          </NavLink>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center space-x-2">
            <Switch id="guide-mode" />
            <Label htmlFor="guide-mode">Guide Mode</Label>
          </div>

          <Separator orientation="vertical" className="h-4" />

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost">Location</Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>현재 위치를 알려주세요!</DialogTitle>
                <DialogDescription>
                  주변 가이드를 추천하기 위해 위치가 필요합니다.😎
                </DialogDescription>
              </DialogHeader>

              <LocationMap />
            </DialogContent>
          </Dialog>

          <Separator orientation="vertical" className="h-4" />

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={profile?.avatar_url ?? user.avatarUrl} />
                    <AvatarFallback>
                      {(title?.[0] ?? "U").toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{title}</span>
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => navigate("/my-page")}>
                  My Page
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-red-500"
                  onClick={handleLogout}
                >
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <NavLink to="/sign-in">
              <Button variant="ghost">Log in</Button>
            </NavLink>
          )}
        </div>
      </div>
    </header>
  );
}

export { AppHeader };
