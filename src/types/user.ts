export interface User {
  id: number;
  name: string;
  email: string;
  role: 'student' | 'teacher' | 'admin';
  school_class?: SchoolClass | null;
  created_at?: string;
}

export interface SchoolClass {
  id: number;
  name: string;
  code: string;
  academic_year?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}
