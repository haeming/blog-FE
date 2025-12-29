import { useEffect, useRef, useState } from "react";
import { Editor } from "@toast-ui/react-editor";
import Prism from "prismjs";
import codeSyntaxHighlight from "@toast-ui/editor-plugin-code-syntax-highlight";
import colorSyntax from "@toast-ui/editor-plugin-color-syntax";

import "codemirror/lib/codemirror.css";
import "@toast-ui/editor/dist/toastui-editor.css";
import "@toast-ui/editor/dist/i18n/ko-KR";
import "prismjs/themes/prism-okaidia.css";
import "prismjs/components/prism-python";
import "prismjs/components/prism-java";
import "@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css";
import "tui-color-picker/dist/tui-color-picker.css";
import "../../styles/editor.css";

import imageApi from "../../api/imageApi.js";
import categoryApi from "../../api/categoryApi.js";
import usePageService from "../../commons/hooks/useNavigationService.js";

export default function PostEditor({
                                       mode = "create", // "create" | "edit"
                                       initialData = null, // { title, content, categoryId } or null
                                       onSubmit, // async ({ title, content, categoryId }) => response
                                   }) {
    const editorRef = useRef();

    const [title, setTitle] = useState(initialData?.title ?? "");
    const [categoryId, setCategoryId] = useState(
        initialData?.categoryId ? String(initialData.categoryId) : ""
    );

    const [categoryList, setCategoryList] = useState([]);
    const [files, setFiles] = useState([]); // { blobUrl, uploadedUrl }

    const image = imageApi();
    const category = categoryApi();
    const pageService = usePageService();

    // 카테고리 로딩
    useEffect(() => {
        const load = async () => {
            try {
                const response = await category.getCategoryList();
                setCategoryList(response);
            } catch (e) {
                console.error("카테고리 리스트 불러오기 에러", e);
            }
        };
        load();
    }, []);

    // 수정 모드에서 initialData 변경 반영 + 에디터 초기화
    useEffect(() => {
        if (!initialData) return;

        setTitle(initialData.title ?? "");
        setCategoryId(initialData.categoryId ? String(initialData.categoryId) : "");

        // 에디터 내용 세팅
        const inst = editorRef.current?.getInstance?.();
        if (inst && typeof initialData.content === "string") {
            inst.setMarkdown(initialData.content);
        }
    }, [initialData]);

    const handleImageInsert = async (blob, callback) => {
        const localUrl = URL.createObjectURL(blob);
        callback(localUrl, "image");

        try {
            const formData = new FormData();
            formData.append("file", blob);

            // imageApi.uploadTempImages가 formData를 받는 형태로 되어 있으니 그대로 유지
            const result = await image.uploadTempImages(formData);
            const uploadedUrl = Array.isArray(result) ? result[0] : result;

            setFiles((prev) => [...prev, { blobUrl: localUrl, uploadedUrl }]);
        } catch (error) {
            console.error("이미지 업로드 실패:", error);
        }
    };

    const buildFinalMarkdown = () => {
        let markdown = editorRef.current.getInstance().getMarkdown();

        // blob URL → 서버 URL 치환
        files.forEach(({ blobUrl, uploadedUrl }) => {
            markdown = markdown.replaceAll(blobUrl, uploadedUrl);
        });

        // 남아있는 blob 이미지 마크다운 제거(업로드 실패/중간취소 등)
        markdown = markdown.replace(/!\[image]\(blob:[^)]+\)/g, "");

        return markdown;
    };

    const handleSubmit = async () => {
        if (!title.trim()) {
            alert("제목을 입력해 주세요.");
            return;
        }

        // 카테고리 필수 여부는 정책에 따라 선택
        // if (!categoryId) { alert("카테고리를 선택해 주세요."); return; }

        const content = buildFinalMarkdown();

        const payload = {
            title: title.trim(),
            content,
            categoryId: categoryId ? parseInt(categoryId, 10) : null,
        };

        try {
            const response = await onSubmit(payload);
            alert(mode === "edit" ? "게시글 수정 완료!" : "게시글 등록 완료!");
            // onSubmit 결과 형태에 맞춰 이동
            if (response?.id) pageService.goToPostDetail(response.id);
            else pageService.goToBack();
        } catch (error) {
            console.error(mode === "edit" ? "게시글 수정 에러:" : "게시글 등록 에러:", error);
            const message =
                error.response?.data?.message ||
                (mode === "edit" ? "게시글 수정에 실패했습니다." : "게시글 등록에 실패했습니다.");
            alert(message);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
                {/* 헤더 */}
                <div className="flex items-center mb-8">
                    <img
                        src="/icons/post1.png"
                        className="w-12 h-12 text-custom-purple2 inline align-middle"
                        alt="post"
                    />
                    <h2 className="text-2xl font-bold">
                        {mode === "edit" ? "글 수정" : "새 글 작성"}
                    </h2>
                </div>

                {/* 제목 & 카테고리 */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6 transition-shadow hover:shadow-md">
                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                        <div className="flex-1 min-w-0">
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="제목을 입력하세요"
                                className="w-full text-2xl sm:text-3xl font-bold outline-none placeholder-slate-300 text-slate-800 leading-normal py-2"
                            />
                        </div>

                        <div className="sm:w-56 flex-shrink-0">
                            <select
                                value={categoryId}
                                onChange={(e) => setCategoryId(e.target.value)}
                                className="w-full bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200 rounded-xl px-4 py-3 outline-none text-slate-700 focus:ring-2 focus:ring-purple-400 focus:border-purple-400 focus:from-white focus:to-purple-50 transition-all cursor-pointer font-semibold text-sm shadow-sm hover:shadow-md hover:border-purple-300"
                                style={{
                                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23a855f7' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                                    backgroundRepeat: "no-repeat",
                                    backgroundPosition: "right 12px center",
                                    paddingRight: "36px",
                                    appearance: "none",
                                    WebkitAppearance: "none",
                                    MozAppearance: "none",
                                }}
                            >
                                <option value="">카테고리 선택</option>
                                {categoryList.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.categoryName}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
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
                        plugins={[[codeSyntaxHighlight, { highlighter: Prism }], colorSyntax]}
                        toolbarItems={[
                            ["heading", "bold", "italic", "strike"],
                            ["hr", "quote"],
                            ["ul", "ol", "task"],
                            ["table", "link", "image"],
                            ["code", "codeblock"],
                        ]}
                        hooks={{ addImageBlobHook: handleImageInsert }}
                        customHTMLSanitizer={(html) => html}
                        initialValue={initialData?.content ?? " "}
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
                        <button
                            className="flex-1 sm:flex-none px-6 py-3 text-slate-600 bg-white hover:bg-slate-50 rounded-xl transition-all border border-slate-200 font-medium shadow-sm cursor-pointer"
                            onClick={pageService.goToBack}
                        >
                            취소
                        </button>
                        <button
                            onClick={handleSubmit}
                            className="flex-1 sm:flex-none px-8 py-3 bg-gradient-to-r from-custom-purple to-custom-purple2 text-white rounded-xl hover:custom-purple3 hover:to-custom-purple transition-all shadow-lg shadow-purple-500/30 font-medium cursor-pointer"
                        >
                            {mode === "edit" ? "수정하기" : "발행하기"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
