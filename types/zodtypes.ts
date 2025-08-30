import { user_name_shouldbe_at_least_n_characters, user_name_shouldbe_at_most_n_characters, password_should_be_at_least_n_characters, password_shouldbe_at_most_n_characters, username_invalid_characters } from '@/static/keywords';
import { z } from 'zod';

// Gender schema
 const GenderSchema = z.enum(['male', 'female']);

// EducationLevel schema
 const EducationLevelSchema = z.enum(['middle', 'high', 'university']);


const IconSchema = z.object({
  component: z.enum([
    "user",
    "graduation",
    "school",
    "university",
    "book",
    "open-book",
    "graduate",
    "teacher",
    "atom",
    "flask",
    "calculator",
    "microscope",
    "dna",
    "lightbulb",
    "satellite",
    "rocket",
    "wind",
    "solar-panel",
    "stethoscope",
    "heartbeat",
    "pills",
    "clinic",
    "syringe",
    "bone",
    "eye",
    "teeth",
    "allergies",
    "weight",
    "dumbbell",
    "basketball",
    "table-tennis",
    "swimming",
    "running",
    "biking",
    "football",
    "carrot",
    "apple",
    "hamburger",
    "pizza",
    "ice-cream",
    "music",
    "paint",
    "palette",
    "camera",
    "code",
    "robot",
    "globe",
    "history",
    "language",
    "brain",
    "chess",
    "seedling",
    "chart",
  ]),
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
  fullName: z.string().min(4).max(20),
  gender: GenderSchema,
  education: UserEducationSchema,
});



export const userSchema = z.object({
  username: z.string()
    .min(4, user_name_shouldbe_at_least_n_characters)
    .max(20, user_name_shouldbe_at_most_n_characters)
    .regex(/^[a-zA-Z_]+$/, username_invalid_characters),
    
  password: z.string()
    .min(6, password_should_be_at_least_n_characters)
    .max(64, password_shouldbe_at_most_n_characters),

  fingerprint: z
    .object({})
    .passthrough()
    .optional(),
});
export type jwt_user = {
    user_name: string;
    ip: string;

}
