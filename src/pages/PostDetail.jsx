import { useEffect, useState, useMemo, useLayoutEffect } from "react";
import { useParams } from "react-router-dom";
import { marked } from "marked";
import DOMPurify from "dompurify";
import Prism from "prismjs";
import postApi from "../api/postApi.js";
import "@toast-ui/editor/dist/toastui-editor-viewer.css";
import "prismjs/themes/prism-okaidia.css";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-python";
import "prismjs/components/prism-java";
import "prismjs/components/prism-json";
import "prismjs/components/prism-sql";
import "../styles/editor.css";
import ConfirmModal from "../commons/modals/ConfirmModal.jsx";
import { toast } from "react-toastify";
import usePageService from "../commons/hooks/useNavigationService.js";
import baseURL from "../config/apiBaseUrl.js";
import CommentList from "../components/comment/CommentList.jsx";
import CommentInputBox from "../components/comment/CommentInputBox.jsx";

const renderer = new marked.Renderer();

renderer.code = function({ text, lang, escaped }) {
    console.log('Code block - lang:', lang, 'text length:', text?.length);
    
    const safeCode = text || '';
    
    const languageMap = {
        'js': 'javascript',
        'jsx': 'jsx',
        'ts': 'typescript',
        'tsx': 'tsx',
        'py': 'python',
        'sh': 'bash',
        'html': 'markup'
    };
    
    const normalizedLang = lang ? (languageMap[lang.toLowerCase()] || lang.toLowerCase()) : 'javascript';
    
    console.log('Using language:', normalizedLang);
    
    const grammar = Prism.languages[normalizedLang] || Prism.languages.java;
    
    try {
        const html = Prism.highlight(safeCode, grammar, normalizedLang);
        return `<pre class="language-${normalizedLang}"><code class="language-${normalizedLang}">${html}</code></pre>`;
    } catch (error) {
        console.error(`Error highlighting ${normalizedLang}:`, error);
        return `<pre class="language-${normalizedLang}"><code class="language-${normalizedLang}">${DOMPurify.sanitize(safeCode)}</code></pre>`;
    }
};

marked.setOptions({
    renderer,
    breaks: true,
});

export default function PostDetail() {
    const { id } = useParams();
    const [postInfo, setPostInfo] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const post = postApi();
    const pageService = usePageService();

    useEffect(() => {
        const getPostInfo = async () => {
            try {
                const response = await post.getPost(id);
                setPostInfo(response);
            } catch (error) {
                console.error("단일 게시글 조회 오류", error);
            }
        };
        getPostInfo();
    }, [id]);

    const htmlContent = useMemo(() => {
        if (!postInfo?.content) return "";

        let content = postInfo.content.replace(
            /!\[([^\]]*)\]\((\/uploadFiles\/[^\)]+)\)/g,
            (match, alt, path) => {
                const fullUrl = `${baseURL}${path}`;
                const encodedUrl = encodeURI(fullUrl);
                return `![${alt}](${encodedUrl})`;
            }
        );

        const rawHtml = marked.parse(content);
        return DOMPurify.sanitize(rawHtml);
    }, [postInfo]);

    useLayoutEffect(() => {
        if (htmlContent) {
            Prism.highlightAll();
        }
    }, [htmlContent]);

    const handleModalOpen = (id) => {
        setSelectedId(id);
        setIsModalOpen(true);
    };

    const handleDelete = async () => {
        try {
            await post.deletePost(selectedId);
            setIsModalOpen(false);
            toast.success("게시글이 성공적으로 삭제되었습니다.");
            pageService.goToPostList();
        } catch (err) {
            console.error("게시글 삭제 에러", err);
        }
    };

    if (!postInfo) {
        return (
            <div className="min-h-screen flex justify-center items-center text-slate-500 text-lg">
                게시글을 불러오는 중입니다...
            </div>
        );
    }

    return (
        <>
            <div className="min-h-screen to-slate-100 py-10 px-4">
                <div className="max-w-5xl mx-auto rounded-2xl p-3">
                    <h1 className="text-4xl font-bold mb-4">{postInfo.title}</h1>

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
                            <button className="mx-1 cursor-pointer hover:text-slate-800">
                                수정
                            </button>
                            <button
                                className="mx-1 cursor-pointer hover:text-slate-800"
                                onClick={() => handleModalOpen(postInfo.id)}
                            >
                                삭제
                            </button>
                        </div>
                    </div>

                    <div className="toast-viewer border-y border-gray-300 py-10">
                        <div
                            key={postInfo?.id}
                            className="toast-viewer-content"
                            dangerouslySetInnerHTML={{__html: htmlContent}}
                        />
                    </div>
                    <div>
                        <CommentList postId={postInfo.id} />
                        <CommentInputBox />
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
    );
}
