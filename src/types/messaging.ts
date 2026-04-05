import { Member } from '@/hooks/useAuth';

export interface MessagingRoom {
  id: string;
  name: string | null;
  is_group: boolean;
  created_at: string;
  last_message_at: string;
  members?: Member[];
  unread_count: number;
}

export interface MessagingMessage {
  id: string;
  room_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  sender?: Member;
}

export interface WorkspaceGroup {
  id: string;
  name: string;
  description: string | null;
  tag: string | null;
  created_at: string;
  created_by: string;
}

export interface WorkspacePost {
  id: string;
  group_id: string;
  author_id: string;
  content: string;
  created_at: string;
  author?: Member;
  comments_count?: number;
}

export interface WorkspaceComment {
  id: string;
  post_id: string;
  author_id: string;
  content: string;
  created_at: string;
  author?: Member;
}

export interface AppNotification {
  id: string;
  recipient_id: string;
  type: 'message' | 'comment' | 'mention';
  data: any;
  is_read: boolean;
  created_at: string;
}
