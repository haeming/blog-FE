import { useNavigate } from "react-router-dom";

export default function usePageService(){

    const navigate = useNavigate();

    const goToBack = () => {
        navigate(-1);
    }
    const goToBackTwoSteps = () => {
        navigate(-2);
    }

    const goToHome = () => {
        navigate("/");
    }

    const goToCategory = () => {
        navigate("/category");
    }

    const goToPostList = () => {
        navigate("/post/list");
    }

    const goToPostWrite = () => {
        navigate("/post/write")
    }

    const goToPostDetail = (id) => {
        navigate(`/post/${id}`)
    }

    const goToPostEdit = (id) => {
        navigate(`/post/${id}/edit`)
    }

    return { goToBack, goToBackTwoSteps, goToHome, goToCategory, goToPostList, goToPostWrite, goToPostDetail, goToPostEdit };
}