import CommentItem from "./CommentItem";

export default function CommentList({ comments, onReply }) {
    if (comments.length === 0) {
        return (
            <div className="text-center py-12 text-slate-400">
                첫 댓글을 작성해보세요!
            </div>
        );
    }

    return (
        <div className="space-y-4 mb-8">
            {comments.map((comment) => (
                <CommentItem
                    key={comment.id}
                    comment={comment}
                    onReply={onReply}
                />
            ))}
        </div>
    );
}