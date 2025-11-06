import CommentList from "./CommentList";
import CommentForm from "./CommentForm";

export default function CommentSection({
    comments,
    newComment,
    setNewComment,
    onSubmit,
    onReply,
    replyTo,
    onCancelReply
}) {
    return (
        <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">
                댓글 <span className="text-slate-500">({comments.length})</span>
            </h2>

            <CommentList 
                comments={comments} 
                onReply={onReply} 
            />

            <CommentForm
                newComment={newComment}
                setNewComment={setNewComment}
                onSubmit={onSubmit}
                replyTo={replyTo}
                onCancelReply={onCancelReply}
            />
        </div>
    );
}