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

// breaks를 끕니다(중복 줄바꿈 방지)
marked.setOptions({
    renderer,
    breaks: false,
});

const normalizeLineBreaksExactly = (md) => {
    // 1. 코드 블록을 임시로 추출
    const codeBlocks = [];
    let content = md.replace(/(```[\s\S]*?```)/g, (match) => {
        codeBlocks.push(match);
        return `___CODE_BLOCK_${codeBlocks.length - 1}___`;
    });

    // 2. 일반 텍스트만 처리
    const lines = content.split("\n");
    const out = [];

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const trimmed = line.trim();

        // 플레이스홀더는 그대로 유지
        if (trimmed.startsWith("___CODE_BLOCK_")) {
            out.push(line);
            continue;
        }

        // 마크다운 구문은 절대 건드리지 않음
        // 인용구 (>), 리스트 (*, -, +, 1.), 제목 (#), 수평선 (---)
        if (
            trimmed.startsWith(">") ||
            trimmed.startsWith("*") ||
            trimmed.startsWith("-") ||
            trimmed.startsWith("+") ||
            /^\d+\./.test(trimmed) || // 1. 2. 3. 등
            trimmed.startsWith("#") ||
            trimmed === "---" ||
            trimmed === "***" ||
            trimmed === "___"
        ) {
            out.push(line);
            continue;
        }

        // 빈 줄 처리
        if (trimmed === "") {
            const nextLine = i < lines.length - 1 ? lines[i + 1].trim() : "";
            const prevLine = i > 0 ? lines[i - 1].trim() : "";

            // 마크다운 구조 주변의 빈 줄은 유지
            if (
                nextLine.startsWith("___CODE_BLOCK_") ||
                nextLine.startsWith(">") ||
                nextLine.startsWith("*") ||
                nextLine.startsWith("-") ||
                nextLine.startsWith("+") ||
                /^\d+\./.test(nextLine) ||
                nextLine.startsWith("#") ||
                nextLine === "---" ||
                prevLine.startsWith("___CODE_BLOCK_") ||
                prevLine.startsWith(">") ||
                prevLine.startsWith("#") ||
                prevLine === "---"
            ) {
                out.push("");
            } else {
                // 일반 텍스트 사이의 빈 줄만 <br>로 변환
                out.push("<br>");
            }
            continue;
        }

        // 일반 줄
        if (i < lines.length - 1) {
            const nextLine = lines[i + 1].trim();
            // 다음 줄이 빈 줄이거나 마크다운 구문이면 hard break 추가 안 함
            if (
                nextLine === "" ||
                nextLine.startsWith(">") ||
                nextLine.startsWith("*") ||
                nextLine.startsWith("-") ||
                nextLine.startsWith("+") ||
                /^\d+\./.test(nextLine) ||
                nextLine.startsWith("#") ||
                nextLine.startsWith("___CODE_BLOCK_")
            ) {
                out.push(line);
            } else {
                out.push(line + "  ");
            }
        } else {
            out.push(line);
        }
    }

    let result = out.join("\n");

    // 3. 코드 블록 복원
    codeBlocks.forEach((block, index) => {
        result = result.replace(`___CODE_BLOCK_${index}___`, block);
    });

    return result;
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
                            className="toast-viewer-content post-detail-viewer-content"
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
