import {useEffect, useRef, useState} from "react";
import { useParams } from "react-router-dom";
import Prism from "prismjs";
import postApi from "../api/postApi.js";
import {Viewer} from "@toast-ui/react-editor";
import codeSyntaxHighlight from "@toast-ui/editor-plugin-code-syntax-highlight";
import "@toast-ui/editor/dist/toastui-editor-viewer.css";
import "prismjs/themes/prism-okaidia.css";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-python";
import "prismjs/components/prism-java";
import "prismjs/components/prism-json";
import "../styles/editor.css";
import ConfirmModal from "../commons/modals/ConfirmModal.jsx";
import {toast} from "react-toastify";
import usePageService from "../commons/hooks/useNavigationService.js";

export default function PostDetail (){

    const { id } = useParams();
    const viewerRef = useRef();
    const [postInfo, setPostInfo] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const post = postApi();

    const pageService = usePageService();

    const handleModalOpen = (id) => {
        setSelectedId(id);
        setIsModalOpen(true);
    }

    const handleDelete = async () => {
        try {
            await post.deletePost(selectedId);
            setIsModalOpen(false);
            toast.success("게시글이 성공적으로 삭제되었습니다.");
            pageService.goToHome();
        } catch (err){
            console.error("게시글 삭제 에러", err);
        }

    }

    useEffect(() => {
        const getPostInfo = async () => {
            try {
                const response = await post.getPost(id);
                console.log(response)
                const postData = response.result;
                setPostInfo(postData);
            } catch (error){
                console.error("단일 게시글 조회 오류", error);
            }
        }

        getPostInfo();
    }, [id]);

    if (!postInfo) {
        return (
            <div className="min-h-screen flex justify-center items-center text-slate-500 text-lg">
                게시글을 불러오는 중입니다...
            </div>
        );
    }

    return(
        <>
            <div className="min-h-screen to-slate-100 py-10 px-4">
                <div className="max-w-5xl mx-auto rounded-2xl p-3">
                    <h1 className="text-4xl font-bold mb-4">
                        {postInfo.title}
                    </h1>

                    <div className="flex text-slate-500 text-sm justify-between items-center mb-6">
                        <div>
                            {postInfo.createdAt && (
                                <p>
                                    {new Date(postInfo.createdAt).toLocaleString("ko-KR", {
                                        year: "numeric",
                                        month: "2-digit",
                                        day: "2-digit",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </p>
                            )}
                        </div>
                        <div>
                            <button className="mx-1 cursor-pointer hover:text-slate-800">수정</button>
                            <button className="mx-1 cursor-pointer hover:text-slate-800"
                            onClick={() => handleModalOpen(postInfo.id)}>삭제</button>
                        </div>

                    </div>


                    <div className="toast-viewer border-y border-gray-300 py-10">
                        <Viewer
                            ref={viewerRef}
                            initialValue={postInfo.content}
                            plugins={[[codeSyntaxHighlight, {highlighter: Prism}]]}
                        />
                    </div>
                </div>
            </div>

            <ConfirmModal
                isOpen={isModalOpen}
                title="게시글 삭제"
                message="정말 이 게시글을 삭제하시겠습니까?"
                onConfirm={handleDelete}
                onCancel={() => setIsModalOpen(false)}
            />

        </>
    )
}