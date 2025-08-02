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
  fileId: string;
  fileName: string;
  conversionId?: string;
  className?: string;
}

export const CommentSection: React.FC<CommentSectionProps> = ({
  fileId,
  fileName,
  conversionId,
  className = ''
}) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchComments();
  }, [fileId]);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const fetchedComments = await getComments(fileId);
      setComments(fetchedComments);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !user) return;

    const commentData: CommentInsert = {
      file_id: fileId,
      file_name: fileName,
      comment: newComment.trim(),
      conversion_id: conversionId
    };

    const addedComment = await addComment(commentData);
    if (addedComment) {
      setComments(prev => [...prev, { ...addedComment, user_email: user.user_metadata?.full_name || user.email || 'You' }]);
      setNewComment('');
    }
  };

  const handleUpdateComment = async (commentId: string) => {
    if (!editText.trim()) return;

    const updatedComment = await updateComment({
      id: commentId,
      comment: editText.trim()
    });

    if (updatedComment) {
      setComments(prev => prev.map(c => 
        c.id === commentId ? { ...updatedComment, user_email: c.user_email } : c
      ));
      setEditingComment(null);
      setEditText('');
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    const success = await deleteComment(commentId);
    if (success) {
      setComments(prev => prev.filter(c => c.id !== commentId));
    }
  };

  const startEditing = (comment: Comment) => {
    setEditingComment(comment.id);
    setEditText(comment.comment);
  };

  const cancelEditing = () => {
    setEditingComment(null);
    setEditText('');
  };

  const canEditComment = (comment: Comment) => {
    return user && comment.user_id === user.id;
  };

  const canDeleteComment = (comment: Comment) => {
    return user && comment.user_id === user.id;
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center gap-2">
        <MessageSquare className="h-5 w-5" />
        <h3 className="text-lg font-semibold">Comments</h3>
        <Badge variant="secondary">{comments.length}</Badge>
      </div>

      {/* Add new comment */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Add Comment</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Textarea
            placeholder="Write your comment here..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="min-h-[100px]"
          />
          <div className="flex justify-end">
            <Button 
              onClick={handleAddComment}
              disabled={!newComment.trim() || !user}
              size="sm"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Comment
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Comments list */}
      <div className="space-y-3">
        {loading ? (
          <div className="text-center py-4">
            <p className="text-gray-500">Loading comments...</p>
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-8">
            <MessageSquare className="h-8 w-8 mx-auto text-gray-400 mb-2" />
            <p className="text-gray-500">No comments yet. Be the first to comment!</p>
          </div>
        ) : (
          comments.map((comment) => (
            <Card key={comment.id} className="relative">
              <CardContent className="pt-4">
                {editingComment === comment.id ? (
                  <div className="space-y-3">
                    <Textarea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="min-h-[80px]"
                    />
                    <div className="flex gap-2 justify-end">
                      <Button 
                        onClick={() => handleUpdateComment(comment.id)}
                        size="sm"
                        variant="outline"
                      >
                        Save
                      </Button>
                      <Button 
                        onClick={cancelEditing}
                        size="sm"
                        variant="ghost"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{comment.user_email}</span>
                        <span className="text-xs text-gray-500">
                          {new Date(comment.created_at).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex gap-1">
                        {canEditComment(comment) && (
                          <Button
                            onClick={() => startEditing(comment)}
                            size="sm"
                            variant="ghost"
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                        )}
                        {canDeleteComment(comment) && (
                          <Button
                            onClick={() => handleDeleteComment(comment.id)}
                            size="sm"
                            variant="ghost"
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                    <p className="text-sm whitespace-pre-wrap">{comment.comment}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}; 