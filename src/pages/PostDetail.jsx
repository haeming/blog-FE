import {useEffect, useRef, useState} from "react";
import { useParams } from "react-router-dom";
import Prism from "prismjs";
import postApi from "../api/postApi.js";
import {Viewer} from "@toast-ui/react-editor";
import codeSyntaxHighlight from "@toast-ui/editor-plugin-code-syntax-highlight";
import "@toast-ui/editor/dist/toastui-editor-viewer.css";
import "prismjs/themes/prism-okaidia.css"; // 💜 같은 테마 유지
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-python";
import "prismjs/components/prism-java";
import "prismjs/components/prism-json";
import "../styles/editor.css";

export default function PostDetail (){

    const { id } = useParams();
    const viewerRef = useRef();
    const [post, setPost] = useState(null);
    const { getPost } = postApi();

    useEffect(() => {
        const getPostInfo = async () => {
            try {
                const response = await getPost(id);
                console.log(response)
                const postData = response.result;
                setPost(postData);
            } catch (error){
                console.error("단일 게시글 조회 오류", error);
            }
        }

        getPostInfo();
    }, [id]);

    if (!post) {
        return (
            <div className="min-h-screen flex justify-center items-center text-slate-500 text-lg">
                게시글을 불러오는 중입니다...
            </div>
        );
    }

    return(
        <>
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-10 px-4">
                <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-md p-10 border border-slate-200">
                    <h1 className="text-3xl font-bold text-slate-800 mb-4">
                        {post.title}
                    </h1>

                    {post.createdAt && (
                        <p className="text-slate-500 text-sm mb-6">
                            {new Date(post.createdAt).toLocaleString()}
                        </p>
                    )}

                    <div className="toast-viewer">
                        <Viewer
                            ref={viewerRef}
                            initialValue={post.content}
                            plugins={[[codeSyntaxHighlight, {highlighter: Prism}]]}
                        />
                    </div>
                </div>
            </div>
        </>
    )
}