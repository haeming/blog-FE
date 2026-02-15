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

renderer.code = function ({ text, lang }) {
    const safeCode = text || "";

    const languageMap = {
        js: "javascript",
        jsx: "jsx",
        ts: "typescript",
        tsx: "tsx",
        py: "python",
        sh: "bash",
        html: "markup",
    };

    const normalizedLang = lang
        ? languageMap[lang.toLowerCase()] || lang.toLowerCase()
        : "javascript";

    const grammar = Prism.languages[normalizedLang] || Prism.languages.java;

    try {
        const html = Prism.highlight(safeCode, grammar, normalizedLang);
        return `<pre class="language-${normalizedLang}"><code class="language-${normalizedLang}">${html}</code></pre>`;
    } catch (error) {
        console.error(`Error highlighting ${normalizedLang}:`, error);
        return `<pre class="language-${normalizedLang}"><code class="language-${normalizedLang}">${DOMPurify.sanitize(
            safeCode
        )}</code></pre>`;
    }
};

// ✅ breaks를 끕니다(중복 줄바꿈 방지)
marked.setOptions({
    renderer,
    breaks: false,
});

/**
 * ✅ 목표: 사용자가 입력한 엔터 횟수를 그대로 화면에 반영
 * - fenced code block(```) 내부는 건드리지 않습니다.
 * - 일반 텍스트 영역:
 *   - "한 줄 줄바꿈"은 Markdown hard break(라인 끝 공백 2칸)로 강제
 *   - "빈 줄"은 <br /> 라인을 삽입하여 정확히 빈 줄 개수 유지
 */
const normalizeLineBreaksExactly = (md) => {
    const lines = md.split("\n");
    let inFence = false;
    const out = [];

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const trimmed = line.trim();

        // code fence 토글
        if (trimmed.startsWith("```")) {
            inFence = !inFence;
            out.push(line);
            continue;
        }

        if (inFence) {
            // 코드블록 내부는 원문 유지
            out.push(line);
            continue;
        }

        if (trimmed === "") {
            // 빈 줄은 <br />로 치환 (빈 줄 개수만큼 유지)
            out.push("<br />");
            continue;
        }

        // 일반 줄: 다음 라인이 존재하면 hard break를 유도하기 위해 끝에 공백 2칸 추가
        // (마지막 줄은 불필요한 break를 피하려고 그대로 둡니다)
        if (i < lines.length - 1) {
            out.push(line + "  ");
        } else {
            out.push(line);
        }
    }

    return out.join("\n");
};

export default function PostDetail() {
    const { id } = useParams();
    const [postInfo, setPostInfo] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [refreshComments, setRefreshComments] = useState(0);
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

        // 이미지 상대경로 → 절대경로 변환
        let content = postInfo.content.replace(
            /!\[([^\]]*)\]\((\/uploadFiles\/[^\)]+)\)/g,
            (match, alt, path) => {
                const fullUrl = `${baseURL}${path}`;
                const encodedUrl = encodeURI(fullUrl);
                return `![${alt}](${encodedUrl})`;
            }
        );

        // ✅ 엔터/빈줄을 정확히 반영하도록 정규화
        content = normalizeLineBreaksExactly(content);

        const rawHtml = marked.parse(content);

        // ✅ br 허용을 명시(환경에 따라 제거 방지)
        return DOMPurify.sanitize(rawHtml, { ADD_TAGS: ["br"] });
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

    const handleCommentAdded = () => {
        setRefreshComments((prev) => prev + 1);
    };

    const handleEdit = () => {
        pageService.goToPostEdit(id);
    };

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
                            <button className="mx-1 cursor-pointer hover:text-slate-800" onClick={handleEdit}>
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
                            dangerouslySetInnerHTML={{ __html: htmlContent }}
                        />
                    </div>

                    <div>
                        <CommentList postId={postInfo.id} refreshTrigger={refreshComments} />
                        <CommentInputBox postId={postInfo.id} onCommentAdded={handleCommentAdded} />
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
