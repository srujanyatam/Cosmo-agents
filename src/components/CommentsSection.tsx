import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { 
  MessageSquare, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  Eye,
  Plus,
  Clock
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { commentUtils } from '@/utils/commentUtils';
import { ConversionComment, CreateCommentData } from '@/types/conversionComments';
import { formatDistanceToNow } from 'date-fns';

interface CommentsSectionProps {
  fileId: string;
  fileName: string;
  conversionId?: string;
  isDevReview?: boolean;
}

const CommentsSection: React.FC<CommentsSectionProps> = ({
  fileId,
  fileName,
  conversionId,
  isDevReview = false
}) => {
  const [comments, setComments] = useState<ConversionComment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [editingComment, setEditingComment] = useState<ConversionComment | null>(null);
  const [editText, setEditText] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Load comments on component mount
  useEffect(() => {
    loadComments();
  }, [fileId]);

  const loadComments = async () => {
    try {
      const fileComments = await commentUtils.getCommentsForFile(fileId);
      setComments(fileComments);
    } catch (error) {
      console.error('Error loading comments:', error);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) {
      toast({
        title: "Comment Required",
        description: "Please enter a comment before saving.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const commentData: CreateCommentData = {
        file_id: fileId,
        file_name: fileName,
        comment: newComment.trim(),
        conversion_id: conversionId,
        is_public: false
      };

      const result = await commentUtils.createComment(commentData);
      if (result) {
        setComments(prev => [result, ...prev]);
        setNewComment('');
        setShowAddDialog(false);
        toast({
          title: "Comment Added",
          description: "Your comment has been saved successfully.",
        });
      } else {
        throw new Error('Failed to create comment');
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      toast({
        title: "Error",
        description: "Failed to save comment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditComment = async () => {
    if (!editingComment || !editText.trim()) {
      toast({
        title: "Comment Required",
        description: "Please enter a comment before saving.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await commentUtils.updateComment(editingComment.id, {
        comment: editText.trim()
      });
      
      if (result) {
        setComments(prev => 
          prev.map(comment => 
            comment.id === editingComment.id ? result : comment
          )
        );
        setEditingComment(null);
        setEditText('');
        toast({
          title: "Comment Updated",
          description: "Your comment has been updated successfully.",
        });
      } else {
        throw new Error('Failed to update comment');
      }
    } catch (error) {
      console.error('Error updating comment:', error);
      toast({
        title: "Error",
        description: "Failed to update comment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm('Are you sure you want to delete this comment?')) {
      return;
    }

    setIsLoading(true);
    try {
      const success = await commentUtils.deleteComment(commentId);
      if (success) {
        setComments(prev => prev.filter(comment => comment.id !== commentId));
        toast({
          title: "Comment Deleted",
          description: "Your comment has been deleted successfully.",
        });
      } else {
        throw new Error('Failed to delete comment');
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast({
        title: "Error",
        description: "Failed to delete comment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const startEditing = (comment: ConversionComment) => {
    setEditingComment(comment);
    setEditText(comment.comment);
  };

  const cancelEditing = () => {
    setEditingComment(null);
    setEditText('');
  };

  return (
    <div className="space-y-4">
      {/* Add Comment Button (only in dev review) */}
      {isDevReview && (
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Code Comments
          </h3>
          <Button
            onClick={() => setShowAddDialog(true)}
            size="sm"
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Comment
          </Button>
        </div>
      )}

      {/* View Comments Button (when not in dev review) */}
      {!isDevReview && comments.length > 0 && (
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Comments ({comments.length})
          </h3>
          <Button
            onClick={() => setShowViewDialog(true)}
            size="sm"
            variant="outline"
            className="flex items-center gap-2"
          >
            <Eye className="h-4 w-4" />
            View Comments
          </Button>
        </div>
      )}

      {/* Comments List (in dev review) */}
      {isDevReview && comments.length > 0 && (
        <div className="space-y-3">
          {comments.map((comment) => (
            <Card key={comment.id} className="border-l-4 border-l-blue-500">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                    </Badge>
                    {comment.updated_at !== comment.created_at && (
                      <Badge variant="outline" className="text-xs">
                        Edited
                      </Badge>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => startEditing(comment)}
                      className="h-6 w-6 p-0"
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteComment(comment.id)}
                      className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">
                  {comment.comment}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add Comment Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Comment</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              placeholder="Add your comment about this code conversion..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddComment} disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Comment'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Comment Dialog */}
      <Dialog open={!!editingComment} onOpenChange={() => setEditingComment(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Comment</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              placeholder="Edit your comment..."
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={cancelEditing}>
              Cancel
            </Button>
            <Button onClick={handleEditComment} disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Comments Dialog */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>Comments for {fileName}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 overflow-y-auto max-h-[60vh]">
            {comments.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No comments yet.</p>
            ) : (
              comments.map((comment) => (
                <Card key={comment.id} className="border-l-4 border-l-blue-500">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                        </Badge>
                        {comment.updated_at !== comment.created_at && (
                          <Badge variant="outline" className="text-xs">
                            Edited
                          </Badge>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">
                      {comment.comment}
                    </p>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
          <DialogFooter>
            <Button onClick={() => setShowViewDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CommentsSection; 