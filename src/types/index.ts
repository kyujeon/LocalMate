export interface User {
  id: string;
  email?: string;
  name?: string;
  avatarUrl?: string;
  role?: string;
}

export interface AuthStore {
  user: User | null;
  setUser: (paramter: User | null) => void;
  reset: () => Promise<void>;
}

export interface UserProfile {
  user_uid: string;

  name: string | null;
  nickname: string | null;
  avatar_url: string | null;
  bio: string | null;

  birth_date: string | null;
  home_location: string | null;
  my_language: string | null;

  job: string | null;
  school: string | null;

  interests: string[] | null;

  phone: string | null;
  phone_verified: boolean;

  is_guide: boolean;
}
