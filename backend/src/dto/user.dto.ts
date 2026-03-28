// dto/user.dto.ts
export class UserProfileResponseDto {
  id: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;
  bio: string | null;
  createdAt: Date;

  constructor(user: {
    id: string;
    email: string;
    name: string | null;
    avatarUrl: string | null;
    bio: string | null;
    createdAt: Date;
  }) {
    this.id = user.id;
    this.email = user.email;
    this.name = user.name;
    this.avatarUrl = user.avatarUrl;
    this.bio = user.bio;
    this.createdAt = user.createdAt;
  }
}