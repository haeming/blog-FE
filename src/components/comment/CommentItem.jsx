export default function CommentItem({ comment, onReply }) {
    return (
        <div className="border-b border-gray-200 pb-4">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold text-slate-800">{comment.nickname}</span>
                        <span className="text-xs text-slate-400">
                            {new Date(comment.created_at).toLocaleString("ko-KR", {
                                year: "numeric",
                                month: "2-digit",
                                day: "2-digit",
                                hour: "2-digit",
                                minute: "2-digit",
                            })}
                        </span>
                        {comment.is_pinned && (
                            <span className="text-xs bg-slate-700 text-white px-2 py-0.5 rounded">
                                고정
                            </span>
                        )}
                    </div>
                    <p className="text-slate-700 whitespace-pre-wrap">{comment.content}</p>
                </div>
                
                <button
                    onClick={() => onReply(comment.id)}
                    className="text-sm text-slate-500 hover:text-slate-700 ml-4"
                >
                    답글
                </button>
            </div>

            {/* 대댓글 */}
            {comment.replies && comment.replies.length > 0 && (
                <div className="ml-8 mt-4 space-y-3">
                    {comment.replies.map((reply) => (
                        <div key={reply.id} className="border-l-2 border-slate-300 pl-4">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="font-semibold text-slate-700 text-sm">{reply.nickname}</span>
                                <span className="text-xs text-slate-400">
                                    {new Date(reply.created_at).toLocaleString("ko-KR", {
                                        year: "numeric",
                                        month: "2-digit",
                                        day: "2-digit",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </span>
                            </div>
                            <p className="text-slate-600 text-sm whitespace-pre-wrap">{reply.content}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}