export interface ProfileResponse {
  id: string;
  email: string;
  name: string | null;
  bio: string | null;
  avatarUrl: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
}
