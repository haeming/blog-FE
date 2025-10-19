import { useRef, useState } from "react";
import { Editor } from "@toast-ui/react-editor";
import Prism from "prismjs";
import codeSyntaxHighlight from "@toast-ui/editor-plugin-code-syntax-highlight";
import 'codemirror/lib/codemirror.css';
import "@toast-ui/editor/dist/toastui-editor.css";
import '@toast-ui/editor/dist/i18n/ko-KR';
import "prismjs/themes/prism-okaidia.css";
import "prismjs/components/prism-python";
import "prismjs/components/prism-java";
import colorSyntax from '@toast-ui/editor-plugin-color-syntax';
import '@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css';
import 'tui-color-picker/dist/tui-color-picker.css';
import '../styles/editor.css';
import DOMPurify from "dompurify";
import postApi from "../api/postApi.js";
import usePageService from "../commons/hooks/useNavigationService.js";
import imageApi from "../api/imageApi.js";

export default function PostCreate() {
    const editorRef = useRef();
    const [title, setTitle] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [tags, setTags] = useState([]);
    const [tagInput, setTagInput] = useState("");
    const [files, setFiles] = useState([]);

    const post = postApi();
    const image = imageApi();
    const pageService = usePageService();

    const handleImageInsert = async (blob, callback) => {
        const localUrl = URL.createObjectURL(blob);
        callback(localUrl, "image"); // 프리뷰용으로 먼저 표시

        try {
            const formData = new FormData();
            formData.append("file", blob);

            const result = await image.uploadTempImages(formData);
            const uploadedUrl = Array.isArray(result.result)
                ? result.result[0]
                : result.result;

            setFiles((prev) => [...prev, { blobUrl: localUrl, uploadedUrl }]);
        } catch (error) {
            console.error("이미지 업로드 실패:", error);
        }
    };

    const handleSave = async () => {
        if (!title.trim()) {
            alert("제목을 입력해 주세요.");
            return;
        }

        let markdown = editorRef.current.getInstance().getMarkdown();

        files.forEach(({ blobUrl, uploadedUrl }) => {
            markdown = markdown.replaceAll(blobUrl, uploadedUrl);
        });

        markdown = markdown.replace(/!\[image]\(blob:[^)]+\)/g, "");

        const postData = {
            title,
            content: markdown,
            categoryId: parseInt(categoryId),
        };

        try {
            // 이미지 업로드는 이미 위에서 완료됨. files 필요 없음
            const response = await post.createPost(postData, []);
            console.log("게시글 등록 완료", response);
            alert("게시글 등록 완료!");
            pageService.goToPostDetail(response.result.id);
        } catch (error) {
            console.error("게시글 등록 에러:", error);
            alert("게시글 등록 중 오류가 발생했습니다.");
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
                <div className="flex items-center mb-8">
                    <img src="/icons/post1.png" className="w-12 h-12 text-custom-purple2 inline align-middle"
                         alt="post"/>
                    <h2 className="text-2xl font-bold">
                        새 글 작성
                    </h2>
                </div>

                {/* 제목 입력 */}
                <div
                    className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6 transition-shadow hover:shadow-md">
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
                    <button className="px-6 py-3 text-slate-600 bg-white hover:bg-slate-50 rounded-xl transition-all border border-slate-200 font-medium shadow-sm cursor-pointer">
                        임시저장
                    </button>
                    <div className="flex gap-3">
                        <button className="flex-1 sm:flex-none px-6 py-3 text-slate-600 bg-white hover:bg-slate-50 rounded-xl transition-all border border-slate-200 font-medium shadow-sm cursor-pointer"
                        onClick={pageService.goToBack}>
                            취소
                        </button>
                        <button
                            onClick={handleSave}
                            className="flex-1 sm:flex-none px-8 py-3 bg-gradient-to-r from-custom-purple to-custom-purple2 text-white rounded-xl hover:custom-purple3 hover:to-custom-purple transition-all shadow-lg shadow-purple-500/30 font-medium cursor-pointer"
                        >
                            발행하기
                        </button>
                    </div>
                </div>

                {/* 팁 카드 */}
                <div className="mt-8 bg-gradient-to-r from-custom-red to-custom-red border border-custom-red2 rounded-2xl p-6 shadow-sm">
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