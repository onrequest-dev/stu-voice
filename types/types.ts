// types/types.ts
export type EducationLevel = 'middle' | 'high' | 'university';

export interface UserEducation {
  level: EducationLevel;
  grade?: string;
  track?: string;
  degreeSeeking?: boolean;
  university?: string;
  faculty?: string;
  specialization?: string;
  year?: string;
  studentId?: string;
  icon?: {
    component: string; // اسم مكون الأيقونة (مثلاً 'FaUser')
    color: string; // لون الأيقونة
    bgColor: string; // لون خلفية الأيقونة
  };
}

export interface UserInfo {
  id: string;
  fullName: string;
  gender: Gender;
  education: UserEducation;
  description?:string;
}

export type Gender = 'male' | 'female';