export interface Comment {
  id: string;
  user_id: string;
  unreviewed_file_id: string;
  content: string;
  line_number?: number;
  created_at: string;
  updated_at: string;
  user_email?: string; // For display purposes
}

export interface CommentInsert {
  unreviewed_file_id: string;
  content: string;
  line_number?: number;
}

export interface CommentUpdate {
  id: string;
  content: string;
  line_number?: number;
}

export interface CommentWithUser extends Comment {
  user_email: string;
  user_name?: string;
} 