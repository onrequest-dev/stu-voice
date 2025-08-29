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

// types/NotificationItem.ts
export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  timestamp: number;
  url?: string;
}

export type CommentWithUser = {
  comment_id: number;
  content: string;
  created_at: string;
  post_id: number;
  comment_replied_to_id: number | null;
  replies_count: number;
  commenter_username: string;
  full_name: string;
  icon: { name?: string; color?: string; bgColor?: string } | null;
  icon_color: string | null;
  bg_color: string | null;
  study: string | null;
};
