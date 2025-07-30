import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { MessageSquare, Eye } from 'lucide-react';
import { commentUtils } from '@/utils/commentUtils';
import { ConversionComment } from '@/types/conversionComments';
import { formatDistanceToNow } from 'date-fns';

interface CommentIndicatorProps {
  fileId: string;
  fileName: string;
}

const CommentIndicator: React.FC<CommentIndicatorProps> = ({ fileId, fileName }) => {
  const [comments, setComments] = useState<ConversionComment[]>([]);
  const [showComments, setShowComments] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadComments();
  }, [fileId]);

  const loadComments = async () => {
    try {
      setIsLoading(true);
      const fileComments = await commentUtils.getCommentsForFile(fileId);
      setComments(fileComments);
    } catch (error) {
      console.error('Error loading comments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (comments.length === 0) {
    return null;
  }

  return (
    <>
      <Button
        size="sm"
        variant="outline"
        onClick={() => setShowComments(true)}
        className="flex items-center gap-1 h-6 px-2"
      >
        <MessageSquare className="h-3 w-3" />
        <Badge variant="secondary" className="text-xs">
          {comments.length}
        </Badge>
      </Button>

      <Dialog open={showComments} onOpenChange={setShowComments}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>Comments for {fileName}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 overflow-y-auto max-h-[60vh]">
            {comments.map((comment) => (
              <div key={comment.id} className="border-l-4 border-l-blue-500 bg-gray-50 p-4 rounded">
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="secondary" className="text-xs">
                    {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                  </Badge>
                  {comment.updated_at !== comment.created_at && (
                    <Badge variant="outline" className="text-xs">
                      Edited
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">
                  {comment.comment}
                </p>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CommentIndicator; 