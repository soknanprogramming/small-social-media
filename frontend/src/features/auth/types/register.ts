export interface RegisterRequest {
  email: string;
  password: string;
  name?: string;
}
 
export interface RegisterResponse {
  email: string;
  name: string | null;
  id: string;
  createdAt: Date;
  updatedAt: Date;
}
