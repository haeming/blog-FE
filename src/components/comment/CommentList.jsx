import useComment from "../../api/commentApi.js";
import {useEffect, useState} from "react";

export default function CommentList({postId}){
    const [comments, setComments] = useState([]);
    const commentApi = useComment();

    const getCommentList = async (postId) => {
        try {
            const res = await commentApi.commentList(postId);
            setComments(res);
        } catch (error){
            console.error("댓글 목록 불러오기 에러", error);
        }
    }
    useEffect(() => {
        if (!postId) return;
        getCommentList(postId);
    }, [postId]);

    return(
        <>
            {comments.length == 0 ? (
                <p className="text-center text-gray-400 py-10">등록된 댓글이 없습니다.</p>
            ) : (
                comments.map((c) => (
                    <div key={c.id} className="border-b py-2">
                        <p className="font-semibold">{c.nickname ? c.nickname : "작성자"}</p>
                        <p>{c.content}</p>
                    </div>
                ))
            )}
        </>
    )
}