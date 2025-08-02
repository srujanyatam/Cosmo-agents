export interface Comment {
  id: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  file_id: string;
  file_name: string;
  comment: string;
  conversion_id?: string;
  user_email?: string; // For display purposes
}

export interface CommentInsert {
  file_id: string;
  file_name: string;
  comment: string;
  conversion_id?: string;
}

export interface CommentUpdate {
  id: string;
  comment: string;
}

export interface CommentWithUser extends Comment {
  user_email: string;
  user_name?: string;
} 