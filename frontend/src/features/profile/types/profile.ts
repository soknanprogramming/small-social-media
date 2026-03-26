export interface ProfileResponse {
  id: string;
  email: string;
  name: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
}
