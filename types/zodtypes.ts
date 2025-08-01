import { user_name_shouldbe_at_least_n_characters, user_name_shouldbe_at_most_n_characters, password_should_be_at_least_n_characters, password_shouldbe_at_most_n_characters } from '@/static/keywords';
import { z } from 'zod';

// Gender schema
 const GenderSchema = z.enum(['male', 'female']);

// EducationLevel schema
 const EducationLevelSchema = z.enum(['middle', 'high', 'university']);

// Icon schema
 const IconSchema = z.object({
  component: z.string(),
  color: z.string(),
  bgColor: z.string(),
});

// UserEducation schema
 const UserEducationSchema = z.object({
  level: EducationLevelSchema,
  grade: z.string().optional(),
  track: z.string().optional(),
  degreeSeeking: z.boolean().optional(),
  university: z.string().optional(),
  faculty: z.string().optional(),
  specialization: z.string().optional(),
  year: z.string().optional(),
  studentId: z.string().optional(),
  icon: IconSchema.optional(),
});

// UserInfo schema
 export const UserInfoSchema = z.object({
  id: z.string(),
  fullName: z.string(),
  gender: GenderSchema,
  education: UserEducationSchema,
});



export const userSchema = z.object({
  username: z.string()
    .min(4, user_name_shouldbe_at_least_n_characters)
    .max(20, user_name_shouldbe_at_most_n_characters),
  password: z.string()
    .min(6, password_should_be_at_least_n_characters)
    .max(64, password_shouldbe_at_most_n_characters),
  fingerprint: z
    .object({})
    .passthrough()
    .optional(), // ← يمكن أن تكون موجودة أو لا
});
export type jwt_user = {
    user_name: string;
    ip: string;

}
