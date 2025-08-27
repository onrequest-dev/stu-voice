export interface UserInfo {
  id: string;
  iconName: string;
  iconColor: string;
  bgColor: string;
  fullName: string;
  study: string;
  disableLinks?:boolean;
}

export interface Opinion {
  text: string;
  agreeCount: number;
  disagreeCount: number;
  readersCount: number;
  commentsCount?: number;
}

export interface Poll {
  question: string;
  options: string[];
  votes?: number[];
 durationInDays: number;
}

export interface PostProps {
  id: string;
  userInfo: UserInfo;
  opinion?: Opinion | null;
  poll?: Poll | null;
  createdAt?: string;
  showDiscussIcon?: boolean
}

export interface ReplyType {
  id: string;
  userId: string;
  text: string;
  timestamp: string;
  repliedToUserId?: string;
}