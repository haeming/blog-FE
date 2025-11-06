export default function CommentForm({ 
    newComment, 
    setNewComment, 
    onSubmit, 
    replyTo, 
    onCancelReply 
}) {
    return (
        <form onSubmit={onSubmit} className="bg-slate-50 rounded-lg">
            {replyTo && (
                <div className="mb-3 flex items-center text-sm text-slate-600">
                    <span>답글 작성 중</span>
                    <button
                        type="button"
                        onClick={onCancelReply}
                        className="ml-2 text-red-500 hover:text-red-700"
                    >
                        취소
                    </button>
                </div>
            )}
            
            <div className="flex gap-3 mb-3">
                <input
                    type="text"
                    placeholder="닉네임"
                    value={newComment.nickname}
                    onChange={(e) => setNewComment({ ...newComment, nickname: e.target.value })}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400"
                />
                <input
                    type="password"
                    placeholder="비밀번호"
                    value={newComment.password}
                    onChange={(e) => setNewComment({ ...newComment, password: e.target.value })}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400"
                />
            </div>
            
            <textarea
                placeholder="댓글을 입력하세요"
                value={newComment.content}
                onChange={(e) => setNewComment({ ...newComment, content: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400 resize-none"
                rows="4"
            />
            
            <div className="flex justify-end mt-3">
                <button
                    type="submit"
                    className="px-6 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-800 transition-colors"
                >
                    {replyTo ? '답글 등록' : '댓글 등록'}
                </button>
            </div>
        </form>
    );
}