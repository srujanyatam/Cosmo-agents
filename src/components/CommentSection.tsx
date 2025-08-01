import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Trash2, Edit, MessageSquare, Plus } from 'lucide-react';
import { Comment, CommentInsert } from '@/types';
import { getComments, addComment, updateComment, deleteComment } from '@/utils/databaseUtils';
import { useAuth } from '@/hooks/useAuth';

interface CommentSectionProps {
  unreviewedFileId: string;
  className?: string;
}

export const CommentSection: React.FC<CommentSectionProps> = ({
  unreviewedFileId,
  className = ''
}) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    loadComments();
  }, [unreviewedFileId]);

  const loadComments = async () => {
    setIsLoading(true);
    try {
      const fetchedComments = await getComments(unreviewedFileId);
      setComments(fetchedComments);
    } catch (error) {
      console.error('Error loading comments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !user) return;

    setIsLoading(true);
    try {
      const commentData: CommentInsert = {
        unreviewed_file_id: unreviewedFileId,
        content: newComment.trim(),
      };

      const addedComment = await addComment(commentData);
      if (addedComment) {
        setComments(prev => [...prev, addedComment]);
        setNewComment('');
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditComment = async (commentId: string) => {
    if (!editContent.trim()) return;

    setIsLoading(true);
    try {
      const updatedComment = await updateComment({
        id: commentId,
        content: editContent.trim(),
      });

      if (updatedComment) {
        setComments(prev =>
          prev.map(comment =>
            comment.id === commentId ? updatedComment : comment
          )
        );
        setEditingComment(null);
        setEditContent('');
      }
    } catch (error) {
      console.error('Error updating comment:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm('Are you sure you want to delete this comment?')) return;

    setIsLoading(true);
    try {
      const success = await deleteComment(commentId);
      if (success) {
        setComments(prev => prev.filter(comment => comment.id !== commentId));
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const startEditing = (comment: Comment) => {
    setEditingComment(comment.id);
    setEditContent(comment.content);
  };

  const cancelEditing = () => {
    setEditingComment(null);
    setEditContent('');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Comments ({comments.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add new comment */}
        <div className="space-y-2">
          <Textarea
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="min-h-[80px]"
            disabled={isLoading}
          />
          <div className="flex justify-end">
            <Button
              onClick={handleAddComment}
              disabled={!newComment.trim() || isLoading}
              size="sm"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Comment
            </Button>
          </div>
        </div>

        <Separator />

        {/* Comments list */}
        <div className="space-y-3">
          {isLoading && comments.length === 0 ? (
            <div className="text-center text-muted-foreground py-4">
              Loading comments...
            </div>
          ) : comments.length === 0 ? (
            <div className="text-center text-muted-foreground py-4">
              No comments yet. Be the first to add one!
            </div>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="border rounded-lg p-3">
                {editingComment === comment.id ? (
                  <div className="space-y-2">
                    <Textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="min-h-[80px]"
                    />
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleEditComment(comment.id)}
                        disabled={!editContent.trim() || isLoading}
                        size="sm"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Save
                      </Button>
                      <Button
                        onClick={cancelEditing}
                        variant="outline"
                        size="sm"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="secondary" className="text-xs">
                            {comment.user_email || 'User'}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {formatDate(comment.created_at)}
                          </span>
                        </div>
                        <p className="text-sm whitespace-pre-wrap">{comment.content}</p>
                      </div>
                      {user && comment.user_id === user.id && (
                        <div className="flex gap-1 ml-2">
                          <Button
                            onClick={() => startEditing(comment)}
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            onClick={() => handleDeleteComment(comment.id)}
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}; 