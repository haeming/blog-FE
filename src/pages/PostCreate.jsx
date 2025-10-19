import { useRef, useState } from "react";
import { Editor } from "@toast-ui/react-editor";
import Prism from "prismjs";
import codeSyntaxHighlight from "@toast-ui/editor-plugin-code-syntax-highlight";
import 'codemirror/lib/codemirror.css';
import "@toast-ui/editor/dist/toastui-editor.css";
import '@toast-ui/editor/dist/i18n/ko-KR';
import "prismjs/themes/prism.css";
import colorSyntax from '@toast-ui/editor-plugin-color-syntax';
import '@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css';
import 'tui-color-picker/dist/tui-color-picker.css';
import DOMPurify from "dompurify";
import postApi from "../api/postApi.js";

export default function PostCreate() {
    const editorRef = useRef();
    const [title, setTitle] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [tags, setTags] = useState([]);
    const [tagInput, setTagInput] = useState("");
    const [files, setFiles] = useState([]);

    const { createPost } = postApi();

    const handleImageInsert = (blob, callback) => {
        const localUrl = URL.createObjectURL(blob);
        callback(localUrl, 'image'); // 에디터 안에 즉시 이미지 미리보기 표시
        setFiles((prev) => [...prev, blob]); // 실제 업로드는 createPost 단계에서 처리
    };

    const handleSave = async () => {
        if(!title.trim()){
            alert("제목을 입력해 주세요.");
            return;
        }

        const markdown = editorRef.current.getInstance().getMarkdown();
        const html = editorRef.current.getInstance().getHTML();

        // 보안 필터
        const cleanHTML = DOMPurify.sanitize(html, {
            ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3',
                'ul', 'ol', 'li', 'code', 'pre', 'blockquote',
                'a', 'img', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'span'],
            ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class', 'style']
        });

        try {
            const postData = {
                title: title,
                content: markdown,
                categoryId: parseInt(categoryId),
            }

            const response = await createPost(postData, files);
            console.log("게시글 등록 완료", response);
            alert("게시글 등록이 완료되었습니다!");
        } catch (error){
            console.error("게시글 등록 에러: ", error);
            alert("게시글 등록 중 에러가 발생했습니다.");
        }
    };

    const addTag = (e) => {
        if (e.key === "Enter" && tagInput.trim()) {
            e.preventDefault();
            if (!tags.includes(tagInput.trim())) {
                setTags([...tags, tagInput.trim()]);
            }
            setTagInput("");
        }
    };

    const removeTag = (tagToRemove) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
                {/* 헤더 */}
                <div className="mb-8">
                    <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-2">
                        ✍️ 새 글 작성
                    </h1>
                    <p className="text-slate-500 text-sm sm:text-base">
                        마크다운으로 아름다운 글을 작성해보세요
                    </p>
                </div>

                {/* 제목 입력 */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6 transition-shadow hover:shadow-md">
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="제목을 입력하세요"
                        className="w-full text-2xl sm:text-3xl font-bold outline-none placeholder-slate-300 text-slate-800"
                    />
                </div>

                {/* 태그 입력 */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6 transition-shadow hover:shadow-md">
                    <div className="flex flex-wrap gap-2 mb-3">
                        {tags.map((tag, idx) => (
                            <span
                                key={idx}
                                className="inline-flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full text-sm font-medium shadow-sm"
                            >
                                #{tag}
                                <button
                                    onClick={() => removeTag(tag)}
                                    className="ml-1 hover:bg-white/20 rounded-full w-4 h-4 flex items-center justify-center transition-colors"
                                >
                                    ×
                                </button>
                            </span>
                        ))}
                    </div>
                    <input
                        type="text"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={addTag}
                        placeholder="태그를 입력하고 Enter (예: React, JavaScript)"
                        className="w-full outline-none text-slate-600 placeholder-slate-400"
                    />
                </div>

                {/* 에디터 */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden transition-shadow hover:shadow-md">
                    <style jsx global>{`
                        /* 툴바 스타일 */
                        .toastui-editor-toolbar {
                            background: linear-gradient(to bottom, #ffffff, #f8fafc) !important;
                            border-bottom: 1px solid #e2e8f0 !important;
                            padding: 12px 16px !important;
                        }
                        
                        .toastui-editor-toolbar button {
                            border-radius: 6px !important;
                            transition: all 0.2s !important;
                            color: #475569 !important;
                        }
                        
                        .toastui-editor-toolbar button:hover {
                            background-color: #f1f5f9 !important;
                            color: #0f172a !important;
                        }
                        
                        .toastui-editor-toolbar button.active {
                            background-color: #3b82f6 !important;
                            color: white !important;
                        }
                        
                        /* 에디터 본문 */
                        .toastui-editor-defaultUI {
                            border: none !important;
                        }
                        
                        .toastui-editor .ProseMirror {
                            font-size: 16px !important;
                            line-height: 1.7 !important;
                            color: #1e293b !important;
                            padding: 24px !important;
                        }
                        
                        /* 프리뷰 영역 */
                        .toastui-editor-md-preview {
                            background: #f8fafc !important;
                            padding: 24px !important;
                        }
                        
                        .toastui-editor-contents {
                            font-size: 16px !important;
                            line-height: 1.7 !important;
                            color: #1e293b !important;
                        }
                        
                        /* 헤딩 스타일 */
                        .toastui-editor-contents h1 {
                            font-size: 2em !important;
                            font-weight: 700 !important;
                            margin-top: 1.5em !important;
                            margin-bottom: 0.5em !important;
                            color: #0f172a !important;
                            border-bottom: 2px solid #e2e8f0 !important;
                            padding-bottom: 0.3em !important;
                        }
                        
                        .toastui-editor-contents h2 {
                            font-size: 1.5em !important;
                            font-weight: 700 !important;
                            margin-top: 1.3em !important;
                            margin-bottom: 0.5em !important;
                            color: #0f172a !important;
                        }
                        
                        .toastui-editor-contents h3 {
                            font-size: 1.25em !important;
                            font-weight: 600 !important;
                            margin-top: 1em !important;
                            margin-bottom: 0.5em !important;
                            color: #334155 !important;
                        }
                        
                        /* 코드 블록 */
                        .toastui-editor-contents pre {
                            background: #1e293b !important;
                            border-radius: 8px !important;
                            padding: 16px !important;
                            margin: 1em 0 !important;
                            overflow-x: auto !important;
                        }
                        
                        .toastui-editor-contents pre code {
                            background: transparent !important;
                            color: #f8fafc !important;
                            padding: 0 !important;
                        }
                        
                        /* 인라인 코드 */
                        .toastui-editor-contents :not(pre) > code {
                            background: #fef2f2 !important;
                            color: #dc2626 !important;
                            padding: 2px 6px !important;
                            border-radius: 4px !important;
                            font-family: 'Courier New', monospace !important;
                        }
                        
                        /* 블록쿼트 */
                        .toastui-editor-contents blockquote {
                            border-left: 4px solid #3b82f6 !important;
                            padding-left: 1em !important;
                            color: #64748b !important;
                            font-style: italic !important;
                            margin: 1em 0 !important;
                        }
                        
                        /* 링크 */
                        .toastui-editor-contents a {
                            color: #3b82f6 !important;
                            text-decoration: none !important;
                            transition: color 0.2s !important;
                        }
                        
                        .toastui-editor-contents a:hover {
                            color: #2563eb !important;
                            text-decoration: underline !important;
                        }
                        
                        /* 테이블 */
                        .toastui-editor-contents table {
                            border-collapse: collapse !important;
                            width: 100% !important;
                            margin: 1em 0 !important;
                        }
                        
                        .toastui-editor-contents th {
                            background: #f1f5f9 !important;
                            padding: 12px !important;
                            text-align: left !important;
                            font-weight: 600 !important;
                            border: 1px solid #e2e8f0 !important;
                        }
                        
                        .toastui-editor-contents td {
                            padding: 12px !important;
                            border: 1px solid #e2e8f0 !important;
                        }
                        
                        /* 이미지 */
                        .toastui-editor-contents img {
                            max-width: 100% !important;
                            height: auto !important;
                            border-radius: 8px !important;
                            margin: 1em 0 !important;
                        }
                        
                        /* HR */
                        .toastui-editor-contents hr {
                            border: none !important;
                            border-top: 2px solid #e2e8f0 !important;
                            margin: 2em 0 !important;
                        }
                        
                        /* 리스트 */
                        .toastui-editor-contents ul,
                        .toastui-editor-contents ol {
                            padding-left: 1.5em !important;
                            margin: 1em 0 !important;
                        }
                        
                        .toastui-editor-contents li {
                            margin: 0.3em 0 !important;
                            line-height: 1.7 !important;
                        }
                        
                    `}</style>

                    <Editor
                        ref={editorRef}
                        language="ko-KR"
                        height="600px"
                        initialEditType="markdown"
                            previewStyle="vertical"
                        useCommandShortcut={true}
                        plugins={[[codeSyntaxHighlight, { highlighter: Prism }],
                            colorSyntax,
                        ]}
                        toolbarItems={[
                            ["heading", "bold", "italic", "strike"],
                            ["hr", "quote"],
                            ["ul", "ol", "task"],
                            ["table", "link", "image"],
                            ["code", "codeblock"],
                        ]}
                        hooks={{
                            addImageBlobHook: handleImageInsert,
                        }}
                        customHTMLSanitizer={(html) => html}
                        initialValue=" "
                        placeholder="내용을 입력하세요..."
                        hideModeSwitch={false}
                    />
                </div>

                {/* 하단 버튼 */}
                <div className="mt-6 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
                    <button className="px-6 py-3 text-slate-600 bg-white hover:bg-slate-50 rounded-xl transition-all border border-slate-200 font-medium shadow-sm">
                        임시저장
                    </button>
                    <div className="flex gap-3">
                        <button className="flex-1 sm:flex-none px-6 py-3 text-slate-600 bg-white hover:bg-slate-50 rounded-xl transition-all border border-slate-200 font-medium shadow-sm">
                            취소
                        </button>
                        <button
                            onClick={handleSave}
                            className="flex-1 sm:flex-none px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg shadow-blue-500/30 font-medium"
                        >
                            발행하기
                        </button>
                    </div>
                </div>

                {/* 팁 카드 */}
                <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6 shadow-sm">
                    <h3 className="font-semibold text-blue-900 mb-4 flex items-center gap-2 text-lg">
                        💡 마크다운 팁
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-blue-700">
                        <div className="flex items-center gap-2">
                            <code className="bg-white px-2 py-1 rounded text-blue-800 font-mono border border-blue-200">
                                # 제목
                            </code>
                            <span>헤딩</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <code className="bg-white px-2 py-1 rounded text-blue-800 font-mono border border-blue-200">
                                **굵게**
                            </code>
                            <span>볼드체</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <code className="bg-white px-2 py-1 rounded text-blue-800 font-mono border border-blue-200">
                                *기울임*
                            </code>
                            <span>이탤릭</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <code className="bg-white px-2 py-1 rounded text-blue-800 font-mono border border-blue-200">
                                `코드`
                            </code>
                            <span>인라인 코드</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}